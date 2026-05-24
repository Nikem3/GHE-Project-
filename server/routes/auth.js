const express = require('express')
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const db      = require('../db/connection')
const { verifyToken } = require('../middleware/auth')

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
  const token = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  })
})

router.get('/me', verifyToken, (req, res) => {
  const user = db
    .prepare('SELECT id, name, email, role FROM users WHERE id = ?')
    .get(req.user.sub)
  if (!user) return res.status(401).json({ error: 'Unauthorised' })
  return res.json({ user })
})

module.exports = router
