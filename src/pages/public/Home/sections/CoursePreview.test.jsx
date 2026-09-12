import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { test, expect, afterEach, vi } from 'vitest'
import CoursePreview from './CoursePreview'

const COURSES = [
  { id: 2, title: 'Bachelor of Information Technology', level: 'bachelor', faculty: 'Technology',
    duration_years: 3, description: 'Develop practical skills.', fee_per_year: 19500, intakes: ['Feb', 'Jul'] },
  { id: 4, title: 'Master of Business Administration', level: 'master', faculty: 'Business',
    duration_years: 1.5, description: 'An internationally recognised MBA.', fee_per_year: 24000, intakes: ['Feb', 'Jul', 'Nov'] },
  { id: 7, title: 'Graduate Diploma of Management', level: 'diploma', faculty: 'Business',
    duration_years: 1, description: 'A focused one-year program.', fee_per_year: 16000, intakes: ['Feb', 'Jul'] },
]

afterEach(() => vi.restoreAllMocks())

test('renders one card per level from the API', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => COURSES }))
  render(<MemoryRouter><CoursePreview /></MemoryRouter>)

  expect(await screen.findAllByRole('article')).toHaveLength(3)
  expect(screen.getByText('Bachelor of Information Technology')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /view all programs/i })).toHaveAttribute('href', '/courses')
})

test('renders nothing while the API is unavailable', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('down')))
  const { container } = render(<MemoryRouter><CoursePreview /></MemoryRouter>)

  await waitFor(() => expect(container).toBeEmptyDOMElement())
})
