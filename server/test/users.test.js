const { test, before, after } = require('node:test')
const assert = require('node:assert/strict')
const { start, login } = require('./helpers')

let srv, admin
before(async () => {
  srv = await start()
  admin = await login(srv.base, 'admin@ghe.edu.au', 'Password123!')
})
after(() => srv.close())

const call = (token, method, path, body) => fetch(`${srv.base}${path}`, {
  method,
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: body && JSON.stringify(body),
})

test('lists students with enquiry counts', async () => {
  const res = await call(admin, 'GET', '/api/users?role=student')
  assert.equal(res.status, 200)
  const rows = await res.json()
  assert.deepEqual(rows.map(r => r.email).sort(), ['nikem@ghe.edu.au', 'priya@ghe.edu.au'])
  assert.ok(rows.every(r => typeof r.enquiry_count === 'number'))
  assert.ok(rows.some(r => r.enquiry_count > 0))
})

test('non-admin gets 403', async () => {
  const student = await login(srv.base, 'nikem@ghe.edu.au', 'nikem123')
  assert.equal((await call(student, 'GET', '/api/users?role=student')).status, 403)
})

test('deactivate blocks access, reactivate restores; admin target is 404', async () => {
  const students = await (await call(admin, 'GET', '/api/users?role=student')).json()
  const priya = students.find(s => s.email === 'priya@ghe.edu.au')
  const token = await login(srv.base, 'priya@ghe.edu.au', 'priya123')

  assert.equal((await call(admin, 'PATCH', `/api/users/${priya.id}`, { is_active: false })).status, 200)
  assert.equal((await call(token, 'GET', '/api/enquiries')).status, 401)
  await assert.rejects(login(srv.base, 'priya@ghe.edu.au', 'priya123'))

  assert.equal((await call(admin, 'PATCH', `/api/users/${priya.id}`, { is_active: true })).status, 200)
  assert.ok(await login(srv.base, 'priya@ghe.edu.au', 'priya123'))

  const adminId = JSON.parse(Buffer.from(admin.split('.')[1], 'base64url')).sub
  assert.equal((await call(admin, 'PATCH', `/api/users/${adminId}`, { is_active: false })).status, 404)
})

test('reset password then login with new one', async () => {
  const students = await (await call(admin, 'GET', '/api/users?role=student')).json()
  const nikem = students.find(s => s.email === 'nikem@ghe.edu.au')
  assert.equal((await call(admin, 'POST', `/api/users/${nikem.id}/reset-password`, { password: 'abc' })).status, 400)
  assert.equal((await call(admin, 'POST', `/api/users/${nikem.id}/reset-password`, { password: 'newpass1' })).status, 200)
  assert.ok(await login(srv.base, 'nikem@ghe.edu.au', 'newpass1'))
})

test('staff name/email edit and duplicate email 409', async () => {
  const staff = await (await call(admin, 'GET', '/api/staff')).json()
  const s = staff[0]
  const ok = await call(admin, 'PATCH', `/api/staff/${s.id}`, { name: 'Renamed Staff', email: 'Renamed@ghe.edu.au' })
  assert.equal(ok.status, 200)
  const after = (await (await call(admin, 'GET', '/api/staff')).json()).find(x => x.id === s.id)
  assert.equal(after.name, 'Renamed Staff')
  assert.equal(after.email, 'renamed@ghe.edu.au')

  const dup = await call(admin, 'PATCH', `/api/staff/${s.id}`, { email: 'admin@ghe.edu.au' })
  assert.equal(dup.status, 409)
})
