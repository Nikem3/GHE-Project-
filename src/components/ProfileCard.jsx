import { useAuth } from '../context/AuthContext'
import styles from '../pages/student/Dashboard.module.css'

const ROLE_LABEL = { student: 'Student', staff: 'Academic Staff', admin: 'Administrator' }

export default function ProfileCard() {
  const { user } = useAuth()
  if (!user) return null

  const roleLabel = ROLE_LABEL[user.role] ?? user.role
  const fields = [
    { label: 'Full name',     value: user.name },
    { label: 'Email address', value: user.email },
    { label: 'Role',          value: roleLabel },
    { label: 'Password',      value: '••••••••', sub: 'Contact an administrator to reset' },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.welcome}>
        <div>
          <h1 className={styles.welcomeTitle}>My Profile</h1>
          <p className={styles.welcomeSub}>Your GHE account details.</p>
        </div>
        <span className={styles.roleChip}>{roleLabel}</span>
      </div>
      <div className={styles.grid}>
        {fields.map(({ label, value, sub }) => (
          <div key={label} className={styles.card}>
            <p className={styles.cardLabel}>{label}</p>
            <p className={styles.cardText}>{value}</p>
            {sub && <p className={styles.cardSub}>{sub}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
