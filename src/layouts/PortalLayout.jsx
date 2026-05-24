import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import styles from './PortalLayout.module.css'

export default function PortalLayout({ navItems, roleLabel }) {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()
  const location         = useLocation()

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  const currentLabel = navItems.find(
    ({ to }) => location.pathname === to || location.pathname.startsWith(to + '/')
  )?.label ?? ''

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className={styles.shell}>
      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <Link to="/" className={styles.brand}>
          <img src="/logo.png" alt="GHE" className={styles.brandLogo} />
          <span className={styles.brandText}>GHE Portal</span>
        </Link>

        <nav className={styles.nav}>
          {navItems.map(({ to, label, icon: Icon }) => {
            const active =
              location.pathname === to ||
              location.pathname.startsWith(to + '/')
            return (
              <Link
                key={to}
                to={to}
                className={`${styles.navItem}${active ? ` ${styles.navItemActive}` : ''}`}
              >
                <Icon size={17} />
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>{initials}</div>
            <div>
              <p className={styles.userName}>{user?.name}</p>
              <p className={styles.roleTag}>{roleLabel}</p>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={15} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className={styles.body}>
        <header className={styles.topbar}>
          <span className={styles.pageTitle}>{currentLabel}</span>
          <div className={styles.avatarSm}>{initials}</div>
        </header>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
