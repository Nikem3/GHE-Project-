import { Link } from 'react-router-dom'
import styles from './CoursePreview.module.css'

const COURSES = [
  {
    id: 1,
    seed: 'business-mba',
    title: 'Master of Business (Analytics)',
    level: 'Postgraduate',
    tag: '🔥 Popular',
    desc: 'Develop strategic thinking and data-driven decision making for modern global business environments.',
    duration: '2 Yrs',
    mode: 'On Campus',
    location: 'Adelaide',
  },
  {
    id: 2,
    seed: 'tech-coding',
    title: 'Bachelor of Information Technology',
    level: 'Undergraduate',
    tag: null,
    desc: 'Build expertise in software development, networking, and emerging technologies through hands-on projects.',
    duration: '3 Yrs',
    mode: 'On Campus',
    location: 'Adelaide',
  },
  {
    id: 3,
    seed: 'management-office',
    title: 'Graduate Diploma of Management',
    level: 'Diploma',
    tag: '⚡ Fast-track',
    desc: 'Fast-track your management career with practical leadership and organisational strategy skills.',
    duration: '1 Yr',
    mode: 'Blended',
    location: 'Adelaide',
  },
]

export default function CoursePreview() {
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
          {COURSES.map((c) => (
            <article key={c.id} className={styles.card}>
              <div className={styles.imgWrap}>
                <img
                  src={`https://picsum.photos/seed/${c.seed}/600/300`}
                  alt={c.title}
                  className={styles.img}
                />
                <div className={styles.imgOverlay} />
                <div className={styles.imgTags}>
                  <span className={styles.tagLevel}>{c.level}</span>
                  {c.tag && <span className={styles.tagBadge}>{c.tag}</span>}
                </div>
                <div className={styles.imgTitle}>{c.title}</div>
              </div>

              <div className={styles.body}>
                <p className={styles.desc}>{c.desc}</p>
                <div className={styles.meta}>
                  <div className={styles.metaItem}>
                    <div className={styles.metaVal}>{c.duration}</div>
                    <div className={styles.metaKey}>Duration</div>
                  </div>
                  <div className={styles.metaItem}>
                    <div className={styles.metaVal}>{c.mode}</div>
                    <div className={styles.metaKey}>Mode</div>
                  </div>
                  <div className={styles.metaItem}>
                    <div className={styles.metaVal}>{c.location}</div>
                    <div className={styles.metaKey}>Location</div>
                  </div>
                </div>
              </div>

              <div className={styles.footer}>
                <Link to={`/courses/${c.id}`} className={styles.enquireBtn}>Submit Enquiry →</Link>
                <Link to={`/courses/${c.id}`} className={styles.learnMore}>Learn more</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
