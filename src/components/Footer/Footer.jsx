import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer} aria-label="Site footer">
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.brandName}>GHE Portal</span>
          <p className={styles.tagline}>Empowering students through accessible education.</p>
        </div>

        <nav aria-label="Quick links" className={styles.links}>
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>

        <nav aria-label="Legal" className={styles.links}>
          <h3>Legal</h3>
          <ul>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Use</Link></li>
          </ul>
        </nav>

        <div className={styles.contact}>
          <h3>Contact</h3>
          <p><a href="mailto:enquiries@ghe.edu.au">enquiries@ghe.edu.au</a></p>
          <p><a href="tel:+61300000000">+61 3 0000 0000</a></p>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© 2025 Global Higher Education. All rights reserved.</p>
      </div>
    </footer>
  )
}
