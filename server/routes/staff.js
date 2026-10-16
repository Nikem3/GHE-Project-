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
      (SELECT COUNT(*) FROM enquiry_messages m WHERE m.sender_id = u.id) AS replies_sent
    FROM users u WHERE u.role = 'staff' ORDER BY u.name
  `).all()
  return res.json(rows)
})

router.post('/', (req, res) => {
  const { name, email, password } = req.body
  if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
    return res.status(400).json({ error: 'Name, email, and a password of at least 6 characters are required' })
  }
  const normalizedEmail = email.trim().toLowerCase()
  if (db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail)) {
    return res.status(409).json({ error: 'A user with this email already exists' })
  }
  const hash = bcrypt.hashSync(password, 10)
  const { lastInsertRowid: id } = db.prepare(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)'
  ).run(name.trim(), normalizedEmail, hash, 'staff')
  logActivity(req.user.sub, req.user.name, req.user.role, 'staff_created', name.trim())
  return res.status(201).json(
    db.prepare('SELECT id, name, email, is_active, created_at FROM users WHERE id = ?').get(id)
  )
})

router.patch('/:id', (req, res) => {
  const staff = db.prepare("SELECT * FROM users WHERE id = ? AND role = 'staff'").get(req.params.id)
  if (!staff) return res.status(404).json({ error: 'Staff member not found' })
  const { name, email, is_active } = req.body
  if (name === undefined && email === undefined && is_active === undefined) {
    return res.status(400).json({ error: 'Nothing to update' })
  }
  if (is_active !== undefined && typeof is_active !== 'boolean') {
    return res.status(400).json({ error: 'is_active must be a boolean' })
  }
  if ((name !== undefined && !String(name).trim()) || (email !== undefined && !/^\S+@\S+$/.test(String(email).trim()))) {
    return res.status(400).json({ error: 'A valid name and email are required' })
  }
  const newName  = name  !== undefined ? String(name).trim() : staff.name
  const newEmail = email !== undefined ? String(email).trim().toLowerCase() : staff.email
  if (db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(newEmail, staff.id)) {
    return res.status(409).json({ error: 'A user with this email already exists' })
  }
  db.prepare('UPDATE users SET name = ?, email = ?, is_active = ? WHERE id = ?')
    .run(newName, newEmail, is_active === undefined ? staff.is_active : (is_active ? 1 : 0), staff.id)
  if (is_active !== undefined && (is_active ? 1 : 0) !== staff.is_active) {
    logActivity(req.user.sub, req.user.name, req.user.role, is_active ? 'staff_reactivated' : 'staff_deactivated', staff.name)
  }
  if (newName !== staff.name || newEmail !== staff.email) {
    logActivity(req.user.sub, req.user.name, req.user.role, 'staff_updated', newName)
  }
  return res.json({ ok: true })
})

router.post('/:id/reset-password', (req, res) => {
  const staff = db.prepare("SELECT * FROM users WHERE id = ? AND role = 'staff'").get(req.params.id)
  if (!staff) return res.status(404).json({ error: 'Staff member not found' })
  const { password } = req.body
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(bcrypt.hashSync(password, 10), staff.id)
  logActivity(req.user.sub, req.user.name, req.user.role, 'staff_password_reset', staff.name)
  return res.json({ ok: true })
})

module.exports = router
