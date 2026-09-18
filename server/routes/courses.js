const express = require('express')
const db      = require('../db/connection')
const { verifyToken, requireRole } = require('../middleware/auth')
const { logActivity } = require('../lib/activity')

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

// Staff/admin management view — includes inactive courses.
router.get('/manage/all', verifyToken, requireRole('staff', 'admin'), (req, res) => {
  const rows = db.prepare('SELECT * FROM courses ORDER BY level, title').all()
  return res.json(rows.map(r => ({ ...r, intakes: JSON.parse(r.intakes) })))
})

router.post('/', verifyToken, requireRole('admin'), (req, res) => {
  const { title, level, faculty, duration_years, description, fee_per_year, intakes } = req.body
  if (
    !title?.trim() || !VALID_LEVELS.has(level) || !faculty?.trim() ||
    !duration_years || !description?.trim() || !fee_per_year ||
    !Array.isArray(intakes) || intakes.length === 0
  ) {
    return res.status(400).json({ error: 'All course fields are required' })
  }
  const { lastInsertRowid: id } = db.prepare(`
    INSERT INTO courses (title, level, faculty, duration_years, description, fee_per_year, intakes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(title.trim(), level, faculty.trim(), duration_years, description.trim(), fee_per_year, JSON.stringify(intakes))
  logActivity(req.user.sub, req.user.name, req.user.role, 'course_created', title.trim())
  const row = db.prepare('SELECT * FROM courses WHERE id = ?').get(id)
  return res.status(201).json({ ...row, intakes: JSON.parse(row.intakes) })
})

router.patch('/:id', verifyToken, requireRole('admin'), (req, res) => {
  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id)
  if (!course) return res.status(404).json({ error: 'Course not found' })

  const fields  = ['title', 'level', 'faculty', 'duration_years', 'description', 'fee_per_year', 'is_active']
  const updates = []
  const params  = []
  for (const f of fields) {
    if (req.body[f] !== undefined) {
      updates.push(`${f} = ?`)
      params.push(f === 'is_active' ? (req.body[f] ? 1 : 0) : req.body[f])
    }
  }
  if (req.body.intakes !== undefined) {
    updates.push('intakes = ?')
    params.push(JSON.stringify(req.body.intakes))
  }
  if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' })

  params.push(course.id)
  db.prepare(`UPDATE courses SET ${updates.join(', ')} WHERE id = ?`).run(...params)
  logActivity(req.user.sub, req.user.name, req.user.role, 'course_updated', course.title)
  const row = db.prepare('SELECT * FROM courses WHERE id = ?').get(course.id)
  return res.json({ ...row, intakes: JSON.parse(row.intakes) })
})

module.exports = router
