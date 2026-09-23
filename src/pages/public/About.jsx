import styles from './About.module.css'

const VALUES = [
  { icon: '🎓', title: 'Academic Excellence', body: 'We hold ourselves to the highest educational standards, ensuring every program meets TEQSA requirements and prepares graduates for real-world careers.' },
  { icon: '🌏', title: 'Global Perspective', body: 'Our diverse student cohort from over 40 countries creates a rich learning environment that prepares graduates for an interconnected world.' },
  { icon: '🤝', title: 'Student Success', body: 'Every decision we make puts students first. From enrolment to graduation, our support teams are here to help you thrive.' },
  { icon: '🔬', title: 'Industry Relevance', body: 'Curricula designed with industry partners to ensure graduates enter the workforce with skills employers actually need.' },
  { icon: '♻️', title: 'Sustainability', body: 'We embed sustainable thinking across disciplines, preparing students to tackle the environmental and social challenges of tomorrow.' },
  { icon: '💡', title: 'Innovation', body: 'From digital classrooms to industry-linked research, we continuously evolve our teaching to stay ahead of an ever-changing landscape.' },
]

const STATS = [
  { num: '12+', label: 'Years operating in Australia' },
  { num: '3,200+', label: 'Graduates since founding' },
  { num: '40+', label: 'Countries represented' },
  { num: '95%', label: 'Graduate employment rate' },
]

const TEAM = [
  { name: 'Sachin Adhikari', role: 'Scrum Master & Business Analyst', id: '30457506', initials: 'SA' },
  { name: 'Nikem Parajuli',  role: 'Lead Developer & DBA',            id: '30446831', initials: 'NP' },
]

export default function About() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroEyebrow}>About GHE</div>
          <h1 className={styles.heroTitle}>Transforming Lives Through Quality Education</h1>
          <p className={styles.heroSub}>
            Global Higher Education is a TEQSA-registered provider delivering world-class undergraduate,
            postgraduate, and professional programs from our Adelaide campus.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className={styles.mission}>
        <div>
          <p className={styles.missionEyebrow}>Our Mission</p>
          <h2 className={styles.missionTitle}>Empowering the Next Generation of Global Leaders</h2>
          <p className={styles.missionBody}>
            Founded in Adelaide, Global Higher Education was built on a simple belief: that
            every student deserves access to a rigorous, relevant, and supportive education
            that equips them for a lifetime of impact.
          </p>
          <p className={styles.missionBody}>
            Today we offer programs across Business and Technology, with close ties to
            industry partners across Australia and Asia-Pacific. Our small class sizes,
            experienced faculty, and dedicated student services team make GHE the
            institution of choice for students who want more than a degree — they want
            a career.
          </p>
        </div>
        <div className={styles.missionStats}>
          {STATS.map(({ num, label }) => (
            <div key={label} className={styles.statCard}>
              <p className={styles.statNum}>{num}</p>
              <p className={styles.statLabel}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className={styles.valuesSection}>
        <div className={styles.valuesSectionInner}>
          <p className={styles.sectionEyebrow}>What We Stand For</p>
          <h2 className={styles.sectionTitle}>Our Core Values</h2>
          <div className={styles.valuesGrid}>
            {VALUES.map(({ icon, title, body }) => (
              <div key={title} className={styles.valueCard}>
                <div className={styles.valueIcon}>{icon}</div>
                <h3 className={styles.valueTitle}>{title}</h3>
                <p className={styles.valueBody}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className={styles.teamSection}>
        <p className={styles.sectionEyebrow}>The Team</p>
        <h2 className={styles.sectionTitle} style={{ textAlign: 'left', marginBottom: 0 }}>
          Built by Team Nirmaan
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: 15 }}>
          ITECH 3208 · Federation University · 2026
        </p>
        <div className={styles.teamGrid}>
          {TEAM.map(({ name, role, id, initials }) => (
            <div key={id} className={styles.teamCard}>
              <div className={styles.teamAvatar}>{initials}</div>
              <p className={styles.teamName}>{name}</p>
              <p className={styles.teamRole}>{role}</p>
              <span className={styles.teamId}>{id}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Accreditation */}
      <section className={styles.accredSection}>
        <div className={styles.accredInner}>
          <div>
            <p className={styles.accredTitle}>Registered &amp; Accredited</p>
            <p className={styles.accredSub}>GHE meets all Australian regulatory requirements for higher education.</p>
          </div>
          <div className={styles.accredBadges}>
            {['TEQSA Registered', 'CRICOS: 03178C', 'Adelaide, SA', 'ABN: 12 345 678 901'].map(b => (
              <span key={b} className={styles.accredBadge}>{b}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
