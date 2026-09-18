const express = require('express')
const db      = require('../db/connection')
const { verifyToken, requireRole } = require('../middleware/auth')
const { logActivity } = require('../lib/activity')

const router = express.Router()
router.use(verifyToken)

const VALID_STATUSES = new Set(['open', 'in_progress', 'resolved'])

function getEnquiry(id) {
  return db.prepare(`
    SELECT e.*, u.name AS student_name, c.title AS course_title
    FROM enquiries e
    JOIN users u ON u.id = e.student_id
    LEFT JOIN courses c ON c.id = e.course_id
    WHERE e.id = ?
  `).get(id)
}

function canView(user, enquiry) {
  return user.role !== 'student' || enquiry.student_id === user.sub
}

// Students see their own enquiries; staff/admin see all. Optional ?status= filter.
router.get('/', (req, res) => {
  const where  = []
  const params = []
  if (req.user.role === 'student') {
    where.push('e.student_id = ?')
    params.push(req.user.sub)
  }
  if (req.query.status && VALID_STATUSES.has(req.query.status)) {
    where.push('e.status = ?')
    params.push(req.query.status)
  }
  const rows = db.prepare(`
    SELECT e.id, e.subject, e.status, e.created_at, e.updated_at,
           u.name AS student_name, c.title AS course_title,
           (SELECT COUNT(*) FROM enquiry_messages m WHERE m.enquiry_id = e.id) AS message_count
    FROM enquiries e
    JOIN users u ON u.id = e.student_id
    LEFT JOIN courses c ON c.id = e.course_id
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY e.updated_at DESC
  `).all(...params)
  return res.json(rows)
})

router.get('/stats', requireRole('staff', 'admin'), (req, res) => {
  const open = db.prepare("SELECT COUNT(*) AS n FROM enquiries WHERE status = 'open'").get().n
  const respondedToday = db.prepare(`
    SELECT COUNT(DISTINCT m.enquiry_id) AS n
    FROM enquiry_messages m JOIN users u ON u.id = m.sender_id
    WHERE u.role IN ('staff','admin') AND date(m.created_at) = date('now')
  `).get().n
  const avg = db.prepare(`
    SELECT AVG((julianday(r.first_reply) - julianday(e.created_at)) * 24) AS hrs
    FROM enquiries e
    JOIN (
      SELECT m.enquiry_id, MIN(m.created_at) AS first_reply
      FROM enquiry_messages m JOIN users u ON u.id = m.sender_id
      WHERE u.role IN ('staff','admin')
      GROUP BY m.enquiry_id
    ) r ON r.enquiry_id = e.id
  `).get().hrs
  const totalStudents = db.prepare('SELECT COUNT(DISTINCT student_id) AS n FROM enquiries').get().n
  return res.json({
    open,
    respondedToday,
    avgResponseHours: avg == null ? null : Math.round(avg * 10) / 10,
    totalStudents,
  })
})

router.get('/:id', (req, res) => {
  const enquiry = getEnquiry(req.params.id)
  if (!enquiry || !canView(req.user, enquiry)) {
    return res.status(404).json({ error: 'Enquiry not found' })
  }
  const messages = db.prepare(`
    SELECT m.id, m.body, m.created_at, u.name AS sender_name, u.role AS sender_role
    FROM enquiry_messages m JOIN users u ON u.id = m.sender_id
    WHERE m.enquiry_id = ?
    ORDER BY m.created_at, m.id
  `).all(enquiry.id)
  return res.json({ ...enquiry, messages })
})

router.post('/', requireRole('student'), (req, res) => {
  const { course_id, subject, message } = req.body
  if (!subject?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Subject and message are required' })
  }
  if (course_id != null && !db.prepare('SELECT id FROM courses WHERE id = ?').get(course_id)) {
    return res.status(400).json({ error: 'Invalid course' })
  }
  const { lastInsertRowid: id } = db.prepare(
    'INSERT INTO enquiries (student_id, course_id, subject) VALUES (?, ?, ?)'
  ).run(req.user.sub, course_id ?? null, subject.trim())
  db.prepare('INSERT INTO enquiry_messages (enquiry_id, sender_id, body) VALUES (?, ?, ?)')
    .run(id, req.user.sub, message.trim())
  return res.status(201).json(getEnquiry(id))
})

// Owner student or staff/admin can reply; a staff reply moves open → in_progress.
router.post('/:id/messages', (req, res) => {
  const enquiry = getEnquiry(req.params.id)
  if (!enquiry || !canView(req.user, enquiry)) {
    return res.status(404).json({ error: 'Enquiry not found' })
  }
  if (!req.body.body?.trim()) {
    return res.status(400).json({ error: 'Message body is required' })
  }
  db.prepare('INSERT INTO enquiry_messages (enquiry_id, sender_id, body) VALUES (?, ?, ?)')
    .run(enquiry.id, req.user.sub, req.body.body.trim())
  const nextStatus =
    req.user.role !== 'student' && enquiry.status === 'open' ? 'in_progress' : enquiry.status
  db.prepare("UPDATE enquiries SET status = ?, updated_at = datetime('now') WHERE id = ?")
    .run(nextStatus, enquiry.id)
  return res.status(201).json({ ok: true, status: nextStatus })
})

router.patch('/:id', requireRole('staff', 'admin'), (req, res) => {
  const { status } = req.body
  if (!VALID_STATUSES.has(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }
  const result = db.prepare(
    "UPDATE enquiries SET status = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(status, req.params.id)
  if (result.changes === 0) return res.status(404).json({ error: 'Enquiry not found' })
  logActivity(req.user.sub, req.user.name, req.user.role, 'enquiry_status_changed', `#${req.params.id} → ${status}`)
  return res.json(getEnquiry(req.params.id))
})

module.exports = router
