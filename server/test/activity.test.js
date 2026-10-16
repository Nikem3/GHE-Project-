const { test, before, after } = require('node:test')
const assert = require('node:assert/strict')
const { start, login } = require('./helpers')

let srv, admin, staff
const get = (qs, token) => fetch(`${srv.base}/api/activity${qs}`, { headers: { Authorization: `Bearer ${token}` } })

before(async () => {
  srv = await start()
  admin = await login(srv.base, 'admin@ghe.edu.au', 'Password123!')   // logs 'login' as admin
  staff = await login(srv.base, 'sachin@ghe.edu.au', 'sachin123')     // logs 'login' as staff
})
after(() => srv.close())

test('non-admin gets 403', async () => {
  assert.equal((await get('', staff)).status, 403)
})

test('role and action filters narrow results', async () => {
  const all = await (await get('', admin)).json()
  assert.ok(all.length >= 2)
  const onlyStaff = await (await get('?role=staff', admin)).json()
  assert.ok(onlyStaff.length >= 1 && onlyStaff.every(e => e.actor_role === 'staff'))
  const none = await (await get('?action=nonexistent', admin)).json()
  assert.deepEqual(none, [])
})

test('date range filters and limit apply', async () => {
  const today = new Date().toISOString().slice(0, 10)
  assert.ok((await (await get(`?from=${today}&to=${today}`, admin)).json()).length >= 2)
  assert.deepEqual(await (await get('?to=2000-01-01', admin)).json(), [])
  assert.equal((await (await get('?limit=1', admin)).json()).length, 1)
})

test('SQL metacharacters in filters are treated as data', async () => {
  const res = await get(`?role=${encodeURIComponent("x' OR '1'='1")}`, admin)
  assert.deepEqual(await res.json(), [])
})
