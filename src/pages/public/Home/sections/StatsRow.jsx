import styles from './StatsRow.module.css'

const STATS = [
  { value: '50+', label: 'Courses Available', color: 'var(--accent-cyan)' },
  { value: '3', label: 'Study Levels', color: 'var(--accent-purple)' },
  { value: '< 24h', label: 'Enquiry Response', color: 'var(--accent-blue)' },
]

export default function StatsRow() {
  return (
    <section className={styles.section} aria-label="Statistics">
      <div className={styles.inner}>
        {STATS.map((s) => (
          <div key={s.label} className={styles.stat}>
            <span className={styles.value} style={{ '--stat-color': s.color }}>{s.value}</span>
            <span className={styles.label}>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
