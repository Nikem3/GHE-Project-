require('dotenv').config()
const express = require('express')
const cors = require('cors')
const db = require('./db/connection')

// Fresh disk (first deploy) has an empty users table — seed demo data automatically
// so the app is usable without manual shell access to the host.
if (db.prepare('SELECT COUNT(*) AS n FROM users').get().n === 0) {
  console.log('No users found — running seed script...')
  require('./db/seed')
}

const authRoutes      = require('./routes/auth')
const coursesRoutes   = require('./routes/courses')
const enquiriesRoutes = require('./routes/enquiries')
const staffRoutes     = require('./routes/staff')
const reportsRoutes   = require('./routes/reports')
const activityRoutes  = require('./routes/activity')
const contactRoutes   = require('./routes/contact')

const app  = express()
const PORT = process.env.PORT || 3001

// Comma-separated list of allowed origins, e.g. "https://ghe-portal.vercel.app,http://localhost:5173"
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map(o => o.trim())
app.use(cors({ origin: allowedOrigins }))
app.use(express.json())

app.use('/api/auth',      authRoutes)
app.use('/api/courses',   coursesRoutes)
app.use('/api/enquiries', enquiriesRoutes)
app.use('/api/staff',     staffRoutes)
app.use('/api/reports',   reportsRoutes)
app.use('/api/activity',  activityRoutes)
app.use('/api/contact',   contactRoutes)

app.listen(PORT, () => {
  console.log(`GHE API running on http://localhost:${PORT}`)
})
