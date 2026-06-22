import NewEncounterButton from './_components/NewEncounterButton'

async function getEncounters() {
    try {
        const res = await fetch('http://localhost:3001/encounters/list', {
            cache: 'no-store'
        })
        if (!res.ok) return []
        return res.json()
    } catch {
        return []
    }
}

export default async function EncountersPage() {
    const encounters = await getEncounters()

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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                {encounters.length === 0 ? (
                    <p style={{ fontFamily: "'Lora', serif", fontSize: '0.875rem', fontStyle: 'italic', color: 'var(--slm)' }}>
                        nenhum encontro ainda
                    </p>
                ) : (
                    encounters.map((e: { id: string; name: string; status: string; round: number }) => (
                        <a key={e.id} href={`/encounters/${e.id}`} style={{ display: 'block', background: 'var(--ml)', border: '1px solid var(--md)', borderRadius: '8px', padding: '1rem 1.25rem', textDecoration: 'none' }}>
                            <div style={{ fontFamily: "'Cinzel', serif", fontSize: '1rem', fontWeight: 600, color: 'var(--ink)' }}>{e.name}</div>
                            <div style={{ fontFamily: "'Lora', serif", fontSize: '0.8rem', color: 'var(--slm)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                                {e.status === 'ACTIVE' ? `rodada ${e.round} — ativo` : e.status === 'ENDED' ? 'encerrado' : 'planejado'}
                            </div>
                        </a>
                    ))
                )}
            </div>

            <NewEncounterButton />
        </main>
    )
}