require('dotenv').config()
const express = require('express')
const cors = require('cors')

const authRoutes    = require('./routes/auth')
const coursesRoutes = require('./routes/courses')

const app  = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/auth',    authRoutes)
app.use('/api/courses', coursesRoutes)

app.listen(PORT, () => {
  console.log(`GHE API running on http://localhost:${PORT}`)
})
