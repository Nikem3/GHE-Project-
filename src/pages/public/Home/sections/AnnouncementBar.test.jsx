import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { test, expect } from 'vitest'
import AnnouncementBar from './AnnouncementBar'

test('renders announcement text', () => {
  render(<MemoryRouter><AnnouncementBar /></MemoryRouter>)
  expect(screen.getByText(/2026 semester 2 enrollments/i)).toBeInTheDocument()
})

test('renders Enquire Today link to /courses', () => {
  render(<MemoryRouter><AnnouncementBar /></MemoryRouter>)
  const link = screen.getByRole('link', { name: /enquire today/i })
  expect(link).toHaveAttribute('href', '/courses')
})
