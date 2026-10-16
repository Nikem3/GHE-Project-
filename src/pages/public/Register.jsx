import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Login.module.css'

export default function Register() {
  const { register } = useAuth()
  const navigate     = useNavigate()

  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(name.trim(), email.trim(), password)
      navigate('/student/dashboard')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
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
          <h1 className={styles.tagline}>Create Your<br />Student Account</h1>
          <p className={styles.taglineSub}>
            Browse courses, submit enquiries, and track responses in one place.
          </p>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.formWrap}>
          <h2 className={styles.formTitle}>Create an account</h2>
          <p className={styles.formSub}>Register as a GHE student</p>

          {error && <div className={styles.errorBox} role="alert">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor="name" className={styles.label}>Full name</label>
              <input id="name" type="text" autoComplete="name" value={name}
                onChange={e => setName(e.target.value)} className={styles.input} required />
            </div>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>Email address</label>
              <input id="email" type="email" autoComplete="email" value={email}
                onChange={e => setEmail(e.target.value)} className={styles.input} required />
            </div>
            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>Password (min 6 characters)</label>
              <input id="password" type="password" autoComplete="new-password" value={password}
                onChange={e => setPassword(e.target.value)} className={styles.input} minLength={6} required />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className={styles.backLink}>Already registered? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  )
}
