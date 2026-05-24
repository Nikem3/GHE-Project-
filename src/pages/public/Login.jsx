import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import styles from './Login.module.css'

const ROLE_HOME = {
  student: '/student/dashboard',
  staff:   '/staff/dashboard',
  admin:   '/admin/dashboard',
}

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error,        setError]        = useState('')
  const [loading,      setLoading]      = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email.trim(), password)
      navigate(ROLE_HOME[user.role] || '/')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* ── Left panel ── */}
      <div className={styles.left}>
        <div className={styles.leftInner}>
          <Link to="/" className={styles.logo}>
            <img src="/logo.png" alt="GHE" className={styles.logoImg} />
            <span className={styles.logoText}>GHE Portal</span>
          </Link>
          <h1 className={styles.tagline}>
            Your Academic<br />Journey Starts Here
          </h1>
          <p className={styles.taglineSub}>
            Access your courses, submit enquiries, and manage your
            academic life — all in one place.
          </p>
          <div className={styles.trustList}>
            {['TEQSA Registered Provider', 'CRICOS: 03178C', '1,200+ students enrolled this year'].map(t => (
              <div key={t} className={styles.trustItem}>
                <span className={styles.trustDot}>✓</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className={styles.right}>
        <div className={styles.formWrap}>
          <h2 className={styles.formTitle}>Welcome back</h2>
          <p className={styles.formSub}>Sign in to your GHE account</p>

          {error && <div className={styles.errorBox}>{error}</div>}

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

            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <div className={styles.passwordWrap}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className={styles.backLink}><Link to="/">← Back to home</Link></p>

          <div className={styles.demoHint}>
            <p className={styles.demoTitle}>Demo accounts</p>
            <p className={styles.demoRow}>nikem@ghe.edu.au / nikem123 — Student</p>
            <p className={styles.demoRow}>sachin@ghe.edu.au / sachin123 — Staff</p>
            <p className={styles.demoRow}>admin@ghe.edu.au / Password123! — Admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}
