import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { test, expect, afterEach, vi } from 'vitest'
import AdminStaff from './Staff'

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ token: 'test-token', user: { id: 3, name: 'Test Admin', role: 'admin' } }),
}))

const STAFF = [
  { id: 2, name: 'Sachin Adhikari', email: 'sachin@ghe.edu.au', is_active: 1, created_at: '2026-09-01 00:00:00', replies_sent: 4 },
  { id: 5, name: 'Old Hire', email: 'old@ghe.edu.au', is_active: 0, created_at: '2026-08-01 00:00:00', replies_sent: 0 },
]

afterEach(() => vi.restoreAllMocks())

test('renders staff rows with deactivated tag', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => STAFF }))
  render(<AdminStaff />)

  expect(await screen.findByText('Sachin Adhikari')).toBeInTheDocument()
  expect(screen.getByText('Old Hire — deactivated')).toBeInTheDocument()
})

test('shows the create-staff form when Add Staff is clicked', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => STAFF }))
  render(<AdminStaff />)
  await screen.findByText('Sachin Adhikari')

  fireEvent.click(screen.getByRole('button', { name: /add staff/i }))
  expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /create staff account/i })).toBeInTheDocument()
})

test('shows empty state when there is no staff', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }))
  render(<AdminStaff />)

  expect(await screen.findByText(/no staff accounts yet/i)).toBeInTheDocument()
})

test('edits name and email inline via PATCH', async () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => STAFF })
  vi.stubGlobal('fetch', fetchMock)
  render(<AdminStaff />)
  await screen.findByText('Sachin Adhikari')

  fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0])
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Sachin A' } })
  fireEvent.click(screen.getByRole('button', { name: /save details/i }))

  await waitFor(() => {
    const call = fetchMock.mock.calls.find(([, o]) => o?.method === 'PATCH')
    expect(call[0]).toBe('/api/staff/2')
    expect(JSON.parse(call[1].body)).toEqual({ name: 'Sachin A', email: 'sachin@ghe.edu.au' })
  })
})

test('shows an error when a staff action fails', async () => {
  const fetchMock = vi.fn()
    .mockResolvedValueOnce({ ok: true, json: async () => STAFF })
    .mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'A user with this email already exists' }) })
  vi.stubGlobal('fetch', fetchMock)
  render(<AdminStaff />)
  await screen.findByText('Sachin Adhikari')

  fireEvent.click(screen.getAllByRole('button', { name: 'Deactivate' })[0])
  expect(await screen.findByRole('alert')).toHaveTextContent(/already exists/)
})
