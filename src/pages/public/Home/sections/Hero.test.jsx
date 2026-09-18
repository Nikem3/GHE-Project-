import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { test, expect } from 'vitest'
import Hero from './Hero'

function renderHero() {
  return render(<MemoryRouter><Hero /></MemoryRouter>)
}

test('renders main headline', () => {
  renderHero()
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
})

test('renders Explore Courses CTA linking to /courses', () => {
  renderHero()
  const btn = screen.getByRole('link', { name: /explore courses/i })
  expect(btn).toHaveAttribute('href', '/courses')
})

test('renders Submit an Enquiry CTA linking to student login', () => {
  renderHero()
  const btn = screen.getByRole('link', { name: /submit an enquiry/i })
  expect(btn).toHaveAttribute('href', '/login?role=student')
})
