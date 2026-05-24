CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  email         TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  role          TEXT    NOT NULL CHECK(role IN ('student','staff','admin')),
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS courses (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  title          TEXT    NOT NULL,
  level          TEXT    NOT NULL CHECK(level IN ('bachelor','master','diploma')),
  faculty        TEXT    NOT NULL,
  duration_years REAL    NOT NULL,
  description    TEXT    NOT NULL,
  fee_per_year   INTEGER NOT NULL,
  intakes        TEXT    NOT NULL,
  is_active      INTEGER NOT NULL DEFAULT 1,
  created_at     TEXT    NOT NULL DEFAULT (datetime('now'))
);
