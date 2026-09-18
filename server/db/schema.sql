CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  email         TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  role          TEXT    NOT NULL CHECK(role IN ('student','staff','admin')),
  is_active     INTEGER NOT NULL DEFAULT 1,
  reset_token         TEXT,
  reset_token_expires TEXT,
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

CREATE TABLE IF NOT EXISTS enquiries (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES users(id),
  course_id  INTEGER REFERENCES courses(id),
  subject    TEXT    NOT NULL,
  status     TEXT    NOT NULL DEFAULT 'open' CHECK(status IN ('open','in_progress','resolved')),
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS enquiry_messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  enquiry_id INTEGER NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
  sender_id  INTEGER NOT NULL REFERENCES users(id),
  body       TEXT    NOT NULL,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS activity_log (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_id   INTEGER REFERENCES users(id),
  actor_name TEXT    NOT NULL,
  actor_role TEXT    NOT NULL,
  action     TEXT    NOT NULL,
  detail     TEXT,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT    NOT NULL,
  email        TEXT    NOT NULL,
  phone        TEXT,
  enquiry_type TEXT    NOT NULL,
  message      TEXT    NOT NULL,
  created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);
