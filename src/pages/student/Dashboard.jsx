import { useAuth } from '../../context/AuthContext'
import styles from './Dashboard.module.css'

const METRICS = [
  { label: 'My Enquiries',      value: '—',     sub: 'Submit your first'  },
  { label: 'Pending Responses', value: '—',     sub: 'All caught up'      },
  { label: 'Programs Browsed',  value: '—',     sub: 'Explore courses'    },
  { label: 'Last Active',       value: 'Today', sub: 'Welcome back!'      },
]

export default function StudentDashboard() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] ?? 'there'

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
