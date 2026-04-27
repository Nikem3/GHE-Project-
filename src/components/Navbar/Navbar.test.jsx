import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  )
}

test('renders GHE Portal brand name', () => {
  renderNavbar()
  expect(screen.getByText('GHE Portal')).toBeInTheDocument()
})

test('renders nav links', () => {
  renderNavbar()
  expect(screen.getByRole('link', { name: /courses/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /blog/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
})

test('renders login button', () => {
  renderNavbar()
  expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
})

test('renders theme toggle button', () => {
  renderNavbar()
  expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
})

test('theme toggle switches dark to light then back to dark', () => {
  renderNavbar()
  document.documentElement.removeAttribute('data-theme')
  const btn = screen.getByRole('button', { name: /toggle theme/i })
  fireEvent.click(btn)
  expect(document.documentElement).toHaveAttribute('data-theme', 'light')
  fireEvent.click(btn)
  expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
})
