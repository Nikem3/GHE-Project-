import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AnnouncementBar from './AnnouncementBar'

test('renders announcement text', () => {
  render(<MemoryRouter><AnnouncementBar /></MemoryRouter>)
  expect(screen.getByText(/2025 intake/i)).toBeInTheDocument()
})

test('renders Explore courses link to /courses', () => {
  render(<MemoryRouter><AnnouncementBar /></MemoryRouter>)
  const link = screen.getByRole('link', { name: /explore courses/i })
  expect(link).toHaveAttribute('href', '/courses')
})
