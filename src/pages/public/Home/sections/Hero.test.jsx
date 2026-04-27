import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Hero from './Hero'

function renderHero() {
  return render(<MemoryRouter><Hero /></MemoryRouter>)
}

test('renders main headline', () => {
  renderHero()
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
})

test('renders Student CTA button linking to /login with role param', () => {
  renderHero()
  const btn = screen.getByRole('link', { name: /i'm a student/i })
  expect(btn).toHaveAttribute('href', '/login?role=student')
})

test('renders Staff CTA button', () => {
  renderHero()
  expect(screen.getByRole('link', { name: /i'm staff/i })).toBeInTheDocument()
})

test('renders Admin CTA button', () => {
  renderHero()
  expect(screen.getByRole('link', { name: /admin/i })).toBeInTheDocument()
})
