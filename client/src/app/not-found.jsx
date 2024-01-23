import Link from 'next/link';

const containerStyle = {
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: "center",
  alignItems: 'center',
  gap: '1.5rem'
};

const homeBtnStyle = {
  marginTop: '10px',
  padding: '0.6rem 2rem',
  fontSize: '14px',
  fontWeight: '600',
  border: '1px solid var(--darkBlue)',
  color: 'white',
  background: 'var(--darkBlue)',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: '.2s ease-in',
};

export default function NotFound() {
  return (
    <div style={containerStyle}>
      <h2>Oops, Page Not Found</h2>
      <p>It seems like the page you're looking for doesn't exist or has been moved.</p>
      <Link href="/" style={homeBtnStyle}>Return Home</Link>
    </div>
  )
}