import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import styles from './Blog.module.css'

export default function BlogPost() {
  const { id } = useParams()
  const [post,   setPost]   = useState(null)
  const [status, setStatus] = useState('loading') // loading | ok | notfound | error

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset on id change
    setStatus('loading')
    fetch(`/api/announcements/${id}`)
      .then(r => {
        if (r.status === 404) { setStatus('notfound'); return null }
        return r.ok ? r.json() : Promise.reject()
      })
      .then(data => { if (data) { setPost(data); setStatus('ok') } })
      .catch(() => setStatus('error'))
  }, [id])

  return (
    <main className={styles.page}>
      <Link to="/blog" className={styles.back}>← All news</Link>
      {status === 'loading'  && <p className={styles.status}>Loading…</p>}
      {status === 'notfound' && <p className={styles.status}>Announcement not found.</p>}
      {status === 'error'    && <p className={styles.status} role="alert">Failed to load this announcement.</p>}
      {status === 'ok' && (
        <article>
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.date}>{new Date(post.created_at.replace(' ', 'T') + 'Z').toLocaleDateString()}</p>
          <p className={styles.body}>{post.body}</p>
        </article>
      )}
    </main>
  )
}
