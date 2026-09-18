import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { test, expect } from 'vitest'
import Navbar from './Navbar'

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  )
}

test('renders brand logo linking home', () => {
  renderNavbar()
  const logo = screen.getByRole('link', { name: /global higher education/i })
  expect(logo).toHaveAttribute('href', '/')
})

test('renders nav links', () => {
  renderNavbar()
  expect(screen.getByRole('link', { name: /courses/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
})

test('renders Staff Login and Student Portal CTAs', () => {
  renderNavbar()
  expect(screen.getByRole('link', { name: /staff login/i })).toHaveAttribute('href', '/login?role=staff')
  expect(screen.getByRole('link', { name: /student portal/i })).toHaveAttribute('href', '/login?role=student')
})
