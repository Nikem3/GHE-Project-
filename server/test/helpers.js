process.env.DB_PATH = ':memory:'
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret'

const app = require('../server')

exports.start = () => new Promise(resolve => {
  const srv = app.listen(0, () => resolve({
    base: `http://localhost:${srv.address().port}`,
    close: () => new Promise(r => srv.close(r)),
  }))
})

exports.login = async (base, email, password) => {
  const res = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error(`login failed for ${email}: ${res.status}`)
  return (await res.json()).token
}
