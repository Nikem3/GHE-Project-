import { render, screen, fireEvent } from '@testing-library/react'
import { test, expect, afterEach, vi } from 'vitest'
import ReportsView from './ReportsView'
import { buildReportCsv } from '../lib/reportCsv'

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ token: 'test-token' }),
}))

const REPORT = {
  totals: { total: 5, open: 2, in_progress: 1, resolved: 2, avgResponseHours: 12.5 },
  byCourse: [{ course: 'Master of IT', count: 3 }, { course: 'General enquiry', count: 2 }],
  byDay: [{ day: '2026-09-01', count: 2 }, { day: '2026-09-02', count: 3 }],
  byStaff: [{ staff: 'Sachin Adhikari', replies: 4, assigned: 1 }],
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

test('renders the staff activity section', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => REPORT }))
  render(<ReportsView title="Reports" subtitle="Test subtitle" />)

  expect(await screen.findByText('Sachin Adhikari')).toBeInTheDocument()
  expect(screen.getByText('4 replies · 1 assigned')).toBeInTheDocument()
})

test('blocks a from date after the to date with a message and no fetch', async () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => REPORT })
  vi.stubGlobal('fetch', fetchMock)
  render(<ReportsView title="Reports" subtitle="Test subtitle" />)
  await screen.findByText('5')
  fetchMock.mockClear()

  fireEvent.change(screen.getByLabelText('From'), { target: { value: '2999-01-01' } })
  expect(screen.getByText(/must be on or before/i)).toBeInTheDocument()
  expect(fetchMock).not.toHaveBeenCalled()
})

test('clears the error after a later successful fetch', async () => {
  const fetchMock = vi.fn().mockResolvedValueOnce({ ok: false })
    .mockResolvedValue({ ok: true, json: async () => REPORT })
  vi.stubGlobal('fetch', fetchMock)
  render(<ReportsView title="Reports" subtitle="Test subtitle" />)
  await screen.findByText(/failed to load report/i)

  fireEvent.click(screen.getByText('This Week'))
  expect(await screen.findByText('12.5h')).toBeInTheDocument()
  expect(screen.queryByText(/failed to load report/i)).not.toBeInTheDocument()
})

test('Print calls window.print', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => REPORT }))
  const print = vi.spyOn(window, 'print').mockImplementation(() => {})
  render(<ReportsView title="Reports" subtitle="Test subtitle" />)
  fireEvent.click(screen.getByText('Print'))
  expect(print).toHaveBeenCalled()
})

test('buildReportCsv emits totals, course, day and staff sections with quoting', () => {
  const csv = buildReportCsv(
    { ...REPORT, byCourse: [{ course: 'Say "hi", IT', count: 1 }] }, '2026-09-01', '2026-09-30')
  expect(csv).toContain('"Totals"')
  expect(csv).toContain('"5","2","1","2","","12.5"')
  expect(csv).toContain('"By course"')
  expect(csv).toContain('"Say ""hi"", IT","1"')
  expect(csv).toContain('"By day"\n"Day","Count"\n"2026-09-01","2"')
  expect(csv).toContain('"By staff"\n"Staff","Replies","Assigned"\n"Sachin Adhikari","4","1"')
})
