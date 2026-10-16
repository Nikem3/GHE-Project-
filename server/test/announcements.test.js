const { test, before, after } = require('node:test')
const assert = require('node:assert/strict')
const { start, login } = require('./helpers')
const db = require('../db/connection')

let srv, admin, staff, student
before(async () => {
  srv = await start()
  admin   = await login(srv.base, 'admin@ghe.edu.au', 'Password123!')
  staff   = await login(srv.base, 'sachin@ghe.edu.au', 'sachin123')
  student = await login(srv.base, 'nikem@ghe.edu.au', 'nikem123')
})
after(() => srv.close())

const call = (path, { token, method = 'GET', body } = {}) => fetch(`${srv.base}/api/announcements${path}`, {
  method,
  headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
  body: body && JSON.stringify(body),
})

test('writes are admin-only', async () => {
  for (const [token, status] of [[undefined, 401], [student, 403], [staff, 403]]) {
    assert.equal((await call('', { token, method: 'POST', body: { title: 't', body: 'b' } })).status, status)
    assert.equal((await call('/1', { token, method: 'PATCH', body: { title: 't' } })).status, status)
  }
  assert.equal((await call('/manage/all', { token: staff })).status, 403)
})

test('create validates, logs, and appears newest first', async () => {
  assert.equal((await call('', { token: admin, method: 'POST', body: { title: ' ', body: 'b' } })).status, 400)
  const res = await call('', { token: admin, method: 'POST', body: { title: ' Hello ', body: 'World' } })
  assert.equal(res.status, 201)
  const row = await res.json()
  assert.equal(row.title, 'Hello')
  const list = await (await call('')).json()
  assert.equal(list[0].id, row.id)
  assert.ok(db.prepare("SELECT 1 FROM activity_log WHERE action = 'announcement_created' AND detail = 'Hello'").get())
})

test('deactivated announcement is hidden publicly but visible to admin; update logs', async () => {
  const { id } = await (await call('', { token: admin, method: 'POST', body: { title: 'Temp', body: 'x' } })).json()
  assert.equal((await call(`/${id}`)).status, 200)

  assert.equal((await call(`/${id}`, { token: admin, method: 'PATCH', body: { body: '' } })).status, 400)
  const res = await call(`/${id}`, { token: admin, method: 'PATCH', body: { is_active: false } })
  assert.equal(res.status, 200)
  assert.equal((await res.json()).is_active, 0)

  assert.equal((await call(`/${id}`)).status, 404)
  assert.ok(!(await (await call('')).json()).some(a => a.id === id))
  assert.ok((await (await call('/manage/all', { token: admin })).json()).some(a => a.id === id))
  assert.ok(db.prepare("SELECT 1 FROM activity_log WHERE action = 'announcement_updated' AND detail = 'Temp'").get())
  assert.equal((await call('/9999', { token: admin, method: 'PATCH', body: { title: 'x' } })).status, 404)
})
