const { DatabaseSync } = require('node:sqlite')
const path             = require('path')
const fs               = require('fs')

const DB_PATH     = process.env.DB_PATH || path.join(__dirname, '..', 'ghe.db')
const SCHEMA_PATH = path.join(__dirname, 'schema.sql')

const db = new DatabaseSync(DB_PATH)
db.exec('PRAGMA journal_mode = WAL')
db.exec('PRAGMA foreign_keys = ON')

const schema = fs.readFileSync(SCHEMA_PATH, 'utf8')
db.exec(schema)

// Existing local DBs predate enquiries.assigned_to
if (!db.prepare('PRAGMA table_info(enquiries)').all().some(c => c.name === 'assigned_to')) {
  db.exec('ALTER TABLE enquiries ADD COLUMN assigned_to INTEGER REFERENCES users(id)')
}

module.exports = db
