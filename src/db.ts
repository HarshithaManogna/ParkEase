import Database from 'better-sqlite3';

const db = new Database('parkease.db');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('owner', 'driver')) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS parking_spaces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    owner_id INTEGER NOT NULL,
    location TEXT NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    price_hourly REAL,
    price_daily REAL,
    price_monthly REAL,
    facilities TEXT, -- JSON string array
    images TEXT, -- JSON string array
    rating REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parking_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    owner_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    time_duration TEXT NOT NULL,
    vehicle_type TEXT NOT NULL,
    vehicle_number TEXT NOT NULL,
    status TEXT CHECK(status IN ('Pending', 'Accepted', 'Rejected', 'Completed')) DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parking_id) REFERENCES parking_spaces(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

export default db;
