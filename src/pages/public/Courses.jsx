import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './Courses.module.css'

const FILTERS = [
  { value: '',         label: 'All Programs' },
  { value: 'bachelor', label: "Bachelor's"   },
  { value: 'master',   label: "Master's"     },
  { value: 'diploma',  label: 'Diploma'      },
]

const LEVEL_LABEL = {
  bachelor: "Bachelor's",
  master:   "Master's",
  diploma:  'Diploma',
}

export default function Courses() {
  const [courses,     setCourses]     = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')
  const [activeLevel, setActiveLevel] = useState('')
  const [search,      setSearch]      = useState('')

  useEffect(() => {
    setLoading(true)
    const url = activeLevel ? `/api/courses?level=${activeLevel}` : '/api/courses'
    fetch(url)
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(setCourses)
      .catch(() => setError('Failed to load courses. Make sure the backend server is running.'))
      .finally(() => setLoading(false))
  }, [activeLevel])

  const visible = search.trim()
    ? courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
    : courses

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Explore Our Programs</h1>
          <p className={styles.heroSub}>
            Undergraduate, postgraduate, and diploma programs from GHE Adelaide
          </p>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.filters}>
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setActiveLevel(value)}
              className={`${styles.pill}${activeLevel === value ? ` ${styles.pillActive}` : ''}`}
            >
              {label}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Search courses…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.search}
          aria-label="Search courses"
        />
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}

      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: 6 }, (_, i) => <div key={i} className={styles.skeleton} />)}
        </div>
      ) : visible.length === 0 ? (
        <div className={styles.empty}>
          <p>No programs found{search ? ` for "${search}"` : ''}.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {visible.map(course => (
            <div key={course.id} className={styles.card}>
              <span className={`${styles.levelBadge} ${styles[course.level]}`}>
                {LEVEL_LABEL[course.level]}
              </span>
              <h3 className={styles.cardTitle}>{course.title}</h3>
              <p className={styles.cardFaculty}>{course.faculty}</p>
              <p className={styles.cardDesc}>
                {course.description.length > 130
                  ? course.description.slice(0, 130) + '…'
                  : course.description}
              </p>
              <div className={styles.cardMeta}>
                <span>{course.duration_years} yr{course.duration_years !== 1 ? 's' : ''}</span>
                <span>·</span>
                <span>A${course.fee_per_year.toLocaleString()}/yr</span>
              </div>
              <Link to={`/courses/${course.id}`} className={styles.cardLink}>
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
