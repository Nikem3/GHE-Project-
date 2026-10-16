import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { formatDate } from '../../lib/enquiries'
import styles from '../student/Enquiries.module.css'

export default function AdminStudents() {
  const { token } = useAuth()
  const authHeaders = { Authorization: `Bearer ${token}` }

  const [students, setStudents] = useState(null)
  const [error,    setError]    = useState('')
  const [actionError, setActionError] = useState('')

  const [resetId,       setResetId]       = useState(null)
  const [resetPassword, setResetPassword] = useState('')

  const load = () => {
    fetch('/api/users?role=student', { headers: authHeaders })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(setStudents)
      .catch(() => setError('Failed to load students. Make sure the backend server is running.'))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, [token])

  const send = async (path, method, body, fallback) => {
    setActionError('')
    try {
      const res = await fetch(path, {
        method,
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body:    JSON.stringify(body),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || fallback)
      return true
    } catch (err) {
      setActionError(err.message)
      return false
    }
  }

  const toggleActive = async (id, isActive) => {
    if (await send(`/api/users/${id}`, 'PATCH', { is_active: !isActive }, 'Update failed')) load()
  }

  const handleReset = async id => {
    if (resetPassword.length < 6) return
    if (await send(`/api/users/${id}/reset-password`, 'POST', { password: resetPassword }, 'Password reset failed')) {
      setResetId(null)
      setResetPassword('')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Student Management</h1>
          <p className={styles.subtitle}>Deactivate student access and reset passwords.</p>
        </div>
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}
      {actionError && <div className={styles.errorBox} role="alert">{actionError}</div>}
      {!error && !students && <p className={styles.loading}>Loading…</p>}
      {students?.length === 0 && <div className={styles.empty}>No students yet.</div>}

      {students?.length > 0 && (
        <div className={styles.list}>
          {students.map(s => (
            <div key={s.id} className={styles.row}>
              <div>
                <p className={styles.rowSubject}>{s.name}{!s.is_active && ' — deactivated'}</p>
                <p className={styles.rowMeta}>
                  {s.email} · joined {formatDate(s.created_at)} · {s.enquiry_count} enquir{s.enquiry_count === 1 ? 'y' : 'ies'}
                </p>
                {resetId === s.id && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <input
                      className={styles.input}
                      style={{ width: 220 }}
                      type="text"
                      placeholder="New password (min 6 chars)"
                      value={resetPassword}
                      onChange={e => setResetPassword(e.target.value)}
                    />
                    <button className={styles.newBtn} onClick={() => handleReset(s.id)}>Save</button>
                  </div>
                )}
              </div>
              <div className={styles.rowRight}>
                <button
                  className={styles.pill}
                  onClick={() => { setResetId(resetId === s.id ? null : s.id); setResetPassword('') }}
                >
                  Reset password
                </button>
                <button className={styles.pill} onClick={() => toggleActive(s.id, s.is_active)}>
                  {s.is_active ? 'Deactivate' : 'Reactivate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
