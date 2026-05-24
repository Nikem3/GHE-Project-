import { useAuth } from '../../context/AuthContext'
import styles from '../student/Dashboard.module.css'

const METRICS = [
  { label: 'Total Staff',          value: '—',  sub: 'Active accounts'    },
  { label: 'Active Courses',       value: '—',  sub: 'Published programs' },
  { label: 'Enquiries This Month', value: '—',  sub: 'Across all staff'   },
  { label: 'System Status',        value: 'OK', sub: 'All services running'},
]

export default function AdminDashboard() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] ?? 'there'

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
