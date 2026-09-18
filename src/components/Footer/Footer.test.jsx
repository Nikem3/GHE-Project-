import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { test, expect } from 'vitest'
import Footer from './Footer'

test('renders brand name', () => {
  render(<MemoryRouter><Footer /></MemoryRouter>)
  expect(screen.getByText('Global Higher Education')).toBeInTheDocument()
})

test('renders copyright text', () => {
  render(<MemoryRouter><Footer /></MemoryRouter>)
  expect(screen.getByText(/2026 Global Higher Education/i)).toBeInTheDocument()
})

test('renders quick links', () => {
  render(<MemoryRouter><Footer /></MemoryRouter>)
  expect(screen.getByRole('link', { name: /undergraduate/i })).toHaveAttribute('href', '/courses')
  expect(screen.getByRole('link', { name: /about ghe/i })).toHaveAttribute('href', '/about')
  expect(screen.getByRole('link', { name: /submit enquiry/i })).toHaveAttribute('href', '/contact')
})
