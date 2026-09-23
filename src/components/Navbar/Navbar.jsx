import { Link, NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={styles.navbar} aria-label="Main navigation">
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <img src="/logo.png" alt="Global Higher Education" className={styles.logoImg} />
        </Link>

        <ul className={styles.links}>
          <li><NavLink to="/courses" className={({ isActive }) => isActive ? styles.linkActive : styles.link}>Courses</NavLink></li>
          <li><NavLink to="/about" className={({ isActive }) => isActive ? styles.linkActive : styles.link}>About Us</NavLink></li>
          <li><NavLink to="/contact" className={({ isActive }) => isActive ? styles.linkActive : styles.link}>Contact</NavLink></li>
        </ul>

        <div className={styles.actions}>
          <Link to="/login?role=staff" className={styles.btnOutline}>Staff Login</Link>
          <Link to="/login?role=student" className={styles.btnPrimary}>Student Portal →</Link>
        </div>
      </div>
    </nav>
  )
}
