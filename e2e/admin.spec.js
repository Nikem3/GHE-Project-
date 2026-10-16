import { test, expect } from '@playwright/test'
import { login, ADMIN } from './helpers.js'

test.beforeEach(async ({ page }) => {
  await login(page, ...ADMIN)
  await expect(page).toHaveURL(/\/admin\/dashboard/)
})

test('admin creates a staff member', async ({ page }) => {
  const email = `staff-${Date.now()}@ghe.edu.au`
  await page.goto('/admin/staff')
  await page.getByRole('button', { name: 'Add Staff' }).click()
  await page.getByLabel('Full name').fill('E2E Staff')
  await page.getByLabel('Email', { exact: true }).fill(email)
  await page.getByLabel('Temporary password').fill('temp1234')
  await page.getByRole('button', { name: 'Create Staff Account' }).click()
  await expect(page.getByText(email)).toBeVisible()
})

test('admin creates a course', async ({ page }) => {
  const title = `E2E Course ${Date.now()}`
  await page.goto('/admin/courses')
  await page.getByRole('button', { name: 'Add Course' }).click()
  // labels in this form have no htmlFor, so locate the input by its sibling label
  const field = (name, tag = 'input') =>
    page.locator(`label:text-is("${name}") + ${tag}`)
  await field('Title').fill(title)
  await field('Faculty').fill('Faculty of Testing')
  await field('Duration (years)').fill('2')
  await field('Fee per year (AUD)').fill('20000')
  await field('Intakes (comma-separated, e.g. Feb, Jul)').fill('Feb, Jul')
  await field('Description', 'textarea').fill('A course created by the e2e suite.')
  await page.locator('form').getByRole('button').click()
  await expect(page.getByText(title)).toBeVisible()
})

test('admin posts an announcement shown on the homepage', async ({ page }) => {
  const title = `E2E announcement ${Date.now()}`
  await page.goto('/admin/announcements')
  await page.getByRole('button', { name: 'Add Announcement' }).click()
  await page.getByLabel('Title').fill(title)
  await page.getByLabel('Body').fill('Posted by the e2e suite.')
  await page.getByRole('button', { name: 'Create Announcement' }).click()
  await expect(page.getByText(title)).toBeVisible()

  await page.goto('/')
  await expect(page.getByRole('banner').getByText(title)).toBeVisible()
})

test('admin downloads the CSV report and sees activity', async ({ page }) => {
  await page.goto('/admin/reports')
  const button = page.getByRole('button', { name: 'Download CSV' })
  await expect(button).toBeEnabled()
  const [download] = await Promise.all([page.waitForEvent('download'), button.click()])
  expect(download.suggestedFilename()).toMatch(/\.csv$/)

  await page.goto('/admin/activity')
  await expect(page.getByText('No activity matches these filters.')).toHaveCount(0)
  await expect(page.getByText(/\((admin|staff|student)\)/).first()).toBeVisible()
})
