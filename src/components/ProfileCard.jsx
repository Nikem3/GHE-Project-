import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from '../pages/student/Dashboard.module.css'

const ROLE_LABEL = { student: 'Student', staff: 'Academic Staff', admin: 'Administrator' }

async function send(method, path, token, body) {
  const res  = await fetch(path, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body:    JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
  return data
}

const inputStyle = { padding: '8px 10px', border: '1px solid var(--border, #ccc)', borderRadius: 6, width: '100%', marginBottom: 8 }

const Msg = ({ m }) => m && <p role={m.ok ? 'status' : 'alert'} className={styles.cardSub}>{m.text}</p>

export default function ProfileCard() {
  const { user, token, updateUser } = useAuth()
  const [name,    setName]    = useState(user?.name ?? '')
  const [current, setCurrent] = useState('')
  const [next,    setNext]    = useState('')
  const [nameMsg, setNameMsg] = useState(null)
  const [pwMsg,   setPwMsg]   = useState(null)
  if (!user) return null

  const roleLabel = ROLE_LABEL[user.role] ?? user.role

  const saveName = async (e) => {
    e.preventDefault()
    try {
      const { user: u } = await send('PATCH', '/api/auth/me', token, { name })
      updateUser(u)
      setNameMsg({ ok: true, text: 'Name updated.' })
    } catch (err) { setNameMsg({ ok: false, text: err.message }) }
  }

  const savePassword = async (e) => {
    e.preventDefault()
    try {
      await send('POST', '/api/auth/change-password', token, { current, password: next })
      setCurrent(''); setNext('')
      setPwMsg({ ok: true, text: 'Password changed.' })
    } catch (err) { setPwMsg({ ok: false, text: err.message }) }
  }

  return (
    <div className={styles.page}>
      <div className={styles.welcome}>
        <div>
          <h1 className={styles.welcomeTitle}>My Profile</h1>
          <p className={styles.welcomeSub}>Your GHE account details.</p>
        </div>
        <span className={styles.roleChip}>{roleLabel}</span>
      </div>
      <div className={styles.grid}>
        <form className={styles.card} onSubmit={saveName}>
          <label htmlFor="profile-name" className={styles.cardLabel}>Full name</label>
          <input id="profile-name" style={inputStyle} value={name} onChange={e => setName(e.target.value)} required />
          <button type="submit">Save name</button>
          <Msg m={nameMsg} />
        </form>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Email address</p>
          <p className={styles.cardText}>{user.email}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Role</p>
          <p className={styles.cardText}>{roleLabel}</p>
        </div>
        <form className={styles.card} onSubmit={savePassword}>
          <p className={styles.cardLabel}>Change password</p>
          <label htmlFor="current-password" className={styles.cardSub}>Current password</label>
          <input id="current-password" type="password" autoComplete="current-password" style={inputStyle}
            value={current} onChange={e => setCurrent(e.target.value)} required />
          <label htmlFor="new-password" className={styles.cardSub}>New password (min 6 characters)</label>
          <input id="new-password" type="password" autoComplete="new-password" style={inputStyle}
            value={next} onChange={e => setNext(e.target.value)} minLength={6} required />
          <button type="submit">Change password</button>
          <Msg m={pwMsg} />
        </form>
      </div>
    </div>
  )
}
