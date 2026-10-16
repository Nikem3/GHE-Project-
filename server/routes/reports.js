const express = require('express')
const db      = require('../db/connection')
const { verifyToken, requireRole } = require('../middleware/auth')

const router = express.Router()
router.use(verifyToken, requireRole('staff', 'admin'))

// Org-wide enquiry report for an optional [from, to] date range (inclusive, YYYY-MM-DD).
router.get('/enquiries', (req, res) => {
  const { from, to } = req.query
  const where  = []
  const params = []
  if (from) { where.push('date(e.created_at) >= date(?)'); params.push(from) }
  if (to)   { where.push('date(e.created_at) <= date(?)'); params.push(to) }
  const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : ''

  const totals = db.prepare(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN status = 'open'        THEN 1 ELSE 0 END) AS open,
      SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress,
      SUM(CASE WHEN status = 'resolved'    THEN 1 ELSE 0 END) AS resolved,
      SUM(CASE WHEN assigned_to IS NULL AND status != 'resolved' THEN 1 ELSE 0 END) AS unassigned
    FROM enquiries e ${whereClause}
  `).get(...params)

  const byCourse = db.prepare(`
    SELECT COALESCE(c.title, 'General enquiry') AS course, COUNT(*) AS count
    FROM enquiries e LEFT JOIN courses c ON c.id = e.course_id
    ${whereClause}
    GROUP BY course ORDER BY count DESC
  `).all(...params)

  const byDay = db.prepare(`
    SELECT date(e.created_at) AS day, COUNT(*) AS count
    FROM enquiries e ${whereClause}
    GROUP BY day ORDER BY day
  `).all(...params)

  const avg = db.prepare(`
    SELECT AVG((julianday(r.first_reply) - julianday(e.created_at)) * 24) AS hrs
    FROM enquiries e
    JOIN (
      SELECT m.enquiry_id, MIN(m.created_at) AS first_reply
      FROM enquiry_messages m JOIN users u ON u.id = m.sender_id
      WHERE u.role IN ('staff','admin')
      GROUP BY m.enquiry_id
    ) r ON r.enquiry_id = e.id
    ${whereClause}
  `).get(...params)

  // Replies are counted by message date, assignments by enquiry creation date, both within the range.
  const msgWhere = where.map(w => w.replace(/e\.created_at/, 'm.created_at'))
  const byStaff = db.prepare(`
    SELECT u.name AS staff,
      (SELECT COUNT(*) FROM enquiry_messages m WHERE m.sender_id = u.id
        ${msgWhere.length ? 'AND ' + msgWhere.join(' AND ') : ''}) AS replies,
      (SELECT COUNT(*) FROM enquiries e WHERE e.assigned_to = u.id
        ${where.length ? 'AND ' + where.join(' AND ') : ''}) AS assigned
    FROM users u WHERE u.role IN ('staff','admin')
    ORDER BY replies DESC, assigned DESC, u.name
  `).all(...params, ...params)

  return res.json({
    totals: { ...totals, avgResponseHours: avg.hrs == null ? null : Math.round(avg.hrs * 10) / 10 },
    byCourse,
    byDay,
    byStaff,
  })
})

module.exports = router
