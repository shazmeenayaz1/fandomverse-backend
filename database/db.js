import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let db;

if (process.env.VERCEL) {
  // ── Vercel serverless: use sql.js (pure WebAssembly, no native deps) ──
  const initSqlJs = (await import("sql.js")).default;
  const fs = await import("fs");
  const { createRequire } = await import("module");
  const require = createRequire(import.meta.url);

  // Point sql.js to its .wasm binary so Vercel's bundler can find it.
  const wasmPath = require.resolve("sql.js/dist/sql-wasm.wasm");
  const SQL = await initSqlJs({
    locateFile: () => wasmPath,
  });

  // On Vercel, /tmp is the only writable directory.
  const TMP_DB = "/tmp/mydb.sqlite";

  // If the DB file doesn't exist in /tmp yet, start with an empty DB.
  // Tables will be auto-created by the schema init code below + schema files.
  let rawDb;
  try {
    const buf = fs.readFileSync(TMP_DB);
    rawDb = new SQL.Database(buf);
  } catch {
    rawDb = new SQL.Database();
  }

  // Helper: persist the in-memory DB back to /tmp after writes.
  function persist() {
    try {
      const data = rawDb.export();
      fs.writeFileSync(TMP_DB, Buffer.from(data));
    } catch {
      // best effort
    }
  }

  // Build a wrapper that matches the sqlite3 callback API used everywhere:
  //   db.run(sql, params?, cb?)
  //   db.get(sql, params?, cb?)
  //   db.all(sql, params?, cb?)
  //   db.serialize(cb?)
  db = {
    run(sql, ...args) {
      let params = [];
      let cb = undefined;
      for (const a of args) {
        if (typeof a === "function") cb = a;
        else if (Array.isArray(a)) params = a;
        else if (a !== undefined && typeof a === "object") params = a;
        else if (a !== undefined) params.push(a);
      }
      try {
        rawDb.run(sql, params);
        const info = {
          lastID: rawDb.exec("SELECT last_insert_rowid() AS id")[0]?.values[0]?.[0] ?? 0,
          changes: rawDb.getRowsModified(),
        };
        persist();
        if (cb) cb.call(info, null);
      } catch (err) {
        if (cb) cb.call({}, err);
      }
    },

    get(sql, ...args) {
      let params = [];
      let cb = undefined;
      for (const a of args) {
        if (typeof a === "function") cb = a;
        else if (Array.isArray(a)) params = a;
        else if (a !== undefined && typeof a === "object") params = a;
        else if (a !== undefined) params.push(a);
      }
      try {
        const stmt = rawDb.prepare(sql);
        if (Array.isArray(params)) stmt.bind(params);
        else stmt.bind(params);
        let row = undefined;
        if (stmt.step()) {
          const cols = stmt.getColumnNames();
          const vals = stmt.get();
          row = {};
          cols.forEach((c, i) => (row[c] = vals[i]));
        }
        stmt.free();
        if (cb) cb(null, row);
      } catch (err) {
        if (cb) cb(err);
      }
    },

    all(sql, ...args) {
      let params = [];
      let cb = undefined;
      for (const a of args) {
        if (typeof a === "function") cb = a;
        else if (Array.isArray(a)) params = a;
        else if (a !== undefined && typeof a === "object") params = a;
        else if (a !== undefined) params.push(a);
      }
      try {
        const results = rawDb.exec(sql, params);
        let rows = [];
        if (results.length > 0) {
          const cols = results[0].columns;
          rows = results[0].values.map((vals) => {
            const row = {};
            cols.forEach((c, i) => (row[c] = vals[i]));
            return row;
          });
        }
        if (cb) cb(null, rows);
      } catch (err) {
        if (cb) cb(err);
      }
    },

    serialize(cb) {
      // sql.js is synchronous, so just run the callback immediately
      if (cb) cb();
    },
  };
} else {
  // ── Local development: use native sqlite3 (fast, full-featured) ──
  const sqlite3 = (await import("sqlite3")).default;
  sqlite3.verbose();

  const DB_PATH = path.join(__dirname, "..", "mydb.sqlite");

  db = new sqlite3.Database(DB_PATH);

  // Foreign keys are required by the Search & Community module
  // (ON DELETE CASCADE on posts / comments).
  db.run("PRAGMA foreign_keys = ON");

  // ---------------------------------------------------------------
  // Performance pragmas.
  // ---------------------------------------------------------------
  db.serialize(() => {
    db.run("PRAGMA journal_mode = WAL");
    db.run("PRAGMA synchronous = NORMAL");
    db.run("PRAGMA temp_store = MEMORY");
    db.run("PRAGMA cache_size = -32000");
    db.run("PRAGMA busy_timeout = 5000");
    db.run("PRAGMA wal_autocheckpoint = 512");
  });
}

// ── Users table (always needed, both local & Vercel) ──
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      verified INTEGER DEFAULT 0,
      verificationCode TEXT,
      resetCode TEXT,
      avatar_url TEXT
    )
  `);

  db.run(`ALTER TABLE users ADD COLUMN resetCode TEXT`, (err) => {});
  db.run(`ALTER TABLE users ADD COLUMN avatar_url TEXT`, (err) => {});
});

export default db;
