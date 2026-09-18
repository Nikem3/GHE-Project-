import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { LEVEL_LABEL } from '../../lib/courses'
import styles from '../student/Enquiries.module.css'

export default function StaffCourses() {
  const { token } = useAuth()
  const [courses, setCourses] = useState(null)
  const [error,   setError]   = useState('')

  useEffect(() => {
    fetch('/api/courses/manage/all', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(setCourses)
      .catch(() => setError('Failed to load courses. Make sure the backend server is running.'))
  }, [token])

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Course Catalog</h1>
          <p className={styles.subtitle}>All GHE programs, including those not currently published. Course edits are managed by admins.</p>
        </div>
      </div>

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
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
