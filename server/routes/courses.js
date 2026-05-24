const express = require('express')
const router = express.Router()
router.get('/', (req, res) => res.json([]))
router.get('/:id', (req, res) => res.status(404).json({ error: 'Course not found' }))
module.exports = router
