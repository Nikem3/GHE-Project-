const db = require('../db/connection')

function logActivity(actorId, actorName, actorRole, action, detail = null) {
  db.prepare(
    'INSERT INTO activity_log (actor_id, actor_name, actor_role, action, detail) VALUES (?, ?, ?, ?, ?)'
  ).run(actorId, actorName, actorRole, action, detail)
}

module.exports = { logActivity }
