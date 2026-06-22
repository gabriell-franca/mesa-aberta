export default function home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '2.5rem', fontWeight: 600, color: 'var(--ink)' }}>
          Mesa Aberta
        </h1>
        <p style={{ marginTop: '1rem', color: 'var(--sl)' }}>
          Ferramenta gratuita para mestres de RPG
        </p>
        <a href="/encounters" style={{ marginTop: '2rem', display: 'inline-block', background: 'var(--cr)', color: 'var(--ml)', padding: '0.75rem 1.5rem', borderRadius: '8px', textDecoration: 'none' }}>
          Abrir tracker
        </a>
      </div>
    </main>
  );
} 
