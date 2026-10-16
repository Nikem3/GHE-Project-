export async function login(page, email, password) {
  await page.goto('/login')
  await page.getByLabel('Email address').fill(email)
  await page.getByLabel('Password', { exact: true }).fill(password)
  await page.getByRole('button', { name: 'Sign in' }).click()
}

export const STAFF = ['sachin@ghe.edu.au', 'sachin123']
export const ADMIN = ['admin@ghe.edu.au', 'Password123!']

export async function submitEnquiry(page, subject) {
  await page.goto('/student/enquiries/new')
  await page.getByLabel('Subject').fill(subject)
  await page.getByLabel('Your question').fill('Please tell me more about entry requirements.')
  await page.getByRole('button', { name: 'Submit Enquiry' }).click()
  await page.waitForURL(/\/student\/enquiries\/\d+/)
}
