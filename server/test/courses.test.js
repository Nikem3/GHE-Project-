const { test, before, after } = require('node:test')
const assert = require('node:assert/strict')
const { start, login } = require('./helpers')

let srv, staff, student
const send = (method, path, token, body) => fetch(`${srv.base}/api/courses${path}`, {
  method,
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify(body),
})
const COURSE = {
  title: 'Test Course', level: 'diploma', faculty: 'Business', duration_years: 1,
  description: 'desc', fee_per_year: 1000, intakes: ['Feb'],
}

before(async () => {
  srv = await start()
  staff   = await login(srv.base, 'sachin@ghe.edu.au', 'sachin123')
  student = await login(srv.base, 'nikem@ghe.edu.au', 'nikem123')
})
after(() => srv.close())

test('staff can create and edit a course', async () => {
  const created = await send('POST', '', staff, COURSE)
  assert.equal(created.status, 201)
  const { id } = await created.json()
  const patched = await send('PATCH', `/${id}`, staff, { title: 'Renamed', level: 'master' })
  assert.equal(patched.status, 200)
  const row = await patched.json()
  assert.equal(row.title, 'Renamed')
  assert.equal(row.level, 'master')
})

test('student gets 403 on create and edit', async () => {
  assert.equal((await send('POST', '', student, COURSE)).status, 403)
  assert.equal((await send('PATCH', '/1', student, { title: 'x' })).status, 403)
})

test('invalid level returns 400 on POST and PATCH', async () => {
  const post = await send('POST', '', staff, { ...COURSE, level: 'phd' })
  assert.equal(post.status, 400)
  const patch = await send('PATCH', '/1', staff, { level: 'phd' })
  assert.equal(patch.status, 400)
  assert.ok((await patch.json()).error)
})
