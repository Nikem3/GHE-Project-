const express = require('express')
const bcrypt  = require('bcryptjs')
const db      = require('../db/connection')
const { verifyToken, requireRole } = require('../middleware/auth')
const { logActivity } = require('../lib/activity')

const router = express.Router()
router.use(verifyToken, requireRole('admin'))

router.get('/', (req, res) => {
  const rows = db.prepare(`
    SELECT u.id, u.name, u.email, u.is_active, u.created_at,
      (SELECT COUNT(*) FROM enquiries e WHERE e.student_id = u.id) AS enquiry_count
    FROM users u WHERE u.role = ? ORDER BY u.name
  `).all(req.query.role === 'staff' ? 'staff' : 'student')
  return res.json(rows)
})

const findTarget = id => db.prepare("SELECT * FROM users WHERE id = ? AND role != 'admin'").get(id)

router.patch('/:id', (req, res) => {
  const user = findTarget(req.params.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  if (typeof req.body.is_active !== 'boolean') {
    return res.status(400).json({ error: 'is_active (boolean) is required' })
  }
  db.prepare('UPDATE users SET is_active = ? WHERE id = ?').run(req.body.is_active ? 1 : 0, user.id)
  logActivity(req.user.sub, req.user.name, req.user.role,
    req.body.is_active ? 'user_reactivated' : 'user_deactivated', user.name)
  return res.json({ ok: true })
})

router.post('/:id/reset-password', (req, res) => {
  const user = findTarget(req.params.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  const { password } = req.body
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(bcrypt.hashSync(password, 10), user.id)
  logActivity(req.user.sub, req.user.name, req.user.role, 'user_password_reset', user.name)
  return res.json({ ok: true })
})

module.exports = router
