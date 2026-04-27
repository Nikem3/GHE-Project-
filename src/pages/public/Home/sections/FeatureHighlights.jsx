import styles from './FeatureHighlights.module.css'

const FEATURES = [
  { icon: '📚', title: 'Browse Courses', desc: "50+ programs across bachelor's, master's and diplomas" },
  { icon: '✉️', title: 'Submit Enquiry', desc: 'Ask questions directly to academic staff' },
  { icon: '📊', title: 'Track Status', desc: 'Real-time updates on all your enquiries' },
  { icon: '📰', title: 'News & Updates', desc: 'Stay informed with GHE announcements' },
]

export default function FeatureHighlights() {
  return (
    <section className={styles.section} aria-label="Features">
      <div className={styles.inner}>
        <h2 className={styles.heading}>Everything You Need</h2>
        <div className={styles.grid}>
          {FEATURES.map((f) => (
            <div key={f.title} className={styles.card}>
              <span className={styles.icon} aria-hidden="true">{f.icon}</span>
              <h3 className={styles.title}>{f.title}</h3>
              <p className={styles.desc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
