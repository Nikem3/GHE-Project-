import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './AnnouncementBar.module.css'

export default function AnnouncementBar() {
  const [latest, setLatest] = useState(null)

  useEffect(() => {
    fetch('/api/announcements')
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(list => setLatest(list[0] ?? null))
      .catch(() => setLatest(null))
  }, [])

  if (!latest) return null

  return (
    <div className={styles.bar} role="banner">
      <span className={styles.badge}>NEW</span>
      <Link to={`/blog/${latest.id}`} className={styles.link}>{latest.title} →</Link>
    </div>
  )
}
