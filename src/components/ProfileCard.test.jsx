import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as AuthModule from '../context/AuthContext'
import ProfileCard from './ProfileCard'

const updateUser = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(AuthModule, 'useAuth').mockReturnValue({
    user: { id: 1, name: 'Ann', email: 'ann@example.com', role: 'student' },
    token: 't', updateUser,
  })
})

const mockFetch = (ok, body) =>
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok, json: async () => body }))

describe('ProfileCard', () => {
  it('saves a new name and updates the stored user', async () => {
    mockFetch(true, { user: { id: 1, name: 'Anna', email: 'ann@example.com', role: 'student' } })
    render(<ProfileCard />)
    const input = screen.getByLabelText(/full name/i)
    await userEvent.clear(input)
    await userEvent.type(input, 'Anna')
    await userEvent.click(screen.getByRole('button', { name: /save name/i }))
    expect(await screen.findByText('Name updated.')).toBeInTheDocument()
    expect(updateUser).toHaveBeenCalledWith(expect.objectContaining({ name: 'Anna' }))
    expect(fetch).toHaveBeenCalledWith('/api/auth/me', expect.objectContaining({ method: 'PATCH' }))
  })

  it('shows an error when the current password is wrong', async () => {
    mockFetch(false, { error: 'Current password is incorrect' })
    render(<ProfileCard />)
    await userEvent.type(screen.getByLabelText(/current password/i), 'wrong')
    await userEvent.type(screen.getByLabelText(/new password/i), 'newpass1')
    await userEvent.click(screen.getByRole('button', { name: /change password/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Current password is incorrect')
  })

  it('confirms a successful password change', async () => {
    mockFetch(true, { ok: true })
    render(<ProfileCard />)
    await userEvent.type(screen.getByLabelText(/current password/i), 'old123')
    await userEvent.type(screen.getByLabelText(/new password/i), 'newpass1')
    await userEvent.click(screen.getByRole('button', { name: /change password/i }))
    expect(await screen.findByText('Password changed.')).toBeInTheDocument()
  })
})
