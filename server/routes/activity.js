const express = require('express')
const db      = require('../db/connection')
const { verifyToken, requireRole } = require('../middleware/auth')

const router = express.Router()
router.use(verifyToken, requireRole('admin'))

// Optional ?from&to (inclusive, YYYY-MM-DD) &role &action filters; newest first.
router.get('/', (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 100, 200)
  const { from, to, role, action } = req.query
  const where  = []
  const params = []
  if (from)   { where.push('date(created_at) >= date(?)'); params.push(from) }
  if (to)     { where.push('date(created_at) <= date(?)'); params.push(to) }
  if (role)   { where.push('actor_role = ?');              params.push(role) }
  if (action) { where.push('action = ?');                  params.push(action) }
  const rows = db.prepare(`
    SELECT id, actor_name, actor_role, action, detail, created_at FROM activity_log
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY created_at DESC, id DESC LIMIT ?
  `).all(...params, limit)
  return res.json(rows)
})

module.exports = router
