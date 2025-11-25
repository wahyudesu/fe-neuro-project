import { Database } from 'bun:sqlite';
import path from 'path';

// Database path
const dbPath = path.join(process.cwd(), 'coral-predictions.db');

// Create or open database
export const db = new Database(dbPath, { create: true });

// Initialize tables
export function initDatabase() {
  // Create predictions table
  db.run(`
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
  `);

  console.log('✅ Database initialized');
}

// Insert new prediction
export function insertPrediction(data: {
  imageName: string;
  imageUrl?: string;
  predictedClass: string;
  confidence: number;
  probabilityBleached: number;
  probabilityHealthy: number;
}) {
  const stmt = db.prepare(`
    INSERT INTO predictions (
      image_name, image_url, predicted_class, confidence,
      probability_bleached, probability_healthy
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  return stmt.run(
    data.imageName,
    data.imageUrl || null,
    data.predictedClass,
    data.confidence,
    data.probabilityBleached,
    data.probabilityHealthy
  );
}

// Get all predictions
export function getAllPredictions() {
  return db.query('SELECT * FROM predictions ORDER BY created_at DESC').all();
}

// Get prediction by ID
export function getPredictionById(id: number) {
  return db.query('SELECT * FROM predictions WHERE id = ?').get(id);
}

// Get recent predictions (limit)
export function getRecentPredictions(limit = 10) {
  return db.query('SELECT * FROM predictions ORDER BY created_at DESC LIMIT ?').all(limit);
}

// Get predictions count
export function getPredictionsCount() {
  const result = db.query('SELECT COUNT(*) as count FROM predictions').get() as { count: number };
  return result.count;
}

// Get predictions by class
export function getPredictionsByClass(className: 'Healthy' | 'Bleached') {
  return db.query('SELECT * FROM predictions WHERE predicted_class = ? ORDER BY created_at DESC').all(className);
}

// Delete prediction
export function deletePrediction(id: number) {
  return db.run('DELETE FROM predictions WHERE id = ?', [id]);
}

// Initialize database on import
initDatabase();
