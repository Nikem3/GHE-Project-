const { test, before, after } = require('node:test')
const assert = require('node:assert/strict')
const { start, login } = require('./helpers')
const db = require('../db/connection')

let srv, student, other, staff
const call = (token, method, path, body) => fetch(`${srv.base}/api/${path}`, {
  method,
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: body && JSON.stringify(body),
})
const acts = action => db.prepare('SELECT * FROM activity_log WHERE action = ?').all(action)

before(async () => {
  srv = await start()
  student = await login(srv.base, 'nikem@ghe.edu.au', 'nikem123')
  other   = await login(srv.base, 'priya@ghe.edu.au', 'priya123')
  staff   = await login(srv.base, 'sachin@ghe.edu.au', 'sachin123')
})
after(() => srv.close())

test('assign, unassign, activity rows, and invalid assignee', async () => {
  const created = await (await call(student, 'POST', 'enquiries', { subject: 'Hi', message: 'Hello', course_id: 1 })).json()
  assert.equal(created.assigned_to, null)
  assert.equal(acts('enquiry_created').length, 1)

  let res = await call(staff, 'PATCH', `enquiries/${created.id}`, { assigned_to: 2 })
  assert.equal(res.status, 200)
  const row = await res.json()
  assert.equal(row.assigned_to, 2)
  assert.equal(row.assigned_name, 'Sachin Adhikari')
  assert.equal(acts('enquiry_assigned').length, 1)

  await call(staff, 'POST', `enquiries/${created.id}/messages`, { body: 'Reply' })
  assert.equal(acts('enquiry_reply').length, 1)

  for (const bad of [1, 999, 'x']) {
    assert.equal((await call(staff, 'PATCH', `enquiries/${created.id}`, { assigned_to: bad })).status, 400)
  }
  res = await call(staff, 'PATCH', `enquiries/${created.id}`, { assigned_to: null })
  assert.equal((await res.json()).assigned_to, null)
})

test('filters and assignees list', async () => {
  const get = async q => (await (await call(staff, 'GET', `enquiries${q}`)).json())
  const mine = await get('?assigned=me')
  assert.deepEqual(mine.map(e => e.id), [2])
  assert.equal(mine[0].assigned_name, 'Sachin Adhikari')
  assert.ok((await get('?assigned=unassigned')).every(e => e.assigned_to === null))
  assert.ok((await get('?course_id=1')).every(e => e.course_title === 'Bachelor of Business Administration'))

  const assignees = await (await call(staff, 'GET', 'enquiries/assignees')).json()
  assert.deepEqual(assignees.map(a => a.name).sort(), ['Michael Chen', 'Sachin Adhikari'])
  assert.equal((await call(student, 'GET', 'enquiries/assignees')).status, 403)
})

test('student gets 403 on PATCH and 404 on another student\'s enquiry', async () => {
  assert.equal((await call(student, 'PATCH', 'enquiries/2', { assigned_to: 2 })).status, 403)
  assert.equal((await call(other, 'GET', 'enquiries/2')).status, 404)
  assert.equal((await call(other, 'POST', 'enquiries/2/messages', { body: 'x' })).status, 404)
})

test('contact submission is logged', async () => {
  const res = await fetch(`${srv.base}/api/contact`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Zed', email: 'z@x.com', type: 'General Enquiry', message: 'hi' }),
  })
  assert.equal(res.status, 201)
  const [a] = acts('contact_submitted')
  assert.equal(a.actor_name, 'Zed')
  assert.equal(a.actor_id, null)
})
