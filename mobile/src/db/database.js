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

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      base_price REAL NOT NULL,
      commission_percentage REAL DEFAULT 10.0
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      service_id INTEGER,
      price_at_time REAL,
      tech_commission REAL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (service_id) REFERENCES services(id)
    );
  `);
  console.log('Database initialized');
};
