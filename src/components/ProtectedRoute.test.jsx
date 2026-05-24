import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as AuthModule from '../context/AuthContext'

let ProtectedRoute

function mockAuth(overrides = {}) {
  vi.spyOn(AuthModule, 'useAuth').mockReturnValue({
    user: null, loading: false, token: null,
    login: vi.fn(), logout: vi.fn(),
    ...overrides,
  })
}

function setup({ allowedRoles = ['student'], ...authOverrides } = {}) {
  mockAuth(authOverrides)
  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={allowedRoles} />}>
          <Route path="/protected" element={<div>Protected content</div>} />
        </Route>
        <Route path="/login"             element={<div>Login page</div>} />
        <Route path="/student/dashboard" element={<div>Student home</div>} />
        <Route path="/staff/dashboard"   element={<div>Staff home</div>} />
        <Route path="/admin/dashboard"   element={<div>Admin home</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    const mod = await import('./ProtectedRoute')
    ProtectedRoute = mod.default
  })

  it('renders nothing while auth is loading', () => {
    const { container } = setup({ loading: true })
    expect(container.firstChild).toBeNull()
  })

  it('redirects unauthenticated user to /login', () => {
    setup({ user: null })
    expect(screen.getByText('Login page')).toBeInTheDocument()
  })

  it('redirects wrong-role user to their own home', () => {
    setup({ user: { id: 2, role: 'staff' }, allowedRoles: ['student'] })
    expect(screen.getByText('Staff home')).toBeInTheDocument()
  })

  it('renders outlet when role is permitted', () => {
    setup({ user: { id: 1, role: 'student' }, allowedRoles: ['student'] })
    expect(screen.getByText('Protected content')).toBeInTheDocument()
  })
})
