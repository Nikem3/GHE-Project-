import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './CourseDetail.module.css'

const LEVEL_LABEL = {
  bachelor: "Bachelor's Degree",
  master:   "Master's Degree",
  diploma:  'Graduate Diploma',
}

export default function CourseDetail() {
  const { id }   = useParams()
  const { user } = useAuth()

  const [course,   setCourse]   = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/courses/${id}`)
      .then(r => { if (r.status === 404) { setNotFound(true); return null } return r.json() })
      .then(data => { if (data) setCourse(data) })
      .finally(() => setLoading(false))
  }, [id])

  if (loading)  return <div className={styles.loading}>Loading…</div>
  if (notFound) return (
    <div className={styles.notFound}>
      <h2>Course not found</h2>
      <Link to="/courses">← Back to all programs</Link>
    </div>
  )

  const enquiryHref = user?.role === 'student'
    ? `/student/enquiries/new?course=${id}`
    : '/login'

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <Link to="/courses" className={styles.backLink}>← All Programs</Link>
          <div>
            <span className={`${styles.levelBadge} ${styles[course.level]}`}>
              {LEVEL_LABEL[course.level]}
            </span>
          </div>
          <h1 className={styles.heroTitle}>{course.title}</h1>
          <p className={styles.heroFaculty}>{course.faculty}</p>
        </div>
      </div>

      <div className={styles.body}>
        <div>
          <h2 className={styles.sectionTitle}>About This Program</h2>
          <p className={styles.description}>{course.description}</p>
        </div>

        <aside>
          <div className={styles.detailCard}>
            <h3 className={styles.detailCardTitle}>Program Details</h3>
            <div className={styles.detailRow}>
              <span className={styles.detailKey}>Duration</span>
              <span className={styles.detailVal}>
                {course.duration_years} year{course.duration_years !== 1 ? 's' : ''}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailKey}>Annual Fee</span>
              <span className={styles.detailVal}>A${course.fee_per_year.toLocaleString()}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailKey}>Intakes</span>
              <span className={styles.detailVal}>{course.intakes.join(', ')}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailKey}>Faculty</span>
              <span className={styles.detailVal}>{course.faculty}</span>
            </div>
            <Link to={enquiryHref} className={styles.ctaBtn}>
              Submit an Enquiry
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
