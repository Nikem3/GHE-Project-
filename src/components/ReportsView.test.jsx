import { render, screen } from '@testing-library/react'
import { test, expect, afterEach, vi } from 'vitest'
import ReportsView from './ReportsView'

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ token: 'test-token' }),
}))

const REPORT = {
  totals: { total: 5, open: 2, in_progress: 1, resolved: 2, avgResponseHours: 12.5 },
  byCourse: [{ course: 'Master of IT', count: 3 }, { course: 'General enquiry', count: 2 }],
  byDay: [{ day: '2026-09-01', count: 2 }, { day: '2026-09-02', count: 3 }],
}

afterEach(() => vi.restoreAllMocks())

test('renders summary cards and breakdown tables from the report', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => REPORT }))
  render(<ReportsView title="Reports" subtitle="Test subtitle" />)

  expect(await screen.findByText('5')).toBeInTheDocument()
  expect(screen.getByText('12.5h')).toBeInTheDocument()
  expect(screen.getByText('Master of IT')).toBeInTheDocument()
})

test('shows an error message when the report fails to load', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
  render(<ReportsView title="Reports" subtitle="Test subtitle" />)

  expect(await screen.findByText(/failed to load report/i)).toBeInTheDocument()
})
