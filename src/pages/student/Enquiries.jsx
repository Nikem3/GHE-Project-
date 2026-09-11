import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import StatusBadge from '../../components/StatusBadge'
import { formatDate } from '../../lib/enquiries'
import styles from './Enquiries.module.css'

export default function StudentEnquiries() {
  const { token } = useAuth()
  const [enquiries, setEnquiries] = useState(null)
  const [error,     setError]     = useState('')

  useEffect(() => {
    fetch('/api/enquiries', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(setEnquiries)
      .catch(() => setError('Failed to load enquiries. Make sure the backend server is running.'))
  }, [token])

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>My Enquiries</h1>
          <p className={styles.subtitle}>Track your questions and our responses.</p>
        </div>
        <Link to="/student/enquiries/new" className={styles.newBtn}>+ New Enquiry</Link>
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}
      {!error && !enquiries && <p className={styles.loading}>Loading…</p>}

      {enquiries?.length === 0 && (
        <div className={styles.empty}>
          You haven't submitted any enquiries yet. Ask us anything about our programs!
        </div>
      )}

      {enquiries?.length > 0 && (
        <div className={styles.list}>
          {enquiries.map(e => (
            <Link key={e.id} to={`/student/enquiries/${e.id}`} className={styles.row}>
              <div>
                <p className={styles.rowSubject}>{e.subject}</p>
                <p className={styles.rowMeta}>
                  {e.course_title ?? 'General enquiry'} · {e.message_count} message{e.message_count !== 1 ? 's' : ''} · updated {formatDate(e.updated_at)}
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
