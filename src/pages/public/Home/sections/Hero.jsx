import { Link } from 'react-router-dom'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero} aria-label="Hero">
      <div className={styles.inner}>
        <span className={styles.badge}>Global Higher Education</span>
        <h1 className={styles.headline}>
          Shape Your Future<br />
          <span className={styles.gradient}>with GHE</span>
        </h1>
        <p className={styles.sub}>
          Australia's pathway to world-class undergraduate, postgraduate, and diploma programs.
        </p>
        <div className={styles.ctas}>
          <Link to="/login?role=student" className={styles.ctaPrimary}>
            I'm a Student
          </Link>
          <Link to="/login?role=staff" className={styles.ctaGhost}>
            I'm Staff
          </Link>
          <Link to="/login?role=admin" className={styles.ctaGhost}>
            Admin
          </Link>
        </div>
      </div>
    </section>
  )
}
