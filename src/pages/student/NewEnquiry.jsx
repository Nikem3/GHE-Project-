import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Enquiries.module.css'

export default function NewEnquiry() {
  const { token } = useAuth()
  const navigate  = useNavigate()

  const [courses,    setCourses]    = useState([])
  const [courseId,   setCourseId]   = useState('')
  const [subject,    setSubject]    = useState('')
  const [message,    setMessage]    = useState('')
  const [error,      setError]      = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch('/api/courses')
      .then(r => (r.ok ? r.json() : []))
      .then(setCourses)
      .catch(() => {})
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/enquiries', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({
          course_id: courseId ? Number(courseId) : null,
          subject,
          message,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit enquiry')
      navigate(`/student/enquiries/${data.id}`)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <Link to="/student/enquiries" className={styles.backLink}>← Back to enquiries</Link>

      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>New Enquiry</h1>
          <p className={styles.subtitle}>We usually respond within 48 hours.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.formCard}>
        {error && <div className={styles.errorBox}>{error}</div>}

        <div className={styles.field}>
          <label htmlFor="course" className={styles.label}>Related course (optional)</label>
          <select
            id="course"
            value={courseId}
            onChange={e => setCourseId(e.target.value)}
            className={styles.select}
          >
            <option value="">General enquiry — no specific course</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="subject" className={styles.label}>Subject</label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="e.g. Entry requirements for Master of IT"
            className={styles.input}
            maxLength={120}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="message" className={styles.label}>Your question</label>
          <textarea
            id="message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Tell us what you'd like to know…"
            className={styles.textarea}
            required
          />
        </div>

        <button type="submit" className={styles.newBtn} disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit Enquiry'}
        </button>
      </form>
    </div>
  )
}
