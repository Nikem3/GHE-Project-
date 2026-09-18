import { render, screen, fireEvent } from '@testing-library/react'
import { test, expect, afterEach, vi } from 'vitest'
import AdminCourses from './Courses'

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ token: 'test-token', user: { id: 3, name: 'Test Admin', role: 'admin' } }),
}))

const COURSES = [
  { id: 1, title: 'Bachelor of IT', level: 'bachelor', faculty: 'Technology', duration_years: 3,
    fee_per_year: 19500, description: 'desc', intakes: ['Feb', 'Jul'], is_active: 1 },
  { id: 2, title: 'Old Diploma', level: 'diploma', faculty: 'Business', duration_years: 1,
    fee_per_year: 16000, description: 'desc', intakes: ['Feb'], is_active: 0 },
]

afterEach(() => vi.restoreAllMocks())

test('renders course rows with inactive tag', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => COURSES }))
  render(<AdminCourses />)

  expect(await screen.findByText('Bachelor of IT')).toBeInTheDocument()
  expect(screen.getByText('Old Diploma — inactive')).toBeInTheDocument()
})

test('opens the create-course form prefilled empty when Add Course is clicked', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => COURSES }))
  render(<AdminCourses />)
  await screen.findByText('Bachelor of IT')

  fireEvent.click(screen.getByRole('button', { name: /add course/i }))
  expect(screen.getByRole('button', { name: /create course/i })).toBeInTheDocument()
})

test('opens the edit form prefilled with the selected course', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => COURSES }))
  render(<AdminCourses />)
  await screen.findByText('Bachelor of IT')

  fireEvent.click(screen.getAllByRole('button', { name: /edit/i })[0])
  expect(screen.getByDisplayValue('Bachelor of IT')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
})
