import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import * as AuthModule from '../../context/AuthContext'
import Register from './Register'

function setup(register) {
  vi.spyOn(AuthModule, 'useAuth').mockReturnValue({ register })
  render(
    <MemoryRouter initialEntries={['/register']}>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/student/dashboard" element={<div>Student home</div>} />
      </Routes>
    </MemoryRouter>
  )
}

async function fill() {
  await userEvent.type(screen.getByLabelText(/full name/i), ' Ann ')
  await userEvent.type(screen.getByLabelText(/email address/i), 'ann@example.com')
  await userEvent.type(screen.getByLabelText(/password/i), 'secret1')
  await userEvent.click(screen.getByRole('button', { name: /create account/i }))
}

describe('Register', () => {
  it('registers and navigates to the student dashboard', async () => {
    const register = vi.fn().mockResolvedValue({ role: 'student' })
    setup(register)
    await fill()
    await waitFor(() => expect(screen.getByText('Student home')).toBeInTheDocument())
    expect(register).toHaveBeenCalledWith('Ann', 'ann@example.com', 'secret1')
  })

  it('shows server errors inline', async () => {
    setup(vi.fn().mockRejectedValue(new Error('An account with that email already exists')))
    await fill()
    expect(await screen.findByRole('alert')).toHaveTextContent(/already exists/)
  })
})
