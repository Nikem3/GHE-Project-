import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import styles from '../student/Dashboard.module.css'

export default function AdminDashboard() {
  const { user, token } = useAuth()
  const firstName = user?.name?.split(' ')[0] ?? 'there'
  const [data, setData] = useState(null)

  useEffect(() => {
    const headers   = { Authorization: `Bearer ${token}` }
    const firstOfMonth = new Date()
    firstOfMonth.setDate(1)
    const from = firstOfMonth.toISOString().slice(0, 10)

    Promise.all([
      fetch('/api/staff', { headers }).then(r => (r.ok ? r.json() : [])),
      fetch('/api/courses').then(r => (r.ok ? r.json() : [])),
      fetch(`/api/reports/enquiries?from=${from}`, { headers }).then(r => (r.ok ? r.json() : null)),
    ])
      .then(([staff, courses, report]) => setData({ staff, courses, report }))
      .catch(() => {})
  }, [token])

  const metrics = [
    { label: 'Total Staff',          value: data ? data.staff.filter(s => s.is_active).length : '—', sub: 'Active accounts'      },
    { label: 'Active Courses',       value: data ? data.courses.length : '—',                         sub: 'Published programs'   },
    { label: 'Enquiries This Month', value: data?.report?.totals?.total ?? '—',                        sub: 'Across all staff'     },
    { label: 'System Status',        value: 'OK',                                                      sub: 'All services running' },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.welcome}>
        <div>
          <h1 className={styles.welcomeTitle}>Hello, {firstName} 👋</h1>
          <p className={styles.welcomeSub}>GHE system administration overview.</p>
        </div>
        <span className={styles.roleChip}>Administrator</span>
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
