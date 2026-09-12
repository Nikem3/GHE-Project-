import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './CoursePreview.module.css'

const LEVEL_META = {
  bachelor: { label: 'Undergraduate', gradient: 'linear-gradient(135deg, #2563EB, #1E40AF)' },
  master:   { label: 'Postgraduate',  gradient: 'linear-gradient(135deg, #7C3AED, #5B21B6)' },
  diploma:  { label: 'Diploma',       gradient: 'var(--gradient-cta)' },
}

// One card per level for variety; falls back to the first three courses.
function pickPreview(courses) {
  const picks = ['bachelor', 'master', 'diploma']
    .map(level => courses.find(c => c.level === level))
    .filter(Boolean)
  return picks.length === 3 ? picks : courses.slice(0, 3)
}

export default function CoursePreview() {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    fetch('/api/courses')
      .then(r => (r.ok ? r.json() : []))
      .then(all => setCourses(pickPreview(all)))
      .catch(() => {})
  }, [])

  if (courses.length === 0) return null

  return (
    <section className={styles.section} aria-label="Popular courses">
      <div className={styles.inner}>
        <div className={styles.headerRow}>
          <div>
            <div className={styles.eyebrow}>Programs</div>
            <h2 className={styles.heading}>Explore Our Courses</h2>
            <p className={styles.sub}>Accredited programs designed to launch your career in Australia and globally.</p>
          </div>
          <Link to="/courses" className={styles.viewAll}>View all programs →</Link>
        </div>

        <div className={styles.grid}>
          {courses.map(c => {
            const meta = LEVEL_META[c.level] ?? LEVEL_META.bachelor
            return (
              <article key={c.id} className={styles.card}>
                <div className={styles.imgWrap} style={{ background: meta.gradient }}>
                  <div className={styles.imgOverlay} />
                  <div className={styles.imgTags}>
                    <span className={styles.tagBadge}>{meta.label}</span>
                    <span className={styles.tagBadge}>{c.faculty}</span>
                  </div>
                  <div className={styles.imgTitle}>{c.title}</div>
                </div>

                <div className={styles.body}>
                  <p className={styles.desc}>
                    {c.description.length > 110 ? c.description.slice(0, 110) + '…' : c.description}
                  </p>
                  <div className={styles.meta}>
                    <div className={styles.metaItem}>
                      <div className={styles.metaVal}>{c.duration_years} Yr{c.duration_years !== 1 ? 's' : ''}</div>
                      <div className={styles.metaKey}>Duration</div>
                    </div>
                    <div className={styles.metaItem}>
                      <div className={styles.metaVal}>A${c.fee_per_year.toLocaleString()}</div>
                      <div className={styles.metaKey}>Per year</div>
                    </div>
                    <div className={styles.metaItem}>
                      <div className={styles.metaVal}>{c.intakes.join(' · ')}</div>
                      <div className={styles.metaKey}>Intakes</div>
                    </div>
                  </div>
                </div>

                <div className={styles.footer}>
                  <Link to={`/courses/${c.id}`} className={styles.enquireBtn}>Submit Enquiry →</Link>
                  <Link to={`/courses/${c.id}`} className={styles.learnMore}>Learn more</Link>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
