import { API_URL } from '../../../lib/api'
import TrackerActions from './_components/TrackerActions'
import CombatantCard from './_components/CombatantCard'
import AddCombatantForm from './_components/AddCombatantForm'

async function getEncounter(id: string) {
    try {
        const res = await fetch(`${API_URL}/encounters/${id}`, { cache: 'no-store' })
        if (!res.ok) return null
        return res.json()
    } catch { return null }
}

const statusBadge: Record<string, { label: string; color: string }> = {
    PLANNED: { label: 'planejado', color: 'var(--sl)' },
    ACTIVE: { label: 'em combate', color: '#50a050' },
    ENDED: { label: 'encerrado', color: 'var(--slm)' },
}

export default async function EncounterPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const encounter = await getEncounter(id)

    if (!encounter) {
        return (
            <main style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontFamily: "'Lora', serif", color: 'var(--slm)', fontStyle: 'italic' }}>encontro não encontrado</p>
            </main>
        )
    }

    const ordenados = [...encounter.combatants].sort((a: { initiative: number }, b: { initiative: number }) => b.initiative - a.initiative)
    const badge = statusBadge[encounter.status] ?? statusBadge.PLANNED

    return (
        <main style={{ position: 'relative', zIndex: 1, minHeight: '100vh', padding: '2.5rem 2rem', maxWidth: '680px', margin: '0 auto' }}>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem' }}>
                <div>
                    <a href="/encounters" style={{ fontFamily: "'Lora', serif", fontSize: '12px', color: 'var(--slm)', textDecoration: 'none', fontStyle: 'italic' }}>← encontros</a>
                    <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.5rem', fontWeight: 600, color: 'var(--ink)', margin: '6px 0 8px' }}>{encounter.name}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: badge.color, flexShrink: 0 }} />
                        <span style={{ fontFamily: "'Lora', serif", fontSize: '12px', color: badge.color, fontStyle: 'italic' }}>{badge.label}</span>
                    </div>
                </div>
                {encounter.round > 0 && (
                    <div style={{ textAlign: 'center', background: 'var(--ml)', border: '1px solid var(--md)', borderRadius: '10px', padding: '12px 20px', flexShrink: 0 }}>
                        <div style={{ fontFamily: "'Lora', serif", fontSize: '10px', fontStyle: 'italic', color: 'var(--slm)', marginBottom: '2px' }}>rodada</div>
                        <div style={{ fontFamily: "'Cinzel', serif", fontSize: '2.25rem', fontWeight: 600, color: 'var(--cr)', lineHeight: 1 }}>{encounter.round}</div>
                    </div>
                )}
            </div>

            <TrackerActions encounterId={encounter.id} status={encounter.status} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1rem' }}>
                {ordenados.length === 0 ? (
                    <div style={{ background: 'var(--ml)', border: '1px dashed var(--md)', borderRadius: '10px', padding: '2rem', textAlign: 'center' }}>
                        <p style={{ fontFamily: "'Lora', serif", fontSize: '0.875rem', fontStyle: 'italic', color: 'var(--slm)', margin: 0 }}>
                            Nenhum combatente ainda — adicione abaixo para começar.
                        </p>
                    </div>
                ) : (
                    ordenados.map((c: { id: string; encounterId: string; name: string; initiative: number; hpCurrent: number; hpMax: number; ac: number; exhaustionLevel: number; conditions: string[]; isPlayer: boolean }) => (
                        <CombatantCard key={c.id} c={c} isActive={c.id === encounter.activeCombatantId} />
                    ))
                )}
            </div>

            <AddCombatantForm encounterId={encounter.id} />

        </main>
    )
}