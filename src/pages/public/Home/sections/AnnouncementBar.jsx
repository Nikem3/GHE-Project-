import { Link } from 'react-router-dom'
import styles from './AnnouncementBar.module.css'

export default function AnnouncementBar() {
  return (
    <div className={styles.bar}>
      🎓 Applications now open for 2025 intake &nbsp;·&nbsp;{' '}
      <Link to="/courses">Explore courses →</Link>
    </div>
  )
}
