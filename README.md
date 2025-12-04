# website-neuro-bun

Minimal instructions to run this project with Bun or in Docker.

Local (Bun):

```bash
# Install packages with Bun
bun install

# Run dev server
bun dev
```

Local (npm/Node fallback):

```bash
npm install
npm run dev
```

Build and run with Docker (production):

```bash
docker build -t neuro .
docker run --rm -p 3000:3000 -v $(pwd)/data:/app/data -e PREDICTIONS_DB_PATH=/app/data/coral-predictions.db neuro
```

Notes:
- The app attempts to use Bun's sqlite runtime (`bun:sqlite`) when available. If not available, it will fall back to `better-sqlite3` (if installed) or to an in-memory fallback.
- If you run into `SQLiteError: unable to open database file` errors, check that the `data/` directory exists and is writable by the runtime. Mounting a writable host directory as shown above is recommended in Docker.
- The `PREDICTIONS_DB_PATH` env variable can be used to override the path of the SQLite database file.
```
npm install
npm run dev
```
