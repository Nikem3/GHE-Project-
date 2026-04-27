import { Link } from 'react-router-dom'
import styles from './CoursePreview.module.css'

const COURSES = [
  { id: 1, title: 'Bachelor of Information Technology', level: "Bachelor's", duration: '3 years', mode: 'Full-time', accentColor: 'var(--accent-blue)' },
  { id: 2, title: 'Master of Business Administration', level: "Master's", duration: '2 years', mode: 'Full-time', accentColor: 'var(--accent-purple)' },
  { id: 3, title: 'Diploma of Health Services', level: 'Diploma', duration: '1 year', mode: 'Flexible', accentColor: 'var(--accent-cyan)' },
]

export default function CoursePreview() {
  return (
    <section className={styles.section} aria-label="Popular courses">
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Popular Courses</h2>
          <Link to="/courses" className={styles.viewAll}>View All Courses →</Link>
        </div>
        <div className={styles.grid}>
          {COURSES.map((c) => (
            <article key={c.id} className={styles.card}>
              <div className={styles.accent} style={{ '--card-accent': c.accentColor }} />
              <div className={styles.body}>
                <span className={styles.level}>{c.level}</span>
                <h3 className={styles.title}>{c.title}</h3>
                <p className={styles.meta}>{c.duration} · {c.mode}</p>
                <Link to={`/courses/${c.id}`} className={styles.link}>Learn more →</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
