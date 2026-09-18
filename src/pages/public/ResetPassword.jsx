import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import styles from './Login.module.css'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to reset password')
      setDone(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.leftInner}>
          <Link to="/" className={styles.logo}>
            <img src="/logo.png" alt="GHE" className={styles.logoImg} />
            <span className={styles.logoText}>GHE Portal</span>
          </Link>
          <h1 className={styles.tagline}>Set a New<br />Password</h1>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.formWrap}>
          <h2 className={styles.formTitle}>New password</h2>
          <p className={styles.formSub}>Choose a new password for your account</p>

          {error && <div className={styles.errorBox}>{error}</div>}

          {!token ? (
            <p style={{ fontSize: 14, color: 'var(--text-body)', lineHeight: 1.6 }}>
              This reset link is missing its token. Request a new one from the{' '}
              <Link to="/forgot-password">forgot password</Link> page.
            </p>
          ) : done ? (
            <p style={{ fontSize: 14, color: 'var(--text-body)', lineHeight: 1.6 }}>
              Your password has been reset. Redirecting you to sign in…
            </p>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label htmlFor="password" className={styles.label}>New password</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                />
              </div>
              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? 'Saving…' : 'Set new password'}
              </button>
            </form>
          )}

          <p className={styles.backLink}><Link to="/login">← Back to sign in</Link></p>
        </div>
      </div>
    </div>
  )
}
