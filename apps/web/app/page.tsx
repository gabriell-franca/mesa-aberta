import { auth } from '../auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await auth()

  if (session) redirect('/encounters')

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px', padding: '2rem' }}>
        <div style={{ fontFamily: "'Lora', serif", fontSize: '11px', fontStyle: 'italic', color: 'var(--slm)', letterSpacing: '0.08em', marginBottom: '12px' }}>
          ferramenta gratuita para mestres de RPG
        </div>
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '2.5rem', fontWeight: 600, color: 'var(--ink)', margin: '0 0 8px' }}>
          Mesa Aberta
        </h1>
        <p style={{ fontFamily: "'Lora', serif", fontSize: '1rem', color: 'var(--slm)', fontStyle: 'italic', marginBottom: '2.5rem', lineHeight: 1.6 }}>
          Tracker de combate, bestiário e IA para a sua mesa — gratuito e open-source.
        </p>
        <a href="/api/auth/signin" style={{ fontFamily: "'Cinzel', serif", fontSize: '0.9rem', fontWeight: 600, background: 'var(--cr)', color: 'var(--ml)', padding: '0.875rem 2rem', borderRadius: '8px', textDecoration: 'none', letterSpacing: '0.04em', display: 'inline-block' }}>
          Entrar com Google
        </a>
        <div style={{ marginTop: '1.5rem' }}>
          <a href="https://github.com/gabriell-franca/mesa-aberta" target="_blank" rel="noreferrer" style={{ fontFamily: "'Lora', serif", fontSize: '12px', color: 'var(--slm)', textDecoration: 'none', fontStyle: 'italic' }}>
            ver no GitHub →
          </a>
        </div>
      </div>
    </main>
  )
}