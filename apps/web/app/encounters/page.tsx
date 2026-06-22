export default function EncountersPage() {
    return (
        <main style={{ minHeight: '100vh', padding: '2rem', maxWidth: '720px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.5rem', fontWeight: 600, color: 'var(--ink)' }}>
                    ⚔ Mesa Aberta
                </h1>
                <a href="/" style={{ fontFamily: "'Lora', serif", fontSize: '0.875rem', color: 'var(--sl)', textDecoration: 'none' }}>
                    ← início
                </a>
            </div>

            <div style={{ background: 'var(--ml)', border: '1px solid var(--md)', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem' }}>
                <p style={{ fontFamily: "'Lora', serif", fontSize: '0.875rem', fontStyle: 'italic', color: 'var(--slm)', marginBottom: '1rem' }}>
                    nenhum encontro ativo
                </p>
                <button style={{ fontFamily: "'Lora', serif", background: 'var(--cr)', color: 'var(--ml)', border: 'none', padding: '0.625rem 1.25rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem' }}>
                    + novo encontro
                </button>
            </div>
        </main>
    )
}