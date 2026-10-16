import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import styles from '../student/Enquiries.module.css'

const EMPTY_FORM = { title: '', body: '' }

export default function AdminAnnouncements() {
  const { token } = useAuth()
  const authHeaders = { Authorization: `Bearer ${token}` }

  const [items, setItems] = useState(null)
  const [error, setError] = useState('')

  const [editingId,  setEditingId]  = useState(null) // null = closed, 'new' = create form
  const [form,       setForm]       = useState(EMPTY_FORM)
  const [formError,  setFormError]  = useState('')
  const [submitting, setSubmitting] = useState(false)

  const load = () => {
    fetch('/api/announcements/manage/all', { headers: authHeaders })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(setItems)
      .catch(() => setError('Failed to load announcements. Make sure the backend server is running.'))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, [token])

  const startCreate = () => { setEditingId('new'); setForm(EMPTY_FORM); setFormError('') }
  const startEdit   = a => { setEditingId(a.id); setForm({ title: a.title, body: a.body }); setFormError('') }
  const cancelForm  = () => setEditingId(null)

  const handleSubmit = async e => {
    e.preventDefault()
    setFormError('')
    setSubmitting(true)
    try {
      const isNew = editingId === 'new'
      const res = await fetch(isNew ? '/api/announcements' : `/api/announcements/${editingId}`, {
        method:  isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body:    JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save announcement')
      setEditingId(null)
      load()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const toggleActive = async a => {
    await fetch(`/api/announcements/${a.id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body:    JSON.stringify({ is_active: !a.is_active }),
    })
    load()
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Announcements</h1>
          <p className={styles.subtitle}>Publish news for students and visitors. The latest active one shows on the homepage.</p>
        </div>
        <button className={styles.newBtn} onClick={editingId === 'new' ? cancelForm : startCreate}>
          {editingId === 'new' ? 'Cancel' : 'Add Announcement'}
        </button>
      </div>

      {editingId !== null && (
        <form onSubmit={handleSubmit} className={styles.formCard} style={{ marginBottom: 24 }}>
          {formError && <div className={styles.errorBox} role="alert">{formError}</div>}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="ann-title">Title</label>
            <input id="ann-title" className={styles.input} required value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="ann-body">Body</label>
            <textarea id="ann-body" className={styles.textarea} required value={form.body}
              onChange={e => setForm({ ...form, body: e.target.value })} />
          </div>

          <button type="submit" className={styles.newBtn} disabled={submitting}>
            {submitting ? 'Saving…' : editingId === 'new' ? 'Create Announcement' : 'Save Changes'}
          </button>
        </form>
      )}

      {error && <p className={styles.errorMsg} role="alert">{error}</p>}
      {!error && !items && <p className={styles.loading}>Loading…</p>}
      {items?.length === 0 && <div className={styles.empty}>No announcements yet.</div>}

      {items?.length > 0 && (
        <div className={styles.list}>
          {items.map(a => (
            <div key={a.id} className={styles.row}>
              <div>
                <p className={styles.rowSubject}>{a.title}{!a.is_active && ' — inactive'}</p>
                <p className={styles.rowMeta}>{a.body.length > 100 ? `${a.body.slice(0, 100)}…` : a.body}</p>
              </div>
              <div className={styles.rowRight}>
                <button className={styles.pill} onClick={() => startEdit(a)}>Edit</button>
                <button className={styles.pill} onClick={() => toggleActive(a)}>
                  {a.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
