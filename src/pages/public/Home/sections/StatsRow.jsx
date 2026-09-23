import styles from './StatsRow.module.css'

const STATS = [
  { value: '1,200', suffix: '+',  label: 'Students Enrolled' },
  { value: '18',    suffix: '',   label: 'Accredited Programs' },
  { value: '95',    suffix: '%',  label: 'Enquiry Response Rate' },
  { value: '48',    suffix: 'hr', label: 'Avg. Response Time' },
]

export default function StatsRow() {
  return (
    <section className={styles.section} aria-label="Statistics">
      <div className={styles.inner}>
        {STATS.map((s) => (
          <div key={s.label} className={styles.stat}>
            <div className={styles.num}>
              {s.value}<span className={styles.suffix}>{s.suffix}</span>
            </div>
            <div className={styles.label}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
