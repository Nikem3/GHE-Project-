import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { test, expect, afterEach, vi } from 'vitest'
import StudentEnquiries from './Enquiries'

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ token: 'test-token', user: { id: 1, name: 'Test Student', role: 'student' } }),
}))

const ROWS = [
  { id: 1, subject: 'Entry requirements', status: 'open', course_title: 'Master of IT',
    message_count: 1, created_at: '2026-09-01 00:00:00', updated_at: '2026-09-01 00:00:00' },
  { id: 2, subject: 'Fee payment plans', status: 'resolved', course_title: null,
    message_count: 3, created_at: '2026-09-02 00:00:00', updated_at: '2026-09-03 00:00:00' },
]

afterEach(() => vi.restoreAllMocks())

test('renders enquiry rows with status badges and course fallback', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ROWS }))
  render(<MemoryRouter><StudentEnquiries /></MemoryRouter>)

  expect(await screen.findByText('Entry requirements')).toBeInTheDocument()
  expect(screen.getByText('Open')).toBeInTheDocument()
  expect(screen.getByText('Resolved')).toBeInTheDocument()
  expect(screen.getByText(/General enquiry/)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /new enquiry/i })).toHaveAttribute('href', '/student/enquiries/new')
})

test('shows empty state when there are no enquiries', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }))
  render(<MemoryRouter><StudentEnquiries /></MemoryRouter>)

  expect(await screen.findByText(/haven't submitted any enquiries/i)).toBeInTheDocument()
})
