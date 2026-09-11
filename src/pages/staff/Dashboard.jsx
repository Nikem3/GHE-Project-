import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import styles from '../student/Dashboard.module.css'

export default function StaffDashboard() {
  const { user, token } = useAuth()
  const firstName = user?.name?.split(' ')[0] ?? 'there'
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetch('/api/enquiries/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => (r.ok ? r.json() : null))
      .then(setStats)
      .catch(() => {})
  }, [token])

  const metrics = [
    { label: 'Open Enquiries',     value: stats?.open ?? '—',           sub: 'Awaiting response'    },
    { label: 'Responded Today',    value: stats?.respondedToday ?? '—', sub: 'Keep it up'           },
    { label: 'Avg. Response Time', value: stats?.avgResponseHours != null ? `${stats.avgResponseHours}h` : '—', sub: 'Target: 48 hrs' },
    { label: 'Total Students',     value: stats?.totalStudents ?? '—',  sub: 'Across all enquiries' },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.welcome}>
        <div>
          <h1 className={styles.welcomeTitle}>Hello, {firstName} 👋</h1>
          <p className={styles.welcomeSub}>Your staff dashboard overview.</p>
        </div>
        <span className={styles.roleChip}>Academic Staff</span>
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
