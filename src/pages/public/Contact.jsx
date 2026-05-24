import { useState } from 'react'
import styles from './Contact.module.css'

const ENQUIRY_TYPES = [
  'Course Information',
  'Enrolment & Admissions',
  'Fees & Scholarships',
  'Student Visa Support',
  'RPL / Credit Transfer',
  'General Enquiry',
]

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: '', message: '' })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroEyebrow}>Contact Us</div>
          <h1 className={styles.heroTitle}>We'd Love to Hear From You</h1>
          <p className={styles.heroSub}>
            Questions about programs, fees, or enrolment? Our team typically responds within one business day.
          </p>
        </div>
      </section>

      <div className={styles.body}>
        {/* Form */}
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Send an Enquiry</h2>
          <p className={styles.formSub}>Fill in the form and we'll get back to you shortly.</p>

          {sent && (
            <div className={styles.successBox}>
              Thanks! Your enquiry has been received. We'll be in touch within one business day.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Full name</label>
                <input className={styles.input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name" required />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email address</label>
                <input className={styles.input} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" required />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Phone (optional)</label>
                <input className={styles.input} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+61 4xx xxx xxx" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Enquiry type</label>
                <select className={styles.select} value={form.type} onChange={e => set('type', e.target.value)} required>
                  <option value="">Select…</option>
                  {ENQUIRY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Message</label>
              <textarea className={styles.textarea} value={form.message} onChange={e => set('message', e.target.value)} placeholder="Tell us how we can help…" required />
            </div>
            <button type="submit" className={styles.submitBtn}>Send Enquiry</button>
          </form>
        </div>

        {/* Info sidebar */}
        <div className={styles.infoStack}>
          <div className={styles.infoCard}>
            <h3 className={styles.infoCardTitle}>Contact Details</h3>
            {[
              { icon: '📍', label: 'Address', value: 'Level 3, 147 Pirie Street\nAdelaide SA 5000' },
              { icon: '📞', label: 'Phone', value: '+61 8 8100 0000' },
              { icon: '✉️', label: 'Email', value: 'enquiries@ghe.edu.au' },
              { icon: '🌐', label: 'CRICOS', value: '03178C' },
            ].map(({ icon, label, value }) => (
              <div key={label} className={styles.infoRow}>
                <div className={styles.infoIcon}>{icon}</div>
                <div>
                  <p className={styles.infoLabel}>{label}</p>
                  <p className={styles.infoValue} style={{ whiteSpace: 'pre-line' }}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.infoCard}>
            <h3 className={styles.infoCardTitle}>Office Hours</h3>
            <div className={styles.hoursGrid}>
              {[
                ['Monday – Friday', '9:00 am – 5:00 pm'],
                ['Saturday',        '10:00 am – 2:00 pm'],
                ['Sunday',          'Closed'],
              ].map(([day, hrs]) => (
                <div key={day} className={styles.hoursRow}><span>{day}</span><span>{hrs}</span></div>
              ))}
            </div>
          </div>

          <div className={styles.infoCard}>
            <h3 className={styles.infoCardTitle}>Already a Student?</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 12px', lineHeight: 1.6 }}>
              Log in to the student portal to submit and track your enquiries directly.
            </p>
            <a href="/login" style={{ display: 'block', textAlign: 'center', padding: '10px', background: 'var(--orange)', color: '#fff', borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              Student Portal Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
