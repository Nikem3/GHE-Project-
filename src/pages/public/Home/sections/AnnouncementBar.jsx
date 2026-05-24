import styles from './AnnouncementBar.module.css'

export default function AnnouncementBar() {
  return (
    <div className={styles.bar} role="banner">
      <span className={styles.badge}>NEW</span>
      2026 Semester 2 enrollments now open — applications close 31 May 2026.{' '}
      <a href="/courses" className={styles.link}>Enquire Today →</a>
    </div>
  )
}
