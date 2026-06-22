async function getEncounter(id: string) {
    try {
        const res = await fetch(`http://localhost:3001/encounters/${id}`, {
            cache: 'no-store'
        })
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {ordenados.length === 0 ? (
                    <p style={{ fontFamily: "'Lora', serif", fontSize: '0.875rem', fontStyle: 'italic', color: 'var(--slm)' }}>nenhum combatente ainda</p>
                ) : (
                    ordenados.map((c: { id: string; name: string; initiative: number; hpCurrent: number; hpMax: number; ac: number; exhaustionLevel: number; conditions: string[]; isPlayer: boolean }) => {
                        const isActive = c.id === encounter.activeCombatantId
                        const hpPercent = Math.max(0, Math.round((c.hpCurrent / c.hpMax) * 100))

                        return (
                            <div key={c.id} style={{ background: isActive ? 'var(--ml)' : 'var(--mb)', border: '1px solid var(--md)', borderLeft: isActive ? '3px solid var(--cr)' : '1px solid var(--md)', borderRadius: isActive ? '0 8px 8px 0' : '8px', padding: '12px 16px', opacity: c.hpCurrent === 0 ? 0.5 : 1 }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <div style={{ textAlign: 'center', minWidth: '32px', flexShrink: 0 }}>
                                        <div style={{ fontFamily: "'Lora', serif", fontSize: '10px', color: 'var(--slm)' }}>init</div>
                                        <div style={{ fontFamily: "'Cinzel', serif", fontSize: '22px', fontWeight: 600, color: isActive ? 'var(--cr)' : 'var(--sl)', lineHeight: 1.1 }}>{c.initiative}</div>
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                                            <span style={{ fontFamily: "'Cinzel', serif", fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{c.name}</span>
                                            <span style={{ fontFamily: "'Lora', serif", fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'var(--md)', color: 'var(--ink)' }}>{c.isPlayer ? 'jogador' : 'monstro'}</span>
                                            <span style={{ marginLeft: 'auto', fontFamily: "'Lora', serif", fontSize: '11px', color: 'var(--sl)' }}>CA {c.ac}</span>
                                        </div>
                                        <div style={{ background: 'var(--md)', borderRadius: '3px', height: '7px', width: '100%', margin: '5px 0' }}>
                                            <div style={{ background: 'var(--cr)', borderRadius: '3px', height: '7px', width: `${hpPercent}%` }} />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: c.conditions.length > 0 ? '6px' : '0' }}>
                                            <span style={{ fontFamily: "'Cinzel', serif", fontSize: '12px', color: 'var(--sl)' }}>{c.hpCurrent} / {c.hpMax} HP</span>
                                            {c.exhaustionLevel > 0 && <span style={{ fontFamily: "'Lora', serif", fontSize: '11px', fontStyle: 'italic', color: 'var(--slm)' }}>exaustão {c.exhaustionLevel}</span>}
                                        </div>
                                        {c.conditions.length > 0 && (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                {c.conditions.map((cond: string) => (
                                                    <span key={cond} style={{ fontFamily: "'Lora', serif", fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'var(--md)', color: 'var(--crd)' }}>{cond}</span>
                                                ))}
                                            </div>
                                        )}
                                        {isActive && <div style={{ fontFamily: "'Lora', serif", fontSize: '11px', color: 'var(--cr)', marginTop: '6px', fontStyle: 'italic' }}>— agindo agora</div>}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

        </main>
    )
}