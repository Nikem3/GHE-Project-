import styles from './FeatureHighlights.module.css'

const FEATURES = [
  { icon: '📚', title: 'Browse 18+ Programs',  desc: "Explore undergraduate, postgraduate, and diploma courses from accredited Australian institutions." },
  { icon: '✉️', title: 'Submit Enquiries',      desc: 'Ask questions directly to academic staff — no email required, tracked in one place.' },
  { icon: '📊', title: 'Track in Real Time',    desc: 'Watch your enquiry move from Open → Under Review → Resolved on your dashboard.' },
  { icon: '🔒', title: 'Secure Role Access',    desc: 'Three-tier login for students, staff, and admins — each with tailored views and permissions.' },
  { icon: '📰', title: 'News & Announcements',  desc: 'Stay up to date with GHE enrollment dates, events, and important academic notices.' },
  { icon: '📋', title: 'Full History',           desc: 'Keep records of all enquiries and resolutions — easily re-submit or escalate if needed.' },
]

export default function FeatureHighlights() {
  return (
    <section className={styles.section} aria-label="Features">
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.eyebrow}>Why GHE Portal</div>
          <h2 className={styles.heading}>Everything You Need</h2>
          <p className={styles.sub}>One platform for students, staff, and administrators.</p>
        </div>
        <div className={styles.grid}>
          {FEATURES.map((f) => (
            <div key={f.title} className={styles.card}>
              <div className={styles.iconWrap} aria-hidden="true">{f.icon}</div>
              <h3 className={styles.title}>{f.title}</h3>
              <p className={styles.desc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
