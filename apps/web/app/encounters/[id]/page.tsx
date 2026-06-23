import TrackerActions from './_components/TrackerActions'
import CombatantCard from './_components/CombatantCard'
import AddCombatantForm from './_components/AddCombatantForm'
import { API_URL } from '../../../lib/api'

async function getEncounter(id: string) {
    try {
        const res = await fetch(`${API_URL}/encounters/${id}`, { cache: 'no-store' })
        if (!res.ok) return null
        return res.json()
    } catch {
        return null
    }
}

export default async function EncounterPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const encounter = await getEncounter(id)

    if (!encounter) {
        return (
            <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontFamily: "'Lora', serif", color: 'var(--slm)', fontStyle: 'italic' }}>encontro não encontrado</p>
            </main>
        )
    }

    const ordenados = [...encounter.combatants].sort((a: { initiative: number }, b: { initiative: number }) => b.initiative - a.initiative)

    return (
        <main style={{ minHeight: '100vh', padding: '2rem', maxWidth: '720px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                    <a href="/encounters" style={{ fontFamily: "'Lora', serif", fontSize: '0.8rem', color: 'var(--sl)', textDecoration: 'none' }}>← encontros</a>
                    <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.25rem', fontWeight: 600, color: 'var(--ink)', marginTop: '0.25rem' }}>{encounter.name}</h1>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: "'Lora', serif", fontSize: '0.7rem', fontStyle: 'italic', color: 'var(--slm)' }}>rodada</div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: '2rem', fontWeight: 600, color: 'var(--cr)', lineHeight: 1 }}>{encounter.round || '—'}</div>
                </div>
            </div>

            <TrackerActions encounterId={encounter.id} status={encounter.status} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {ordenados.length === 0 ? (
                    <p style={{ fontFamily: "'Lora', serif", fontSize: '0.875rem', fontStyle: 'italic', color: 'var(--slm)' }}>nenhum combatente ainda</p>
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