const express = require('express')
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const crypto  = require('crypto')
const db      = require('../db/connection')
const { verifyToken } = require('../middleware/auth')
const { logActivity } = require('../lib/activity')
const { sendMail } = require('../lib/mailer')

const router = express.Router()

router.post('/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase())
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }
  if (!user.is_active) {
    return res.status(403).json({ error: 'This account has been deactivated. Contact an administrator.' })
  }
  const token = jwt.sign(
    { sub: user.id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
  logActivity(user.id, user.name, user.role, 'login')
  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  })
})

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const str = v => (typeof v === 'string' ? v.trim() : '')

const issueToken = user => jwt.sign(
  { sub: user.id, role: user.role, name: user.name },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
)

router.post('/register', (req, res) => {
  const name = str(req.body.name)
  const email = str(req.body.email).toLowerCase()
  const password = req.body.password
  if (!name || !email || typeof password !== 'string') {
    return res.status(400).json({ error: 'Name, email and password are required' })
  }
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Enter a valid email address' })
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })
  if (db.prepare('SELECT 1 FROM users WHERE email = ?').get(email)) {
    return res.status(409).json({ error: 'An account with that email already exists' })
  }
  const { lastInsertRowid } = db
    .prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'student')")
    .run(name, email, bcrypt.hashSync(password, 10))
  const user = { id: Number(lastInsertRowid), name, email, role: 'student' }
  logActivity(user.id, name, 'student', 'student_registered', email)
  return res.status(201).json({ token: issueToken(user), user })
})

router.patch('/me', verifyToken, (req, res) => {
  const name = str(req.body.name)
  if (!name) return res.status(400).json({ error: 'Name is required' })
  db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name, req.user.sub)
  const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(req.user.sub)
  logActivity(user.id, user.name, user.role, 'profile_updated')
  return res.json({ user })
})

router.post('/change-password', verifyToken, (req, res) => {
  const { current, password } = req.body
  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' })
  }
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.sub)
  if (!user || typeof current !== 'string' || !bcrypt.compareSync(current, user.password_hash)) {
    return res.status(400).json({ error: 'Current password is incorrect' })
  }
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(bcrypt.hashSync(password, 10), user.id)
  logActivity(user.id, user.name, user.role, 'password_changed')
  return res.json({ ok: true })
})

router.get('/me', verifyToken, (req, res) => {
  const user = db
    .prepare('SELECT id, name, email, role FROM users WHERE id = ?')
    .get(req.user.sub)
  if (!user) return res.status(401).json({ error: 'Unauthorised' })
  return res.json({ user })
})

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email is required' })

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase())
  // Always respond the same way, whether or not the account exists, to avoid leaking who has an account.
  if (user && user.is_active) {
    const token   = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString()
    db.prepare('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?')
      .run(token, expires, user.id)

    const resetUrl = `${process.env.APP_URL || 'http://localhost:5173'}/reset-password?token=${token}`
    sendMail({
      to: user.email,
      subject: 'Reset your GHE Portal password',
      text: `Hi ${user.name},\n\nWe received a request to reset your GHE Portal password. This link expires in 1 hour:\n\n${resetUrl}\n\nIf you didn't request this, you can safely ignore this email.`,
    }).catch(err => console.error('[mailer] failed to send reset email', err))
  }

  return res.json({ ok: true, message: 'If that email exists, a reset link has been sent.' })
})

router.post('/reset-password', (req, res) => {
  const { token, password } = req.body
  if (!token || !password || password.length < 6) {
    return res.status(400).json({ error: 'A valid token and a password of at least 6 characters are required' })
  }
  const user = db.prepare('SELECT * FROM users WHERE reset_token = ?').get(token)
  if (!user || !user.reset_token_expires || new Date(user.reset_token_expires) < new Date()) {
    return res.status(400).json({ error: 'This reset link is invalid or has expired' })
  }
  db.prepare('UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?')
    .run(bcrypt.hashSync(password, 10), user.id)
  logActivity(user.id, user.name, user.role, 'password_reset_self')
  return res.json({ ok: true })
})

module.exports = router
