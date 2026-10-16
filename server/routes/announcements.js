const express = require('express')
const db      = require('../db/connection')
const { verifyToken, requireRole } = require('../middleware/auth')
const { logActivity } = require('../lib/activity')

const router   = express.Router()
const nonEmpty = v => typeof v === 'string' && v.trim() !== ''

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM announcements WHERE is_active = 1 ORDER BY id DESC').all())
})

// Admin management view — includes inactive. Declared before /:id.
router.get('/manage/all', verifyToken, requireRole('admin'), (req, res) => {
  res.json(db.prepare('SELECT * FROM announcements ORDER BY id DESC').all())
})

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM announcements WHERE id = ? AND is_active = 1').get(req.params.id)
  if (!row) return res.status(404).json({ error: 'Announcement not found' })
  return res.json(row)
})

router.post('/', verifyToken, requireRole('admin'), (req, res) => {
  const { title, body } = req.body
  if (!nonEmpty(title) || !nonEmpty(body)) {
    return res.status(400).json({ error: 'Title and body are required' })
  }
  const { lastInsertRowid: id } = db
    .prepare('INSERT INTO announcements (title, body, created_by) VALUES (?, ?, ?)')
    .run(title.trim(), body.trim(), req.user.sub)
  logActivity(req.user.sub, req.user.name, req.user.role, 'announcement_created', title.trim())
  return res.status(201).json(db.prepare('SELECT * FROM announcements WHERE id = ?').get(id))
})

router.patch('/:id', verifyToken, requireRole('admin'), (req, res) => {
  const row = db.prepare('SELECT * FROM announcements WHERE id = ?').get(req.params.id)
  if (!row) return res.status(404).json({ error: 'Announcement not found' })

  const { title, body, is_active } = req.body
  if ((title !== undefined && !nonEmpty(title)) || (body !== undefined && !nonEmpty(body))) {
    return res.status(400).json({ error: 'Title and body must be non-empty' })
  }
  if (title === undefined && body === undefined && is_active === undefined) {
    return res.status(400).json({ error: 'No fields to update' })
  }
  db.prepare('UPDATE announcements SET title = ?, body = ?, is_active = ? WHERE id = ?').run(
    title === undefined ? row.title : title.trim(),
    body  === undefined ? row.body  : body.trim(),
    is_active === undefined ? row.is_active : (is_active ? 1 : 0),
    row.id,
  )
  logActivity(req.user.sub, req.user.name, req.user.role, 'announcement_updated', title?.trim() ?? row.title)
  return res.json(db.prepare('SELECT * FROM announcements WHERE id = ?').get(row.id))
})

module.exports = router
