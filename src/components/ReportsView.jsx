import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { formatDate } from '../lib/enquiries'
import styles from '../pages/student/Dashboard.module.css'
import listStyles from '../pages/student/Enquiries.module.css'

function toISODate(d) { return d.toISOString().slice(0, 10) }

const PRESETS = {
  week:  () => { const to = new Date(); const from = new Date(); from.setDate(to.getDate() - 6); return [toISODate(from), toISODate(to)] },
  month: () => { const to = new Date(); const from = new Date(); from.setDate(to.getDate() - 29); return [toISODate(from), toISODate(to)] },
}

export default function ReportsView({ title, subtitle }) {
  const { token } = useAuth()
  const [preset, setPreset] = useState('month')
  const [from, setFrom]     = useState(PRESETS.month()[0])
  const [to, setTo]         = useState(PRESETS.month()[1])
  const [report, setReport] = useState(null)
  const [error, setError]   = useState('')

  useEffect(() => {
    fetch(`/api/reports/enquiries?from=${from}&to=${to}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(setReport)
      .catch(() => setError('Failed to load report. Make sure the backend server is running.'))
  }, [token, from, to])

  const applyPreset = key => {
    setPreset(key)
    const [f, t] = PRESETS[key]()
    setFrom(f)
    setTo(t)
  }

  const totals = report?.totals
  const cards = [
    { label: 'Total Enquiries', value: totals?.total ?? '—' },
    { label: 'Open',            value: totals?.open ?? '—' },
    { label: 'In Progress',     value: totals?.in_progress ?? '—' },
    { label: 'Resolved',        value: totals?.resolved ?? '—' },
    { label: 'Avg. Response',   value: totals?.avgResponseHours != null ? `${totals.avgResponseHours}h` : '—' },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.welcome}>
        <div>
          <h1 className={styles.welcomeTitle}>{title}</h1>
          <p className={styles.welcomeSub}>{subtitle}</p>
        </div>
      </div>

      <div className={listStyles.filters}>
        <button className={`${listStyles.pill}${preset === 'week' ? ` ${listStyles.pillActive}` : ''}`}
          onClick={() => applyPreset('week')}>This Week</button>
        <button className={`${listStyles.pill}${preset === 'month' ? ` ${listStyles.pillActive}` : ''}`}
          onClick={() => applyPreset('month')}>This Month</button>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <label htmlFor="reportFrom" className={listStyles.label}>From</label>
          <input id="reportFrom" type="date" className={listStyles.input} value={from}
            onChange={e => { setPreset('custom'); setFrom(e.target.value) }} />
        </div>
        <div>
          <label htmlFor="reportTo" className={listStyles.label}>To</label>
          <input id="reportTo" type="date" className={listStyles.input} value={to}
            onChange={e => { setPreset('custom'); setTo(e.target.value) }} />
        </div>
      </div>

      {error && <p className={listStyles.errorMsg}>{error}</p>}
      {!error && !report && <p className={listStyles.loading}>Loading…</p>}

      {report && (
        <>
          <div className={styles.grid} style={{ marginBottom: 28 }}>
            {cards.map(({ label, value }) => (
              <div key={label} className={styles.card}>
                <p className={styles.cardLabel}>{label}</p>
                <p className={styles.cardValue}>{value}</p>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px' }}>
            Enquiries by Course
          </h2>
          {report.byCourse.length === 0 ? (
            <div className={listStyles.empty}>No enquiries in this range.</div>
          ) : (
            <div className={listStyles.list} style={{ marginBottom: 28 }}>
              {report.byCourse.map(row => (
                <div key={row.course} className={listStyles.row}>
                  <p className={listStyles.rowSubject}>{row.course}</p>
                  <span className={listStyles.rowRight}>{row.count}</span>
                </div>
              ))}
            </div>
          )}

          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px' }}>
            Enquiries by Day
          </h2>
          {report.byDay.length === 0 ? (
            <div className={listStyles.empty}>No enquiries in this range.</div>
          ) : (
            <div className={listStyles.list}>
              {report.byDay.map(row => (
                <div key={row.day} className={listStyles.row}>
                  <p className={listStyles.rowSubject}>{formatDate(row.day + ' 00:00:00')}</p>
                  <span className={listStyles.rowRight}>{row.count}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
