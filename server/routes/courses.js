const express = require('express')
const db      = require('../db/connection')

const router       = express.Router()
const VALID_LEVELS = new Set(['bachelor', 'master', 'diploma'])

router.get('/', (req, res) => {
  const { level } = req.query
  let query  = 'SELECT * FROM courses WHERE is_active = 1'
  const params = []
  if (level && VALID_LEVELS.has(level)) {
    query += ' AND level = ?'
    params.push(level)
  }
  query += ' ORDER BY level, title'
  const rows = db.prepare(query).all(...params)
  return res.json(rows.map(r => ({ ...r, intakes: JSON.parse(r.intakes) })))
})

router.get('/:id', (req, res) => {
  const row = db
    .prepare('SELECT * FROM courses WHERE id = ? AND is_active = 1')
    .get(req.params.id)
  if (!row) return res.status(404).json({ error: 'Course not found' })
  return res.json({ ...row, intakes: JSON.parse(row.intakes) })
})

module.exports = router
