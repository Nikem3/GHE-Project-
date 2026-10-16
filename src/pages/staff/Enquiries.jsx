import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import StatusBadge from '../../components/StatusBadge'
import { STATUS_LABELS, formatDate } from '../../lib/enquiries'
import styles from '../student/Enquiries.module.css'

const FILTERS = [
  { value: '', label: 'All' },
  ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label })),
]

const ASSIGN_FILTERS = [
  { value: 'me',         label: 'Assigned to me' },
  { value: 'unassigned', label: 'Unassigned' },
]

export default function StaffEnquiries() {
  const { token } = useAuth()
  const [enquiries, setEnquiries] = useState(null)
  const [error,     setError]     = useState('')
  const [status,    setStatus]    = useState('')
  const [assigned,  setAssigned]  = useState('')
  const [courseId,  setCourseId]  = useState('')
  const [courses,   setCourses]   = useState([])

  useEffect(() => {
    fetch('/api/courses')
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(setCourses)
      .catch(() => {})
  }, [])

  useEffect(() => {
    const qs = new URLSearchParams()
    if (status)   qs.set('status', status)
    if (assigned) qs.set('assigned', assigned)
    if (courseId) qs.set('course_id', courseId)
    const load = () =>
      fetch(`/api/enquiries?${qs}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => (r.ok ? r.json() : Promise.reject()))
        .then(setEnquiries)
        .catch(() => setError('Failed to load enquiries. Make sure the backend server is running.'))
    load()
  }, [token, status, assigned, courseId])

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Enquiry Management</h1>
          <p className={styles.subtitle}>Respond to student enquiries and track their status.</p>
        </div>
      </div>

      <div className={styles.filters}>
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setStatus(value)}
            className={`${styles.pill}${status === value ? ` ${styles.pillActive}` : ''}`}
          >
            {label}
          </button>
        ))}
        {ASSIGN_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setAssigned(assigned === value ? '' : value)}
            className={`${styles.pill}${assigned === value ? ` ${styles.pillActive}` : ''}`}
          >
            {label}
          </button>
        ))}
        <select
          value={courseId}
          onChange={e => setCourseId(e.target.value)}
          className={styles.select}
          aria-label="Filter by course"
        >
          <option value="">All courses</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}
      {!error && !enquiries && <p className={styles.loading}>Loading…</p>}

      {enquiries?.length === 0 && (
        <div className={styles.empty}>No enquiries{status ? ` with status "${STATUS_LABELS[status]}"` : ''}.</div>
      )}

      {enquiries?.length > 0 && (
        <div className={styles.list}>
          {enquiries.map(e => (
            <Link key={e.id} to={`/staff/enquiries/${e.id}`} className={styles.row}>
              <div>
                <p className={styles.rowSubject}>{e.subject}</p>
                <p className={styles.rowMeta}>
                  {e.student_name} · {e.course_title ?? 'General enquiry'} · {e.assigned_name ? `assigned to ${e.assigned_name}` : 'unassigned'} · {e.message_count} message{e.message_count !== 1 ? 's' : ''} · updated {formatDate(e.updated_at)}
                </p>
              </div>
              <div className={styles.rowRight}>
                <StatusBadge status={e.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
