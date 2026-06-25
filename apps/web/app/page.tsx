import { auth } from '../auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await auth()

  if (session) redirect('/encounters')

  const bubble = {
    background: 'var(--mb)',
    padding: '8px 20px',
    borderRadius: '999px',
    display: 'inline-block',
  }

  return (
    <main style={{ position: 'relative', zIndex: 1, minHeight: '100vh', padding: '4rem 2rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
      
      <span style={{
        ...bubble,
        fontFamily: "'Lora', serif",
        fontSize: '11px',
        fontStyle: 'italic',
        color: 'var(--sl)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}>
        ferramenta gratuita para mestres de RPG
      </span>

      <h1 style={{
        ...bubble,
        padding: '10px 32px',
        fontFamily: "'Cinzel', serif",
        fontSize: '2.5rem',
        fontWeight: 600,
        color: 'var(--ink)',
        margin: 0,
        letterSpacing: '0.02em',
      }}>
        Mesa Aberta
      </h1>

      <p style={{
        ...bubble,
        padding: '8px 24px',
        fontFamily: "'Lora', serif",
        fontSize: '0.95rem',
        color: 'var(--sl)',
        fontStyle: 'italic',
        margin: 0,
        maxWidth: '460px',
        textAlign: 'center',
      }}>
        Tracker de combate, bestiário e IA para a sua mesa
      </p>

      <a href="/api/auth/signin" style={{
        fontFamily: "'Cinzel', serif",
        fontSize: '0.9rem',
        fontWeight: 600,
        background: 'var(--cr)',
        color: 'var(--ml)',
        padding: '0.875rem 2rem',
        borderRadius: '8px',
        textDecoration: 'none',
        letterSpacing: '0.04em',
        display: 'inline-block',
        marginTop: '8px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      }}>
        Entrar com Google
      </a>

      <a href="https://github.com/gabriell-franca/mesa-aberta" target="_blank" rel="noreferrer" style={{
        ...bubble,
        fontFamily: "'Lora', serif",
        fontSize: '12px',
        color: 'var(--sl)',
        textDecoration: 'none',
        fontStyle: 'italic',
      }}>
        ver no GitHub →
      </a>

    </main>
  )
} 