import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { test, expect, afterEach, vi } from 'vitest'
import AnnouncementBar from './AnnouncementBar'

afterEach(() => vi.unstubAllGlobals())

const renderBar = () => render(<MemoryRouter><AnnouncementBar /></MemoryRouter>)

test('links the latest announcement title to /blog/:id', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [{ id: 7, title: 'Semester 2 open' }, { id: 6, title: 'Older' }],
  }))
  renderBar()
  const link = await screen.findByRole('link', { name: /semester 2 open/i })
  expect(link).toHaveAttribute('href', '/blog/7')
})

test('renders nothing when there are no announcements', async () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] })
  vi.stubGlobal('fetch', fetchMock)
  const { container } = renderBar()
  await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled())
  expect(container).toBeEmptyDOMElement()
})

test('renders nothing when the request fails', async () => {
  const fetchMock = vi.fn().mockRejectedValue(new Error('down'))
  vi.stubGlobal('fetch', fetchMock)
  const { container } = renderBar()
  await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled())
  expect(container).toBeEmptyDOMElement()
})
