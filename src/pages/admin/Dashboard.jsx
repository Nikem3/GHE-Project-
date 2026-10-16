import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { formatDate } from '../../lib/enquiries'
import styles from '../student/Dashboard.module.css'
import listStyles from '../student/Enquiries.module.css'

export default function AdminDashboard() {
  const { user, token } = useAuth()
  const firstName = user?.name?.split(' ')[0] ?? 'there'
  const [data, setData] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const headers   = { Authorization: `Bearer ${token}` }
    const firstOfMonth = new Date()
    firstOfMonth.setDate(1)
    const from = firstOfMonth.toISOString().slice(0, 10)

    const get = (url, opts) => fetch(url, opts).then(r => (r.ok ? r.json() : Promise.reject()))
    Promise.all([
      get('/api/staff', { headers }),
      get('/api/courses'),
      get(`/api/reports/enquiries?from=${from}`, { headers }),
      get('/api/reports/enquiries', { headers }),   // all-time: current open / unassigned
      get('/api/activity?limit=5', { headers }),
    ])
      .then(([staff, courses, report, overall, activity]) => setData({ staff, courses, report, overall, activity }))
      .catch(() => setFailed(true))
  }, [token])

  const metrics = [
    { label: 'Total Staff',          value: data ? data.staff.filter(s => s.is_active).length : '—', sub: 'Active accounts'      },
    { label: 'Active Courses',       value: data ? data.courses.length : '—',                         sub: 'Published programs'   },
    { label: 'Enquiries This Month', value: data?.report?.totals?.total ?? '—',                        sub: 'Across all staff'     },
    { label: 'Open Enquiries',       value: data?.overall.totals.open ?? '—',                         sub: 'Awaiting a reply'     },
    { label: 'Unassigned',           value: data?.overall.totals.unassigned ?? '—',                   sub: 'No staff owner yet'   },
    { label: 'System Status',        value: failed ? 'Degraded' : data ? 'OK' : '—',                  sub: failed ? 'Some data failed to load' : 'All services responding' },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.welcome}>
        <div>
          <h1 className={styles.welcomeTitle}>Hello, {firstName} 👋</h1>
          <p className={styles.welcomeSub}>GHE system administration overview.</p>
        </div>
        <span className={styles.roleChip}>Administrator</span>
      </div>
      <div className={styles.grid}>
        {metrics.map(({ label, value, sub }) => (
          <div key={label} className={styles.card}>
            <p className={styles.cardLabel}>{label}</p>
            <p className={styles.cardValue}>{value}</p>
            <p className={styles.cardSub}>{sub}</p>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '28px 0 12px' }}>
        Latest Activity
      </h2>
      {data?.activity.length === 0 && <div className={listStyles.empty}>No activity recorded yet.</div>}
      {data?.activity.length > 0 && (
        <div className={listStyles.list}>
          {data.activity.map(e => (
            <div key={e.id} className={listStyles.row}>
              <div>
                <p className={listStyles.rowSubject}>{e.action.replace(/_/g, ' ')}</p>
                <p className={listStyles.rowMeta}>
                  {e.actor_name} ({e.actor_role}){e.detail ? ` · ${e.detail}` : ''} · {formatDate(e.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
