import { API_URL } from '../../lib/api'
import NewEncounterButton from './_components/NewEncounterButton'
import DeleteEncounterButton from './_components/DeleteEncounterButton'

async function getEncounters() {
    try {
        const res = await fetch(`${API_URL}/encounters/list`, { cache: 'no-store' })
        if (!res.ok) return []
        return res.json()
    } catch { return [] }
}

const statusLabel: Record<string, { label: string; color: string }> = {
    ACTIVE: { label: 'ativo', color: '#50a050' },
    ENDED: { label: 'encerrado', color: 'var(--slm)' },
    PLANNED: { label: 'planejado', color: 'var(--sl)' },
}

export default async function EncountersPage() {
    const encounters = await getEncounters()

    return (
        <main style={{ minHeight: '100vh', padding: '3rem 2rem', maxWidth: '680px', margin: '0 auto' }}>

            <div style={{ marginBottom: '3rem' }}>
                <div style={{ fontFamily: "'Lora', serif", fontSize: '11px', fontStyle: 'italic', color: 'var(--slm)', letterSpacing: '0.08em', marginBottom: '6px' }}>mesa aberta</div>
                <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '2rem', fontWeight: 600, color: 'var(--ink)', margin: 0, lineHeight: 1.2 }}>Seus encontros</h1>
                <p style={{ fontFamily: "'Lora', serif", fontSize: '0.9rem', color: 'var(--slm)', marginTop: '8px', fontStyle: 'italic' }}>
                    {encounters.length === 0 ? 'Nenhum encontro criado ainda.' : `${encounters.length} encontro${encounters.length > 1 ? 's' : ''} encontrado${encounters.length > 1 ? 's' : ''}.`}
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2rem' }}>
                {encounters.map((e: { id: string; name: string; status: string; round: number }) => {
                    const s = statusLabel[e.status] ?? statusLabel.PLANNED
                    return (
                        <a key={e.id} href={`/encounters/${e.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--ml)', border: '1px solid var(--md)', borderRadius: '10px', padding: '1.125rem 1.5rem', textDecoration: 'none', gap: '1rem' }}>
                            <div>
                                <div style={{ fontFamily: "'Cinzel', serif", fontSize: '1rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>{e.name}</div>
                                <div style={{ fontFamily: "'Lora', serif", fontSize: '0.8rem', color: 'var(--slm)', fontStyle: 'italic' }}>
                                    {e.status === 'ACTIVE' ? `rodada ${e.round} em andamento` : s.label}
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: s.color }} />
                                    <span style={{ fontFamily: "'Lora', serif", fontSize: '11px', color: s.color }}>{s.label}</span>
                                </div>
                                <DeleteEncounterButton id={e.id} name={e.name} />
                            </div>
                        </a>
                    )
                })}
            </div>

            <NewEncounterButton />

            <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--md)', textAlign: 'center' }}>
                <a href="/" style={{ fontFamily: "'Lora', serif", fontSize: '12px', color: 'var(--slm)', textDecoration: 'none', fontStyle: 'italic' }}>← voltar ao início</a>
            </div>

        </main>
    )
}