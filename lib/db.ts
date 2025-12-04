import path from 'path';
import fs from 'fs';

// Provide a simple in-memory fallback for builds or when SQLite isn't available.
type PredictionRow = {
  id: number;
  image_name: string;
  image_url?: string | null;
  predicted_class: string;
  confidence: number;
  probability_bleached: number;
  probability_healthy: number;
  created_at: string;
};

// Database path
// Allow overriding the path via an environment variable for different deployments.
const DEFAULT_DB_DIR = path.join(process.cwd(), 'data');
const dbPath = process.env.PREDICTIONS_DB_PATH || path.join(DEFAULT_DB_DIR, 'coral-predictions.db');

// Diagnose DB path on startup to make debugging easier.
try {
  // Note: This runs at import time and helps surface path problems early.
  const parentDir = path.dirname(dbPath);
  if (parentDir) {
    // Create the data directory if it doesn't exist for local dev
    try {
      fs.mkdirSync(parentDir, { recursive: true });
  } catch {
      // Ignore: could be read-only file system in production builds; we'll handle later
    }
  }
} catch {
  // Keep this quiet—only a diagnostic fallback
}

interface PreparedStmt {
  run?: (...args: unknown[]) => unknown;
  all?: (...args: unknown[]) => unknown;
  get?: (...args: unknown[]) => unknown;
}

interface QueryResult {
  all?: (...args: unknown[]) => unknown;
  get?: (...args: unknown[]) => unknown;
}

interface SqliteInstance {
  run?: (sql: string, params?: unknown[] | unknown) => unknown;
  prepare?: (sql: string) => PreparedStmt;
  query?: (sql: string) => QueryResult;
}

let db: SqliteInstance | null = null;
let useInMemory = false;
let inMemoryData: PredictionRow[] = [];
let inMemoryId = 1;

async function createDbInstance() {
  if (db) return db;

  // Prefer Bun sqlite in Bun runtime
  const isBun =
    typeof process !== 'undefined' &&
    (process as unknown as { versions?: { bun?: string } }).versions?.bun !== undefined;

  try {
    if (isBun) {
      // Dynamically import bun:sqlite to prevent static resolution when not running in Bun
      const bunSqlite = await import('bun:sqlite');
  type BunDatabaseCtor = new (p: string, opts?: unknown) => SqliteInstance;
  const { Database } = bunSqlite as unknown as { Database: BunDatabaseCtor };
      // Ensure we can create the directory for the database file where applicable.
      const parent = path.dirname(dbPath);
      try {
        if (parent && parent !== '.' && parent !== '/') {
          fs.mkdirSync(parent, { recursive: true });
        }
      } catch (mkdirErr) {
        console.warn('⚠️ Could not create database directory:', mkdirErr);
      }

      try {
        // Check writable access to the parent directory before opening DB.
        if (parent) {
          try {
            fs.accessSync(parent, fs.constants.W_OK);
          } catch (accessErr) {
            console.warn(`⚠️ No write access to DB directory ${parent}:`, accessErr);
          }
        }
  } catch {
        // ignore
      }

      try {
        db = new Database(dbPath, { create: true });
        console.log('✅ Bun sqlite opened DB path:', dbPath);
        return db;
      } catch (dbErr) {
        // Most likely a permission or read-only filesystem; provide a helpful message.
        console.error(`⚠️ Failed to open SQLite DB at path ${dbPath}:`, dbErr);
        useInMemory = true;
        inMemoryData = [];
        inMemoryId = 1;
        return null;
      }
    }

    // Try Node sqlite fallback (optional package), prefer `better-sqlite3` if installed
    try {
      // Try to load Node sqlite implementation if present. No types required.
      // Use dynamic import with try-catch to avoid static resolution.
      let betterSqliteMod: unknown;
      try {
        // @ts-expect-error optional dependency
        betterSqliteMod = await import('better-sqlite3');
      } catch {
        // Not available -> fall back
        throw new Error('better-sqlite3 not available');
      }

      const BetterSqliteCtor = ((betterSqliteMod as unknown as { default?: new (p: string, opts?: unknown) => SqliteInstance }).default ?? (betterSqliteMod as unknown as new (p: string, opts?: unknown) => SqliteInstance)) as new (p: string, opts?: unknown) => SqliteInstance;
      // Make sure parent directory exists for the DB file.
      try {
        const parent = path.dirname(dbPath);
        if (parent && parent !== '.' && parent !== '/') {
          fs.mkdirSync(parent, { recursive: true });
        }
        try {
          fs.accessSync(parent, fs.constants.W_OK);
        } catch (accessErr) {
          console.warn(`⚠️ No write access to DB directory ${parent} for better-sqlite3:`, accessErr);
        }
      } catch (mkdirErr) {
        console.warn('⚠️ Could not create database directory for better-sqlite3:', mkdirErr);
      }
      db = new BetterSqliteCtor(dbPath);
      return db;
    } catch {
      // `better-sqlite3` not installed or not available; fall back to in-memory store
      useInMemory = true;
      inMemoryData = [];
      inMemoryId = 1;
      console.log('⚠️ SQLite not available; using in-memory DB fallback (no file storage)');
      return null;
    }
  } catch (err) {
    // Any error in dynamic imports -> fallback to in-memory
    useInMemory = true;
    inMemoryData = [];
    inMemoryId = 1;
  console.log('⚠️ Failed to initialize DB module; using in-memory DB fallback', err);
    return null;
  }
}

