import { render, screen, fireEvent } from '@testing-library/react'
import { test, expect, afterEach, vi } from 'vitest'
import AdminAnnouncements from './Announcements'

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ token: 'test-token', user: { id: 3, name: 'Test Admin', role: 'admin' } }),
}))

const ITEMS = [
  { id: 1, title: 'Semester 2 open', body: 'Apply now', is_active: 1 },
  { id: 2, title: 'Old notice', body: 'Expired', is_active: 0 },
]

afterEach(() => vi.restoreAllMocks())

const stub = json => vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => json }))

test('renders rows with inactive tag', async () => {
  stub(ITEMS)
  render(<AdminAnnouncements />)
  expect(await screen.findByText('Semester 2 open')).toBeInTheDocument()
  expect(screen.getByText('Old notice — inactive')).toBeInTheDocument()
})

test('shows empty state', async () => {
  stub([])
  render(<AdminAnnouncements />)
  expect(await screen.findByText(/no announcements yet/i)).toBeInTheDocument()
})

test('shows error state', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }))
  render(<AdminAnnouncements />)
  expect(await screen.findByRole('alert')).toHaveTextContent(/failed to load/i)
})

test('opens create form and prefilled edit form', async () => {
  stub(ITEMS)
  render(<AdminAnnouncements />)
  await screen.findByText('Semester 2 open')

  fireEvent.click(screen.getByRole('button', { name: /add announcement/i }))
  expect(screen.getByRole('button', { name: /create announcement/i })).toBeInTheDocument()

  fireEvent.click(screen.getAllByRole('button', { name: /edit/i })[0])
  expect(screen.getByDisplayValue('Semester 2 open')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
})

test('deactivate sends PATCH is_active false', async () => {
  stub(ITEMS)
  render(<AdminAnnouncements />)
  await screen.findByText('Semester 2 open')
  fireEvent.click(screen.getByRole('button', { name: /deactivate/i }))
  await vi.waitFor(() => {
    const call = fetch.mock.calls.find(c => c[1]?.method === 'PATCH')
    expect(call[0]).toBe('/api/announcements/1')
    expect(JSON.parse(call[1].body)).toEqual({ is_active: false })
  })
})
