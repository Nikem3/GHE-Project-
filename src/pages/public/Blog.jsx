import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './Blog.module.css'

export default function Blog() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/announcements')
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(setItems)
      .catch(() => setError('Failed to load news. Please try again later.'))
  }, [])

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>News &amp; Updates</h1>
      {error && <p className={styles.status} role="alert">{error}</p>}
      {!error && !items && <p className={styles.status}>Loading…</p>}
      {items?.length === 0 && <p className={styles.status}>No announcements yet.</p>}
      {items?.length > 0 && (
        <ul className={styles.list}>
          {items.map(a => (
            <li key={a.id} className={styles.item}>
              <h2><Link to={`/blog/${a.id}`}>{a.title}</Link></h2>
              <p className={styles.date}>{new Date(a.created_at.replace(' ', 'T') + 'Z').toLocaleDateString()}</p>
              <p className={styles.excerpt}>{a.body.length > 140 ? `${a.body.slice(0, 140)}…` : a.body}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
