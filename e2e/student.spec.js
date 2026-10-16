import { test, expect } from '@playwright/test'
import { submitEnquiry } from './helpers.js'

test('student registers, submits an enquiry and sees it listed', async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`
  const subject = `E2E student enquiry ${Date.now()}`

  await page.goto('/register')
  await page.getByLabel('Full name').fill('E2E Student')
  await page.getByLabel('Email address').fill(email)
  await page.getByLabel('Password (min 6 characters)').fill('secret123')
  await page.getByRole('button', { name: 'Create account' }).click()
  await expect(page).toHaveURL(/\/student\/dashboard/)

  await submitEnquiry(page, subject)

  await page.goto('/student/enquiries')
  await expect(page.getByText(subject)).toBeVisible()
})
