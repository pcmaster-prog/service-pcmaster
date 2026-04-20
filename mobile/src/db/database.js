import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('pc_master.db');

export const initDb = async () => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      lat REAL,
      lng REAL,
      rating INTEGER DEFAULT 5,
      balance REAL DEFAULT 0.0
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER,
      description TEXT,
      status TEXT DEFAULT 'open', -- open, executing, finished, pending_payment
      amount REAL,
      commission_type TEXT, -- fixed, percentage
      commission_value REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    );
  `);
  console.log('Database initialized');
};
