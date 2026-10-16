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
  password_reset_self:     'Reset own password',
  enquiry_created:         'Submitted enquiry',
  enquiry_reply:           'Replied to enquiry',
  enquiry_assigned:        'Assigned enquiry',
  staff_updated:           'Updated staff account',
  user_password_reset:     'Reset user password',
  user_deactivated:        'Deactivated user account',
  user_reactivated:        'Reactivated user account',
  student_registered:      'Registered student account',
  profile_updated:         'Updated profile',
  password_changed:        'Changed password',
  announcement_created:    'Created announcement',
  announcement_updated:    'Updated announcement',
  contact_submitted:       'Submitted contact message',
}

export default function AdminActivity() {
  const { token } = useAuth()
  const [entries, setEntries] = useState(null)
  const [error,   setError]   = useState('')

  const [role, setRole] = useState('')
  const [from, setFrom] = useState('')
  const [to,   setTo]   = useState('')

  useEffect(() => {
    const qs = new URLSearchParams(Object.entries({ role, from, to }).filter(([, v]) => v))
    fetch(`/api/activity?${qs}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(rows => { setEntries(rows); setError('') })
      .catch(() => setError('Failed to load activity log. Make sure the backend server is running.'))
  }, [token, role, from, to])

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Activity Log</h1>
          <p className={styles.subtitle}>Recent logins and admin/staff actions across the system.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <label htmlFor="actRole" className={styles.label}>Role</label>
          <select id="actRole" className={styles.input} value={role} onChange={e => setRole(e.target.value)}>
            <option value="">All roles</option>
            <option value="student">Student</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label htmlFor="actFrom" className={styles.label}>From</label>
          <input id="actFrom" type="date" className={styles.input} value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div>
          <label htmlFor="actTo" className={styles.label}>To</label>
          <input id="actTo" type="date" className={styles.input} value={to} onChange={e => setTo(e.target.value)} />
        </div>
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}
      {!error && !entries && <p className={styles.loading}>Loading…</p>}
      {entries?.length === 0 && <div className={styles.empty}>No activity matches these filters.</div>}

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
