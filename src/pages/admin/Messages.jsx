import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { formatDate } from '../../lib/enquiries'
import styles from '../student/Enquiries.module.css'

export default function AdminMessages() {
  const { token } = useAuth()
  const [messages, setMessages] = useState(null)
  const [error,    setError]    = useState('')

  useEffect(() => {
    fetch('/api/contact', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(setMessages)
      .catch(() => setError('Failed to load messages. Make sure the backend server is running.'))
  }, [token])

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Contact Messages</h1>
          <p className={styles.subtitle}>Enquiries submitted through the public Contact Us form.</p>
        </div>
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}
      {!error && !messages && <p className={styles.loading}>Loading…</p>}
      {messages?.length === 0 && <div className={styles.empty}>No contact messages yet.</div>}

      {messages?.length > 0 && (
        <div className={styles.list}>
          {messages.map(m => (
            <div key={m.id} className={styles.row}>
              <div>
                <p className={styles.rowSubject}>{m.name} — {m.enquiry_type}</p>
                <p className={styles.rowMeta}>
                  {m.email}{m.phone ? ` · ${m.phone}` : ''} · {formatDate(m.created_at)}
                </p>
                <p style={{ fontSize: 14, color: 'var(--text-body)', margin: '8px 0 0', lineHeight: 1.6 }}>
                  {m.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
