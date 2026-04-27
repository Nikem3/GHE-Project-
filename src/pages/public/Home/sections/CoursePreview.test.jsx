import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CoursePreview from './CoursePreview'

test('renders section heading', () => {
  render(<MemoryRouter><CoursePreview /></MemoryRouter>)
  expect(screen.getByRole('heading', { name: /popular courses/i })).toBeInTheDocument()
})

test('renders 3 course cards', () => {
  render(<MemoryRouter><CoursePreview /></MemoryRouter>)
  expect(screen.getAllByRole('article')).toHaveLength(3)
})

test('renders View All Courses link to /courses', () => {
  render(<MemoryRouter><CoursePreview /></MemoryRouter>)
  const link = screen.getByRole('link', { name: /view all courses/i })
  expect(link).toHaveAttribute('href', '/courses')
})
