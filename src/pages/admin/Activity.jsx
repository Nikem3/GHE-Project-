import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { formatDate } from '../../lib/enquiries'
import styles from '../student/Enquiries.module.css'

const ACTION_LABEL = {
  login:                   'Logged in',
  staff_created:           'Created staff account',
  staff_reactivated:       'Reactivated staff account',
  staff_deactivated:       'Deactivated staff account',
  staff_password_reset:    'Reset staff password',
  course_created:          'Created course',
  course_updated:          'Updated course',
  enquiry_status_changed:  'Changed enquiry status',
}

export default function AdminActivity() {
  const { token } = useAuth()
  const [entries, setEntries] = useState(null)
  const [error,   setError]   = useState('')

  useEffect(() => {
    fetch('/api/activity', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(setEntries)
      .catch(() => setError('Failed to load activity log. Make sure the backend server is running.'))
  }, [token])

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Activity Log</h1>
          <p className={styles.subtitle}>Recent logins and admin/staff actions across the system.</p>
        </div>
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}
      {!error && !entries && <p className={styles.loading}>Loading…</p>}
      {entries?.length === 0 && <div className={styles.empty}>No activity recorded yet.</div>}

      {entries?.length > 0 && (
        <div className={styles.list}>
          {entries.map(e => (
            <div key={e.id} className={styles.row}>
              <div>
                <p className={styles.rowSubject}>{ACTION_LABEL[e.action] ?? e.action}</p>
                <p className={styles.rowMeta}>
                  {e.actor_name} ({e.actor_role}){e.detail ? ` · ${e.detail}` : ''} · {formatDate(e.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
