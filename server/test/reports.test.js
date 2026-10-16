const { test, before, after } = require('node:test')
const assert = require('node:assert/strict')
const { start, login } = require('./helpers')

let srv, staff, student
const get = (qs, token) => fetch(`${srv.base}/api/reports/enquiries${qs}`, { headers: { Authorization: `Bearer ${token}` } })

before(async () => {
  srv = await start()
  staff   = await login(srv.base, 'sachin@ghe.edu.au', 'sachin123')
  student = await login(srv.base, 'nikem@ghe.edu.au', 'nikem123')
})
after(() => srv.close())

// Seed: 3 enquiries (resolved, in_progress, open); enquiry 2 assigned to Sachin; Sachin replied twice.
test('seeded totals and breakdowns match for the full range', async () => {
  const r = await (await get('', staff)).json()
  assert.equal(r.totals.total, 3)
  assert.equal(r.totals.open, 1)
  assert.equal(r.totals.in_progress, 1)
  assert.equal(r.totals.resolved, 1)
  assert.equal(r.totals.unassigned, 1)
  assert.equal(r.byCourse.reduce((n, c) => n + c.count, 0), 3)
  const sachin = r.byStaff.find(s => s.staff === 'Sachin Adhikari')
  assert.deepEqual(sachin, { staff: 'Sachin Adhikari', replies: 2, assigned: 1 })
})

test('a range with no data returns zero totals and zero staff activity', async () => {
  const r = await (await get('?from=2000-01-01&to=2000-01-02', staff)).json()
  assert.equal(r.totals.total, 0)
  assert.deepEqual(r.byDay, [])
  assert.ok(r.byStaff.every(s => s.replies === 0 && s.assigned === 0))
})

test('students cannot read reports', async () => {
  assert.equal((await get('', student)).status, 403)
})