export async function initDatabase() {
  const instance = await createDbInstance();
  if (useInMemory) {
    // nothing else to do
    console.log('⚠️ Using in-memory database');
    return;
  }
  if (!instance) {
    throw new Error('Database instance not available');
  }

  // Create predictions table
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS predictions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_name TEXT NOT NULL,
      image_url TEXT,
      predicted_class TEXT NOT NULL,
      confidence REAL NOT NULL,
      probability_bleached REAL NOT NULL,
      probability_healthy REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  try {
    instance.run?.(createTableSQL);
    console.log('✅ Database table created/verified');
    
    // Verify table was created by querying it
    try {
      instance.run?.('SELECT 1 FROM predictions LIMIT 1');
      console.log('✅ Verified predictions table exists and is accessible');
    } catch {
      // If the table doesn't exist, this query will fail
      console.log('ℹ️  Creating fresh predictions table (may not have existed)');
      // Try to recreate it
      instance.run?.('DROP TABLE IF EXISTS predictions');
      instance.run?.(createTableSQL);
      console.log('✅ Fresh predictions table created');
    }
  } catch (tableErr) {
    console.error('❌ Failed to create/verify predictions table:', tableErr);
    throw tableErr;
  }
}

// Insert new prediction
export async function insertPrediction(data: {
  imageName: string;
  imageUrl?: string;
  predictedClass: string;
  confidence: number;
  probabilityBleached: number;
  probabilityHealthy: number;
}): Promise<{ lastInsertRowid?: number; changes?: number }>
{
  const instance = await createDbInstance();
  await initDatabase();

  if (!instance) {
    throw new Error('Database instance not available');
  }

  if (useInMemory) {
    const row: PredictionRow = {
      id: inMemoryId++,
      image_name: data.imageName,
      image_url: data.imageUrl || null,
      predicted_class: data.predictedClass,
      confidence: data.confidence,
      probability_bleached: data.probabilityBleached,
      probability_healthy: data.probabilityHealthy,
      created_at: new Date().toISOString(),
    };
    inMemoryData.unshift(row);
    console.log('✅ Prediction saved to in-memory DB:', row.id);
    return { lastInsertRowid: row.id, changes: 1 };
  }

  const prepareFn = instance.prepare;
  if (!prepareFn) {
    throw new Error('Database prepare method not available');
  }
  const stmt = prepareFn.call(instance, `
    INSERT INTO predictions (
      image_name, image_url, predicted_class, confidence,
      probability_bleached, probability_healthy
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  if (typeof stmt.run !== 'function') {
    throw new Error('Prepared statement run method not available');
  }
  const result = stmt.run(
    data.imageName,
    data.imageUrl || null,
    data.predictedClass,
    data.confidence,
    data.probabilityBleached,
    data.probabilityHealthy
  );

  // The `result` shape depends on the sqlite implementation; normalize it
  type RunResult = { lastInsertRowid?: number; lastID?: number; changes?: number };
  const r = result as unknown as RunResult;
  const insertId = r.lastInsertRowid ?? r.lastID;
  console.log('✅ Prediction saved to SQLite DB:', insertId);
  return {
    lastInsertRowid: insertId,
    changes: r.changes,
  };
}

// Get all predictions
export async function getAllPredictions(): Promise<PredictionRow[]> {
  const instance = await createDbInstance();
  if (useInMemory) {
    return inMemoryData;
  }
  if (!instance) {
    throw new Error('Database instance not available');
  }
  const prepareFn = instance.prepare;
  if (typeof prepareFn === 'function') {
    const stmt = prepareFn.call(instance, 'SELECT * FROM predictions ORDER BY created_at DESC') as PreparedStmt;
    if (typeof stmt.all === 'function') {
      return stmt.all() as PredictionRow[];
    }
  }
  const queryFn = instance.query;
  if (typeof queryFn === 'function') {
    const queryRes = queryFn.call(instance, 'SELECT * FROM predictions ORDER BY created_at DESC') as QueryResult;
    if (typeof queryRes.all === 'function') {
      return queryRes.all() as PredictionRow[];
    }
  }
  return [];
}

// Get prediction by ID
export async function getPredictionById(id: number): Promise<PredictionRow | null> {
  const instance = await createDbInstance();
  if (useInMemory) {
  return inMemoryData.find((r) => r.id === id) || null;
  }
  if (!instance) {
    throw new Error('Database instance not available');
  }
  const prepareFn2 = instance.prepare;
  if (typeof prepareFn2 === 'function') {
    const stmt = prepareFn2.call(instance, 'SELECT * FROM predictions WHERE id = ?') as PreparedStmt;
    if (typeof stmt.get === 'function') {
      return stmt.get(id) as PredictionRow | null;
    }
  }
  const queryFn2 = instance.query;
  if (typeof queryFn2 === 'function') {
    const queryRes2 = queryFn2.call(instance, 'SELECT * FROM predictions WHERE id = ?') as QueryResult;
    if (typeof queryRes2.get === 'function') {
      return queryRes2.get(id) as PredictionRow | null;
    }
  }
  return null;
}

// Get recent predictions (limit)
export async function getRecentPredictions(limit = 10): Promise<PredictionRow[]> {
  const instance = await createDbInstance();
  if (useInMemory) {
    return inMemoryData.slice(0, limit);
  }
  if (!instance) {
    throw new Error('Database instance not available');
  }
  const prepareFn3 = instance.prepare;
  if (typeof prepareFn3 === 'function') {
    const stmt = prepareFn3.call(instance, 'SELECT * FROM predictions ORDER BY created_at DESC LIMIT ?') as PreparedStmt;
    if (typeof stmt.all === 'function') {
      return stmt.all(limit) as PredictionRow[];
    }
  }
  const queryFn3 = instance.query;
  if (typeof queryFn3 === 'function') {
    const queryRes3 = queryFn3.call(instance, 'SELECT * FROM predictions ORDER BY created_at DESC LIMIT ?') as QueryResult;
    if (typeof queryRes3.all === 'function') {
      return queryRes3.all(limit) as PredictionRow[];
    }
  }
  return [];
}

// Get predictions count
export async function getPredictionsCount() {
  const instance = await createDbInstance();
  if (useInMemory) {
    return inMemoryData.length;
  }
  if (!instance) {
    throw new Error('Database instance not available');
  }
  const prepareFn4 = instance.prepare;
  if (typeof prepareFn4 === 'function') {
    const stmt = prepareFn4.call(instance, 'SELECT COUNT(*) as count FROM predictions') as PreparedStmt;
    if (typeof stmt.get === 'function') {
      const result = stmt.get() as { count?: number } | undefined;
      return (result && result.count) || 0;
    }
  }
  const queryFn4 = instance.query;
  if (typeof queryFn4 === 'function') {
    const queryRes4 = queryFn4.call(instance, 'SELECT COUNT(*) as count FROM predictions') as QueryResult;
    if (typeof queryRes4.get === 'function') {
      const result = queryRes4.get() as { count?: number } | undefined;
      return (result && result.count) || 0;
    }
  }
  return 0;
}

// Get predictions by class
export async function getPredictionsByClass(className: 'Healthy' | 'Bleached'): Promise<PredictionRow[]> {
  const instance = await createDbInstance();
  if (useInMemory) {
    return inMemoryData.filter((r) => r.predicted_class === className);
  }
  if (!instance) {
    throw new Error('Database instance not available');
  }
  const prepareFn5 = instance.prepare;
  if (typeof prepareFn5 === 'function') {
    const stmt = prepareFn5.call(instance, 'SELECT * FROM predictions WHERE predicted_class = ? ORDER BY created_at DESC') as PreparedStmt;
    if (typeof stmt.all === 'function') {
      return stmt.all(className) as PredictionRow[];
    }
  }
  const queryFn5 = instance.query;
  if (typeof queryFn5 === 'function') {
    const queryRes5 = queryFn5.call(instance, 'SELECT * FROM predictions WHERE predicted_class = ? ORDER BY created_at DESC') as QueryResult;
    if (typeof queryRes5.all === 'function') {
      return queryRes5.all(className) as PredictionRow[];
    }
  }
  return [];
}

// Delete prediction
export async function deletePrediction(id: number) {
  const instance = await createDbInstance();
  if (useInMemory) {
    const originalLen = inMemoryData.length;
    inMemoryData = inMemoryData.filter((r) => r.id !== id);
    return { changes: originalLen - inMemoryData.length };
  }
  if (!instance) {
    throw new Error('Database instance not available');
  }
  const prepareFn6 = instance.prepare;
  if (typeof prepareFn6 === 'function') {
    const stmt = prepareFn6.call(instance, 'DELETE FROM predictions WHERE id = ?') as PreparedStmt;
    if (typeof stmt.run === 'function') {
      return stmt.run(id);
    }
  }
  if (typeof instance.run === 'function') {
    return instance.run('DELETE FROM predictions WHERE id = ?', [id]);
  }
  return { changes: 0 };
}