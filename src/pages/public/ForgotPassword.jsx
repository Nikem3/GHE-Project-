import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Login.module.css'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim() }),
      })
      if (!res.ok) throw new Error('Something went wrong. Please try again.')
      setSent(true)
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
          <h1 className={styles.tagline}>Forgot Your<br />Password?</h1>
          <p className={styles.taglineSub}>
            Enter your account email and we'll send you a link to reset it.
          </p>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.formWrap}>
          <h2 className={styles.formTitle}>Reset password</h2>
          <p className={styles.formSub}>We'll email you a reset link</p>

          {error && <div className={styles.errorBox}>{error}</div>}

          {sent ? (
            <p style={{ fontSize: 14, color: 'var(--text-body)', lineHeight: 1.6 }}>
              If that email has a GHE account, a password reset link has been sent. Check your inbox.
            </p>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>Email address</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="you@ghe.edu.au"
                  required
                />
              </div>
              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          )}

          <p className={styles.backLink}><Link to="/login">← Back to sign in</Link></p>
        </div>
      </div>
    </div>
  )
}
