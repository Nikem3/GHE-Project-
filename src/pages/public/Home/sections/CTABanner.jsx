import { Link } from 'react-router-dom'
import styles from './CTABanner.module.css'

export default function CTABanner() {
  return (
    <section className={styles.section} aria-label="Call to action">
      <div className={styles.circle1} aria-hidden="true" />
      <div className={styles.circle2} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.tag}>Get Started Today</div>
        <h2 className={styles.heading}>
          Ready to Begin Your<br />
          <span className={styles.accent}>Academic Journey?</span>
        </h2>
        <p className={styles.sub}>
          Browse available programs or reach out to our academic team today.
          Applications for 2026 Semester 2 are now open.
        </p>
        <div className={styles.ctas}>
          <Link to="/courses" className={styles.btnPrimary}>Explore Courses</Link>
          <Link to="/contact" className={styles.btnOutline}>Contact Us</Link>
        </div>
      </div>
    </section>
  )
}
