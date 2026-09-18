import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { formatDate } from '../../lib/enquiries'
import styles from '../student/Enquiries.module.css'

export default function AdminStaff() {
  const { token } = useAuth()
  const authHeaders = { Authorization: `Bearer ${token}` }

  const [staff,   setStaff]   = useState(null)
  const [error,   setError]   = useState('')

  const [showForm, setShowForm] = useState(false)
  const [form,     setForm]     = useState({ name: '', email: '', password: '' })
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [resetId,       setResetId]       = useState(null)
  const [resetPassword, setResetPassword] = useState('')

  const load = () => {
    fetch('/api/staff', { headers: authHeaders })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(setStaff)
      .catch(() => setError('Failed to load staff. Make sure the backend server is running.'))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, [token])

  const handleCreate = async e => {
    e.preventDefault()
    setFormError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/staff', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body:    JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create staff account')
      setForm({ name: '', email: '', password: '' })
      setShowForm(false)
      load()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const toggleActive = async (id, isActive) => {
    await fetch(`/api/staff/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body:    JSON.stringify({ is_active: !isActive }),
    })
    load()
  }

  const handleReset = async id => {
    if (resetPassword.length < 6) return
    await fetch(`/api/staff/${id}/reset-password`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body:    JSON.stringify({ password: resetPassword }),
    })
    setResetId(null)
    setResetPassword('')
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Staff Management</h1>
          <p className={styles.subtitle}>Create staff accounts, deactivate access, and reset passwords.</p>
        </div>
        <button className={styles.newBtn} onClick={() => setShowForm(s => !s)}>
          {showForm ? 'Cancel' : 'Add Staff'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className={styles.formCard} style={{ marginBottom: 24 }}>
          {formError && <div className={styles.errorBox}>{formError}</div>}
          <div className={styles.field}>
            <label htmlFor="staffName" className={styles.label}>Full name</label>
            <input
              id="staffName" className={styles.input} required
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="staffEmail" className={styles.label}>Email</label>
            <input
              id="staffEmail" type="email" className={styles.input} required
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="staffPassword" className={styles.label}>Temporary password</label>
            <input
              id="staffPassword" type="text" className={styles.input} required minLength={6}
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="At least 6 characters"
            />
          </div>
          <button type="submit" className={styles.newBtn} disabled={submitting}>
            {submitting ? 'Creating…' : 'Create Staff Account'}
          </button>
        </form>
      )}

      {error && <p className={styles.errorMsg}>{error}</p>}
      {!error && !staff && <p className={styles.loading}>Loading…</p>}
      {staff?.length === 0 && <div className={styles.empty}>No staff accounts yet.</div>}

      {staff?.length > 0 && (
        <div className={styles.list}>
          {staff.map(s => (
            <div key={s.id} className={styles.row}>
              <div>
                <p className={styles.rowSubject}>{s.name}{!s.is_active && ' — deactivated'}</p>
                <p className={styles.rowMeta}>
                  {s.email} · joined {formatDate(s.created_at)} · {s.replies_sent} repl{s.replies_sent === 1 ? 'y' : 'ies'} sent
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
