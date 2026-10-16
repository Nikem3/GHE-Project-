import { test, expect } from '@playwright/test'
import { login, STAFF, submitEnquiry } from './helpers.js'

test('staff assigns, replies to and resolves an enquiry', async ({ page, browser }) => {
  const subject = `E2E staff flow ${Date.now()}`

  // Seed an enquiry as the seeded student
  const ctx = await browser.newContext()
  const sp = await ctx.newPage()
  await login(sp, 'nikem@ghe.edu.au', 'nikem123')
  await expect(sp).toHaveURL(/\/student\/dashboard/)
  await submitEnquiry(sp, subject)
  await ctx.close()

  await login(page, ...STAFF)
  await expect(page).toHaveURL(/\/staff\/dashboard/)
  await page.goto('/staff/enquiries')
  await page.getByRole('link', { name: new RegExp(subject) }).click()
  await expect(page.getByRole('heading', { name: subject })).toBeVisible()

  await page.getByLabel('Assignee').selectOption({ label: 'Sachin Adhikari' })
  await expect(page.getByLabel('Assignee').locator('option:checked')).toHaveText('Sachin Adhikari')

  await page.getByLabel('Reply').fill('Thanks, here is the information you asked for.')
  await page.getByRole('button', { name: 'Send' }).click()
  await expect(page.getByText('Thanks, here is the information you asked for.')).toBeVisible()

  await page.getByLabel('Enquiry status').selectOption({ label: 'Resolved' })
  await expect(page.getByText('This enquiry has been resolved.')).toBeVisible()
})
