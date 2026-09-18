const express = require('express')
const db      = require('../db/connection')
const { verifyToken, requireRole } = require('../middleware/auth')

const router = express.Router()

const VALID_TYPES = new Set([
  'Course Information', 'Enrolment & Admissions', 'Fees & Scholarships',
  'Student Visa Support', 'RPL / Credit Transfer', 'General Enquiry',
])

// Public — anyone can submit the site's Contact form, no login required.
router.post('/', (req, res) => {
  const { name, email, phone, type, message } = req.body
  if (!name?.trim() || !email?.trim() || !VALID_TYPES.has(type) || !message?.trim()) {
    return res.status(400).json({ error: 'Name, email, enquiry type, and message are required' })
  }
  db.prepare(
    'INSERT INTO contact_messages (name, email, phone, enquiry_type, message) VALUES (?, ?, ?, ?, ?)'
  ).run(name.trim(), email.trim(), phone?.trim() || null, type, message.trim())
  return res.status(201).json({ ok: true })
})

router.get('/', verifyToken, requireRole('admin'), (req, res) => {
  const rows = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all()
  return res.json(rows)
})

module.exports = router
