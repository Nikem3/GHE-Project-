import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer} aria-label="Site footer">
      <div className={styles.top}>
        <div className={styles.inner}>
          <div className={styles.grid}>
            <div className={styles.brand}>
              <div className={styles.logoWrap}>
                <div className={styles.logoMark}>GHE</div>
                <span className={styles.logoName}>Global Higher Education</span>
              </div>
              <p className={styles.desc}>
                Adelaide's premier pathway to world-class undergraduate, postgraduate, and diploma
                programs — TEQSA registered and CRICOS accredited.
              </p>
              <div className={styles.socials}>
                <a href="https://linkedin.com" className={styles.socialBtn} aria-label="LinkedIn">in</a>
                <a href="https://x.com" className={styles.socialBtn} aria-label="X">𝕏</a>
                <a href="https://facebook.com" className={styles.socialBtn} aria-label="Facebook">f</a>
                <a href="https://youtube.com" className={styles.socialBtn} aria-label="YouTube">▶</a>
              </div>
            </div>

            <div className={styles.col}>
              <h4>Programs</h4>
              <Link to="/courses">Undergraduate</Link>
              <Link to="/courses">Postgraduate</Link>
              <Link to="/courses">Diplomas</Link>
              <Link to="/courses">English Courses</Link>
            </div>

            <div className={styles.col}>
              <h4>Students</h4>
              <Link to="/login?role=student">Student Portal</Link>
              <Link to="/contact">Submit Enquiry</Link>
              <Link to="/about">About GHE</Link>
              <Link to="/blog">News &amp; Updates</Link>
            </div>

            <div className={styles.col}>
              <h4>Contact</h4>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon} aria-hidden="true">📍</span>
                <span>Level 3, 50 King William St, Adelaide SA 5000</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon} aria-hidden="true">✉️</span>
                <span>enquiries@ghe.edu.au</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon} aria-hidden="true">📞</span>
                <span>+61 8 8000 0000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <span>© 2026 Global Higher Education. All rights reserved. CRICOS: 03178C</span>
          <div className={styles.bottomLinks}>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Use</Link>
            <Link to="/sitemap">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
