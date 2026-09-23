import { Link } from 'react-router-dom'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero} aria-label="Hero">
      {/* Left: text content */}
      <div className={styles.left}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowDot} aria-hidden="true" />
          <span className={styles.eyebrowText}>Australia's Premier Pathway</span>
        </div>

        <h1 className={styles.h1}>
          Shape Your<br />
          Future with<br />
          <span className={styles.accent}>GHE</span>
        </h1>

        <p className={styles.sub}>
          World-class undergraduate, postgraduate, and diploma programs from Adelaide, South
          Australia. Submit enquiries, track progress, and manage your entire academic journey
          in one place.
        </p>

        <div className={styles.ctas}>
          <Link to="/courses" className={styles.btnPrimary}>
            Explore Courses
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link to="/login?role=student" className={styles.btnGhost}>Submit an Enquiry</Link>
        </div>

        <div className={styles.trust}>
          <div className={styles.trustAvatars}>
            {['student-a', 'student-b', 'student-c', 'student-d'].map((seed) => (
              <div key={seed} className={styles.trustAvatar}>
                <img src={`https://picsum.photos/seed/${seed}/32/32`} alt="" />
              </div>
            ))}
          </div>
          <span className={styles.trustText}><strong>1,200+ students</strong> enrolled this year</span>
          <span className={styles.trustSep} aria-hidden="true" />
          <span className={styles.trustBadge}><span className={styles.tick}>✓</span> TEQSA Registered</span>
          <span className={styles.trustBadge}><span className={styles.tick}>✓</span> CRICOS: 03178C</span>
        </div>
      </div>

      {/* Right: image + floating cards */}
      <div className={styles.right} aria-hidden="true">
        <img
          className={styles.heroImg}
          src="https://picsum.photos/seed/university-campus/900/900"
          alt=""
        />

        <div className={`${styles.floatCard} ${styles.fc1}`}>
          <div className={styles.fcLabel}>Enquiry Response Rate</div>
          <div className={styles.fcValue}>95<span className={styles.fcSuffix}>%</span></div>
          <div className={styles.fcSub}>Avg. 48 hr response time</div>
          <div className={styles.fcBar}>
            <div className={`${styles.fcSeg} ${styles.filled}`} />
            <div className={`${styles.fcSeg} ${styles.filled}`} />
            <div className={`${styles.fcSeg} ${styles.filled}`} />
            <div className={`${styles.fcSeg} ${styles.filled}`} />
            <div className={styles.fcSeg} />
          </div>
        </div>

        <div className={`${styles.floatCard} ${styles.fc2}`}>
          <div className={styles.fcFace}>
            <img className={styles.fcFaceImg} src="https://picsum.photos/seed/student-e/40/40" alt="" />
            <div>
              <div className={styles.fcName}>Priya M.</div>
              <div className={styles.fcRole}>MBA Student, 2025</div>
            </div>
          </div>
          <div className={styles.fcStars}>⭐⭐⭐⭐⭐</div>
          <div className={styles.fcQuote}>"The portal made my entire enrollment process so smooth!"</div>
        </div>

        <div className={`${styles.floatCard} ${styles.fc3}`}>
          <div className={styles.fcPill}>📚 Trending Courses</div>
          <div className={styles.fcCourses}>
            <span>Master of Business</span>
            <span>Bachelor of IT</span>
            <span>Grad. Diploma Mgmt.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
