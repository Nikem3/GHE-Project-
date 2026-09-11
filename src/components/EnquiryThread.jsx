import { useState, useEffect, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import StatusBadge from './StatusBadge'
import { STATUS_LABELS, formatDate } from '../lib/enquiries'
import styles from '../pages/student/Enquiries.module.css'

export default function EnquiryThread({ backTo, staff = false }) {
  const { id } = useParams()
  const { token } = useAuth()
  const [enquiry, setEnquiry] = useState(null)
  const [error,   setError]   = useState('')
  const [reply,   setReply]   = useState('')
  const [sending, setSending] = useState(false)

  const load = useCallback(() => {
    fetch(`/api/enquiries/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(setEnquiry)
      .catch(() => setError('Failed to load enquiry.'))
  }, [id, token])

  useEffect(load, [load])

  const sendReply = async e => {
    e.preventDefault()
    if (!reply.trim()) return
    setSending(true)
    setError('')
    try {
      const res = await fetch(`/api/enquiries/${id}/messages`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ body: reply }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to send reply')
      setReply('')
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  const changeStatus = async status => {
    const res = await fetch(`/api/enquiries/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body:    JSON.stringify({ status }),
    })
    if (res.ok) load()
    else setError('Failed to update status.')
  }

  if (!enquiry) {
    return (
      <div className={styles.page}>
        <Link to={backTo} className={styles.backLink}>← Back to enquiries</Link>
        {error ? <p className={styles.errorMsg}>{error}</p> : <p className={styles.loading}>Loading…</p>}
      </div>
    )
  }

  const resolved = enquiry.status === 'resolved'

  return (
    <div className={styles.page}>
      <Link to={backTo} className={styles.backLink}>← Back to enquiries</Link>

      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>{enquiry.subject}</h1>
          <p className={styles.subtitle}>
            {staff ? `From ${enquiry.student_name} · ` : ''}
            {enquiry.course_title ?? 'General enquiry'} · submitted {formatDate(enquiry.created_at)}
          </p>
        </div>
        <div className={styles.rowRight}>
          {staff ? (
            <select
              value={enquiry.status}
              onChange={e => changeStatus(e.target.value)}
              className={`${styles.select} ${styles.statusSelect}`}
              aria-label="Enquiry status"
            >
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          ) : (
            <StatusBadge status={enquiry.status} />
          )}
        </div>
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}

      <div className={styles.threadCard}>
        {enquiry.messages.map(m => (
          <div
            key={m.id}
            className={`${styles.msg} ${m.sender_role === 'student' ? styles.msgStudent : styles.msgStaff}`}
          >
            <p className={styles.msgHead}>
              {m.sender_name} · {m.sender_role === 'student' ? 'Student' : 'Academic Staff'} · {formatDate(m.created_at)}
            </p>
            <p className={styles.msgBody}>{m.body}</p>
          </div>
        ))}
      </div>

      {resolved ? (
        <p className={styles.detailNote}>
          This enquiry has been resolved.{staff ? ' Change the status to reply again.' : ''}
        </p>
      ) : (
        <form onSubmit={sendReply} className={styles.replyRow}>
          <textarea
            value={reply}
            onChange={e => setReply(e.target.value)}
            placeholder="Write a reply…"
            className={styles.textarea}
            aria-label="Reply"
            required
          />
          <button type="submit" className={styles.newBtn} disabled={sending}>
            {sending ? 'Sending…' : 'Send'}
          </button>
        </form>
      )}
    </div>
  )
}
