import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  function toggleTheme() {
    const root = document.documentElement
    const next = root.getAttribute('data-theme') !== 'light' ? 'light' : 'dark'
    root.setAttribute('data-theme', next)
  }

  return (
    <nav className={styles.navbar} aria-label="Main navigation">
      <Link to="/" className={styles.brand}>GHE Portal</Link>

      <ul className={styles.links}>
        <li><Link to="/courses">Courses</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/blog">Blog</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>

      <div className={styles.actions}>
        <button
          onClick={toggleTheme}
          className={styles.themeToggle}
          aria-label="Toggle theme"
        >
          ◐
        </button>
        <Link to="/login" className={styles.loginBtn}>Login</Link>
      </div>
    </nav>
  )
}
