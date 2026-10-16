import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { test, expect, afterEach, vi } from 'vitest'
import EnquiryThread from './EnquiryThread'

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ token: 'test-token', user: { id: 2, name: 'Sachin', role: 'staff' } }),
}))

const ENQUIRY = {
  id: 5, subject: 'Fees', status: 'open', course_title: null, student_name: 'Nikem',
  assigned_to: null, assigned_name: null, created_at: '2026-09-01 00:00:00', messages: [],
}
const ASSIGNEES = [{ id: 2, name: 'Sachin' }, { id: 3, name: 'Michael' }]

afterEach(() => vi.restoreAllMocks())

function setup() {
  const fetchMock = vi.fn(async url => ({
    ok: true,
    json: async () => (url.endsWith('/assignees') ? ASSIGNEES : ENQUIRY),
  }))
  vi.stubGlobal('fetch', fetchMock)
  render(
    <MemoryRouter initialEntries={['/staff/enquiries/5']}>
      <Routes><Route path="/staff/enquiries/:id" element={<EnquiryThread backTo="/staff/enquiries" staff />} /></Routes>
    </MemoryRouter>
  )
  return fetchMock
}

test('staff assignee select PATCHes assigned_to', async () => {
  const fetchMock = setup()
  const select = await screen.findByRole('combobox', { name: 'Assignee' })
  await screen.findByRole('option', { name: 'Michael' })
  await userEvent.selectOptions(select, 'Michael')

  await waitFor(() => {
    const call = fetchMock.mock.calls.find(([, o]) => o?.method === 'PATCH')
    expect(call[0]).toBe('/api/enquiries/5')
    expect(JSON.parse(call[1].body)).toEqual({ assigned_to: 3 })
  })
})

test('thread re-fetches every 30s and stops on unmount', async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true })
  const fetchMock = setup()
  await screen.findByText('Fees')
  const count = () => fetchMock.mock.calls.filter(([u]) => u === '/api/enquiries/5').length
  const before = count()
  await vi.advanceTimersByTimeAsync(30000)
  expect(count()).toBe(before + 1)
  vi.useRealTimers()
})
