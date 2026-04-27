import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Footer from './Footer'

test('renders brand name', () => {
  render(<MemoryRouter><Footer /></MemoryRouter>)
  expect(screen.getByText('GHE Portal')).toBeInTheDocument()
})

test('renders copyright text', () => {
  render(<MemoryRouter><Footer /></MemoryRouter>)
  expect(screen.getByText(/2025 Global Higher Education/i)).toBeInTheDocument()
})

test('renders quick links', () => {
  render(<MemoryRouter><Footer /></MemoryRouter>)
  expect(screen.getByRole('link', { name: /courses/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
})
