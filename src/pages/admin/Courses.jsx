import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { LEVEL_LABEL } from '../../lib/courses'
import styles from '../student/Enquiries.module.css'

const EMPTY_FORM = {
  title: '', level: 'bachelor', faculty: '', duration_years: '',
  description: '', fee_per_year: '', intakesText: '',
}

function toForm(course) {
  return {
    title: course.title, level: course.level, faculty: course.faculty,
    duration_years: course.duration_years, description: course.description,
    fee_per_year: course.fee_per_year, intakesText: course.intakes.join(', '),
  }
}

export default function AdminCourses() {
  const { token } = useAuth()
  const authHeaders = { Authorization: `Bearer ${token}` }

  const [courses, setCourses] = useState(null)
  const [error,   setError]   = useState('')

  const [editingId,  setEditingId]  = useState(null) // null = closed, 'new' = create form
  const [form,       setForm]       = useState(EMPTY_FORM)
  const [formError,  setFormError]  = useState('')
  const [submitting, setSubmitting] = useState(false)

  const load = () => {
    fetch('/api/courses/manage/all', { headers: authHeaders })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(setCourses)
      .catch(() => setError('Failed to load courses. Make sure the backend server is running.'))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, [token])

  const startCreate = () => { setEditingId('new'); setForm(EMPTY_FORM); setFormError('') }
  const startEdit    = course => { setEditingId(course.id); setForm(toForm(course)); setFormError('') }
  const cancelForm   = () => setEditingId(null)

  const handleSubmit = async e => {
    e.preventDefault()
    setFormError('')
    const intakes = form.intakesText.split(',').map(s => s.trim()).filter(Boolean)
    const body = {
      title: form.title, level: form.level, faculty: form.faculty,
      duration_years: Number(form.duration_years), description: form.description,
      fee_per_year: Number(form.fee_per_year), intakes,
    }
    setSubmitting(true)
    try {
      const isNew = editingId === 'new'
      const res = await fetch(isNew ? '/api/courses' : `/api/courses/${editingId}`, {
        method:  isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body:    JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save course')
      setEditingId(null)
      load()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const toggleActive = async course => {
    await fetch(`/api/courses/${course.id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body:    JSON.stringify({ is_active: !course.is_active }),
    })
    load()
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Course Control</h1>
          <p className={styles.subtitle}>Create, edit, and activate or deactivate GHE programs.</p>
        </div>
        <button className={styles.newBtn} onClick={editingId === 'new' ? cancelForm : startCreate}>
          {editingId === 'new' ? 'Cancel' : 'Add Course'}
        </button>
      </div>

      {editingId !== null && (
        <form onSubmit={handleSubmit} className={styles.formCard} style={{ marginBottom: 24 }}>
          {formError && <div className={styles.errorBox}>{formError}</div>}

          <div className={styles.field}>
            <label className={styles.label}>Title</label>
            <input className={styles.input} required value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Level</label>
            <select className={styles.select} value={form.level}
              onChange={e => setForm({ ...form, level: e.target.value })}>
              {Object.entries(LEVEL_LABEL).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Faculty</label>
            <input className={styles.input} required value={form.faculty}
              onChange={e => setForm({ ...form, faculty: e.target.value })} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Duration (years)</label>
            <input className={styles.input} type="number" step="0.5" min="0.5" required
              value={form.duration_years}
              onChange={e => setForm({ ...form, duration_years: e.target.value })} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Fee per year (AUD)</label>
            <input className={styles.input} type="number" min="0" required
              value={form.fee_per_year}
              onChange={e => setForm({ ...form, fee_per_year: e.target.value })} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Intakes (comma-separated, e.g. Feb, Jul)</label>
            <input className={styles.input} required value={form.intakesText}
              onChange={e => setForm({ ...form, intakesText: e.target.value })} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea className={styles.textarea} required value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>

          <button type="submit" className={styles.newBtn} disabled={submitting}>
            {submitting ? 'Saving…' : editingId === 'new' ? 'Create Course' : 'Save Changes'}
          </button>
        </form>
      )}

      {error && <p className={styles.errorMsg}>{error}</p>}
      {!error && !courses && <p className={styles.loading}>Loading…</p>}
      {courses?.length === 0 && <div className={styles.empty}>No courses yet.</div>}

      {courses?.length > 0 && (
        <div className={styles.list}>
          {courses.map(c => (
            <div key={c.id} className={styles.row}>
              <div>
                <p className={styles.rowSubject}>{c.title}{!c.is_active && ' — inactive'}</p>
                <p className={styles.rowMeta}>
                  {LEVEL_LABEL[c.level]} · {c.faculty} · {c.duration_years} yr{c.duration_years !== 1 ? 's' : ''} · A${c.fee_per_year.toLocaleString()}/yr
                </p>
              </div>
              <div className={styles.rowRight}>
                <button className={styles.pill} onClick={() => startEdit(c)}>Edit</button>
                <button className={styles.pill} onClick={() => toggleActive(c)}>
                  {c.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
