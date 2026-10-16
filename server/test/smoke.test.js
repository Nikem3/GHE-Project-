const { test, before, after } = require('node:test')
const assert = require('node:assert/strict')
const { start, login } = require('./helpers')

let srv
before(async () => { srv = await start() })
after(() => srv.close())

test('seeded users can log in and courses list has 8 entries', async () => {
  for (const [email, pw] of [
    ['nikem@ghe.edu.au', 'nikem123'],
    ['sachin@ghe.edu.au', 'sachin123'],
    ['admin@ghe.edu.au', 'Password123!'],
  ]) assert.ok(await login(srv.base, email, pw))

  const courses = await (await fetch(`${srv.base}/api/courses`)).json()
  assert.equal(courses.length, 8)
})
