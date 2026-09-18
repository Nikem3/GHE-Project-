const express = require('express')
const db      = require('../db/connection')
const { verifyToken, requireRole } = require('../middleware/auth')

const router = express.Router()
router.use(verifyToken, requireRole('admin'))

router.get('/', (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 100, 200)
  const rows = db.prepare(
    'SELECT id, actor_name, actor_role, action, detail, created_at FROM activity_log ORDER BY created_at DESC, id DESC LIMIT ?'
  ).all(limit)
  return res.json(rows)
})

module.exports = router
