const { test, before, after } = require('node:test')
const assert = require('node:assert/strict')
const { start, login } = require('./helpers')

let srv
before(async () => { srv = await start() })
after(() => srv.close())

const call = (path, method, body, token) => fetch(`${srv.base}/api/auth${path}`, {
  method,
  headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
  body: JSON.stringify(body),
})
const register = (b) => call('/register', 'POST', b)

test('register creates a student whose token works; duplicate is 409', async () => {
  const res = await register({ name: 'Ann', email: ' Ann@Example.com ', password: 'secret1' })
  assert.equal(res.status, 201)
  const { token, user } = await res.json()
  assert.deepEqual(user, { id: user.id, name: 'Ann', email: 'ann@example.com', role: 'student' })
  const me = await (await fetch(`${srv.base}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })).json()
  assert.equal(me.user.email, 'ann@example.com')
  assert.equal((await register({ name: 'Ann2', email: 'ann@example.com', password: 'secret1' })).status, 409)
})

test('register rejects short password and bad email', async () => {
  assert.equal((await register({ name: 'B', email: 'b@example.com', password: '123' })).status, 400)
  assert.equal((await register({ name: 'B', email: 'nope', password: 'secret1' })).status, 400)
  assert.equal((await register({ name: '', email: 'c@example.com', password: 'secret1' })).status, 400)
})

test('register ignores a role in the body', async () => {
  const res = await register({ name: 'Eve', email: 'eve@example.com', password: 'secret1', role: 'admin' })
  assert.equal((await res.json()).user.role, 'student')
})

test('PATCH /me updates name', async () => {
  const token = await login(srv.base, 'nikem@ghe.edu.au', 'nikem123')
  const res = await call('/me', 'PATCH', { name: 'Nikem P' }, token)
  assert.equal(res.status, 200)
  assert.equal((await res.json()).user.name, 'Nikem P')
  assert.equal((await call('/me', 'PATCH', { name: ' ' }, token)).status, 400)
  assert.equal((await call('/me', 'PATCH', { name: 'x' })).status, 401)
})

test('change-password: wrong current 400, right current then login with new', async () => {
  const token = await login(srv.base, 'sachin@ghe.edu.au', 'sachin123')
  assert.equal((await call('/change-password', 'POST', { current: 'bad', password: 'newpass1' }, token)).status, 400)
  assert.equal((await call('/change-password', 'POST', { current: 'sachin123', password: 'abc' }, token)).status, 400)
  const ok = await call('/change-password', 'POST', { current: 'sachin123', password: 'newpass1' }, token)
  assert.deepEqual(await ok.json(), { ok: true })
  assert.ok(await login(srv.base, 'sachin@ghe.edu.au', 'newpass1'))
})
