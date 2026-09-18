const jwt = require('jsonwebtoken')
const db  = require('../db/connection')

function verifyToken(req, res, next) {
  const header = req.headers['authorization']
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorised' })
  }
  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const active  = db.prepare('SELECT is_active FROM users WHERE id = ?').get(payload.sub)?.is_active
    if (active === 0) return res.status(401).json({ error: 'Unauthorised' })
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ error: 'Unauthorised' })
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    next()
  }
}

module.exports = { verifyToken, requireRole }
