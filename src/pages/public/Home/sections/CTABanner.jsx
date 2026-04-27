import { Link } from 'react-router-dom'
import styles from './CTABanner.module.css'

export default function CTABanner() {
  return (
    <section className={styles.section} aria-label="Call to action">
      <div className={styles.inner}>
        <h2 className={styles.heading}>Ready to Begin Your Journey?</h2>
        <p className={styles.sub}>Browse available programs or reach out to our academic team today.</p>
        <div className={styles.ctas}>
          <Link to="/courses" className={styles.primary}>Explore Courses</Link>
          <Link to="/contact" className={styles.ghost}>Contact Us</Link>
        </div>
      </div>
    </section>
  )
}
