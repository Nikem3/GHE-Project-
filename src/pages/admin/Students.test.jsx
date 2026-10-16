import { render, screen, fireEvent } from '@testing-library/react'
import { test, expect, afterEach, vi } from 'vitest'
import AdminStudents from './Students'

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ token: 'test-token', user: { id: 3, name: 'Test Admin', role: 'admin' } }),
}))

const STUDENTS = [
  { id: 1, name: 'Nikem Parajuli', email: 'nikem@ghe.edu.au', is_active: 1, created_at: '2026-09-01 00:00:00', enquiry_count: 2 },
  { id: 4, name: 'Priya Sharma', email: 'priya@ghe.edu.au', is_active: 0, created_at: '2026-08-01 00:00:00', enquiry_count: 1 },
]

afterEach(() => vi.restoreAllMocks())

test('renders students with counts and deactivated tag', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => STUDENTS }))
  render(<AdminStudents />)

  expect(await screen.findByText('Nikem Parajuli')).toBeInTheDocument()
  expect(screen.getByText(/2 enquiries/)).toBeInTheDocument()
  expect(screen.getByText('Priya Sharma — deactivated')).toBeInTheDocument()
})

test('shows an error when deactivate fails', async () => {
  const fetchMock = vi.fn()
    .mockResolvedValueOnce({ ok: true, json: async () => STUDENTS })
    .mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Nope' }) })
  vi.stubGlobal('fetch', fetchMock)
  render(<AdminStudents />)
  await screen.findByText('Nikem Parajuli')

  fireEvent.click(screen.getByRole('button', { name: 'Deactivate' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('Nope')
})

test('shows empty state', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }))
  render(<AdminStudents />)
  expect(await screen.findByText(/no students yet/i)).toBeInTheDocument()
})
