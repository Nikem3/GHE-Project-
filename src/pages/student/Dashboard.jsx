import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import styles from './Dashboard.module.css'

export default function StudentDashboard() {
  const { user, token } = useAuth()
  const firstName = user?.name?.split(' ')[0] ?? 'there'
  const [enquiries, setEnquiries] = useState(null)

  useEffect(() => {
    fetch('/api/enquiries', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => (r.ok ? r.json() : null))
      .then(setEnquiries)
      .catch(() => {})
  }, [token])

  const count = status => enquiries?.filter(e => e.status === status).length

  const metrics = [
    { label: 'My Enquiries',   value: enquiries?.length ?? '—',    sub: 'Total submitted'      },
    { label: 'Awaiting Reply', value: count('open') ?? '—',        sub: 'We respond in 48 hrs' },
    { label: 'In Progress',    value: count('in_progress') ?? '—', sub: 'Being worked on'      },
    { label: 'Resolved',       value: count('resolved') ?? '—',    sub: 'All sorted'           },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.welcome}>
        <div>
          <h1 className={styles.welcomeTitle}>Hello, {firstName} 👋</h1>
          <p className={styles.welcomeSub}>Here's an overview of your student portal.</p>
        </div>
        <span className={styles.roleChip}>Student</span>
      </div>
      <div className={styles.grid}>
        {metrics.map(({ label, value, sub }) => (
          <div key={label} className={styles.card}>
            <p className={styles.cardLabel}>{label}</p>
            <p className={styles.cardValue}>{value}</p>
            <p className={styles.cardSub}>{sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
