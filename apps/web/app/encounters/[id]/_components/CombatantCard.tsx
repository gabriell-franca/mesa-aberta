'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_URL } from '../../../../lib/api'

type Combatant = {
    id: string
    encounterId: string
    name: string
    initiative: number
    hpCurrent: number
    hpMax: number
    ac: number
    exhaustionLevel: number
    conditions: string[]
    isPlayer: boolean
}

export default function CombatantCard({ c, isActive }: { c: Combatant, isActive: boolean }) {
    const [action, setAction] = useState<'dano' | 'cura' | null>(null)
    const [valor, setValor] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const hpPercent = Math.max(0, Math.round((c.hpCurrent / c.hpMax) * 100))

    async function applyHp() {
        const num = parseInt(valor)
        if (isNaN(num) || num <= 0 || !action) return
        setLoading(true)
        await fetch(`${API_URL}/encounters/${c.encounterId}/combatants/${c.id}/hp`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ valor: num, tipo: action }),
        })
        setLoading(false)
        setValor('')
        setAction(null)
        router.refresh()
    }

    return (
        <div style={{ background: isActive ? 'var(--ml)' : 'var(--mb)', border: '1px solid var(--md)', borderLeft: isActive ? '3px solid var(--cr)' : '1px solid var(--md)', borderRadius: isActive ? '0 8px 8px 0' : '8px', padding: '12px 16px', opacity: c.hpCurrent === 0 ? 0.5 : 1 }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontFamily: "'Cinzel', serif", fontSize: '12px', color: 'var(--sl)' }}>{c.hpCurrent} / {c.hpMax} HP</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button onClick={() => { setAction('dano'); setValor('') }} style={{ fontFamily: "'Lora', serif", fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: action === 'dano' ? 'var(--cr)' : 'var(--md)', color: action === 'dano' ? 'var(--ml)' : 'var(--ink)', border: 'none', cursor: 'pointer' }}>− dano</button>
                            <button onClick={() => { setAction('cura'); setValor('') }} style={{ fontFamily: "'Lora', serif", fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: action === 'cura' ? 'var(--sl)' : 'var(--md)', color: action === 'cura' ? 'var(--ml)' : 'var(--ink)', border: 'none', cursor: 'pointer' }}>+ cura</button>
                        </div>
                    </div>
                    {action && (
                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                            <input autoFocus type="number" placeholder="quantidade" value={valor} onChange={e => setValor(e.target.value)} onKeyDown={e => e.key === 'Enter' && applyHp()} style={{ flex: 1, fontFamily: "'Lora', serif", fontSize: '12px', background: 'transparent', border: '1px solid var(--md)', borderRadius: '4px', padding: '4px 8px', color: 'var(--ink)', outline: 'none' }} />
                            <button onClick={applyHp} disabled={loading} style={{ fontFamily: "'Lora', serif", fontSize: '12px', padding: '4px 10px', borderRadius: '4px', background: 'var(--cr)', color: 'var(--ml)', border: 'none', cursor: 'pointer' }}>{loading ? '...' : 'ok'}</button>
                            <button onClick={() => setAction(null)} style={{ fontFamily: "'Lora', serif", fontSize: '12px', padding: '4px 8px', borderRadius: '4px', background: 'transparent', color: 'var(--sl)', border: '1px solid var(--md)', cursor: 'pointer' }}>×</button>
                        </div>
                    )}
                    {c.exhaustionLevel > 0 && <div style={{ fontFamily: "'Lora', serif", fontSize: '11px', fontStyle: 'italic', color: 'var(--slm)', marginTop: '4px' }}>exaustão {c.exhaustionLevel}</div>}
                    {c.conditions.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
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
}