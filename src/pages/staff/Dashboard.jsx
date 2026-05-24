import { useAuth } from '../../context/AuthContext'
import styles from '../student/Dashboard.module.css'

const METRICS = [
  { label: 'Open Enquiries',     value: '—', sub: 'Awaiting response'   },
  { label: 'Responded Today',    value: '—', sub: 'Keep it up'          },
  { label: 'Avg. Response Time', value: '—', sub: 'Target: 48 hrs'      },
  { label: 'Total Students',     value: '—', sub: 'Across all enquiries'},
]

export default function StaffDashboard() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] ?? 'there'

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
        {METRICS.map(({ label, value, sub }) => (
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
