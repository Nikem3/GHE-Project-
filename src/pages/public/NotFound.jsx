import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ padding: '96px 24px', textAlign: 'center' }}>
      <p style={{ fontSize: 64, fontWeight: 900, color: 'var(--orange)', margin: 0, lineHeight: 1 }}>404</p>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: '12px 0 10px' }}>
        Page not found
      </h1>
      <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: '0 0 28px' }}>
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          padding: '12px 24px',
          background: 'var(--orange)',
          color: '#fff',
          borderRadius: 'var(--radius)',
          fontSize: 14,
          fontWeight: 700,
          textDecoration: 'none',
        }}
      >
        Back to home
      </Link>
    </div>
  )
}
