export default function ComingSoon({ title, note }) {
  return (
    <div style={{ padding: '72px 24px', textAlign: 'center' }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px' }}>
        {title}
      </h1>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>{note}</p>
    </div>
  )
}
