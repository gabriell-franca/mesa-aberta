'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_URL } from '../../../../lib/api'

const CONDITIONS_5E = [
    'amedrontado', 'atordoado', 'caído', 'cego', 'encantado',
    'envenenado', 'incapacitado', 'invisível', 'paralisado',
    'petrificado', 'preso', 'surdo', 'inconsciente',
]

type Combatant = {
    id: string; encounterId: string; name: string; initiative: number
    hpCurrent: number; hpMax: number; ac: number; exhaustionLevel: number
    conditions: string[]; isPlayer: boolean
    notes?: string | null
}

export default function CombatantCard({ c, isActive }: { c: Combatant; isActive: boolean }) {
    const [action, setAction] = useState<'dano' | 'cura' | null>(null)
    const [valor, setValor] = useState('')
    const [loading, setLoading] = useState(false)
    const [showConditions, setShowConditions] = useState(false)
    const [showResourceInput, setShowResourceInput] = useState(false)
    const [currentResource, setCurrentResource] = useState('')
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [resources, setResources] = useState<string[]>(() => {
        try { return c.notes ? JSON.parse(c.notes) : [] }
        catch { return [] }
    })
    const router = useRouter()

    const hpPercent = Math.max(0, Math.round((c.hpCurrent / c.hpMax) * 100))
    const isDead = c.hpCurrent === 0
    const hpColor = hpPercent > 50 ? 'var(--cr)' : hpPercent > 25 ? '#c07020' : '#8b1010'

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

    async function removeCombatant() {
        if (!confirm(`Remover ${c.name} do encontro?`)) return
        await fetch(`${API_URL}/encounters/${c.encounterId}/combatants/${c.id}`, {
            method: 'DELETE',
        })
        router.refresh()
    }

    // Função que salva no banco
    async function saveResources(updated: string[]) {
        await fetch(`${API_URL}/encounters/${c.encounterId}/combatants/${c.id}/notes`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notes: JSON.stringify(updated) }),
        })
    }

    async function toggleCondition(cond: string) {
        const updated = c.conditions.includes(cond)
            ? c.conditions.filter(x => x !== cond)
            : [...c.conditions, cond]
        await fetch(`${API_URL}/encounters/${c.encounterId}/combatants/${c.id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conditions: updated }),
        })
        router.refresh()
    }

    function confirmResource() {
        if (!currentResource.trim()) return
        let updated: string[]
        if (editingIndex !== null) {
            updated = resources.map((x, i) => i === editingIndex ? currentResource.trim() : x)
            setEditingIndex(null)
        } else {
            updated = [...resources, currentResource.trim()]
        }
        setResources(updated)
        saveResources(updated)
        setCurrentResource('')
        setShowResourceInput(false)
    }

    function editResource(index: number) {
        setCurrentResource(resources[index])
        setEditingIndex(index)
        setShowResourceInput(true)
    }

    function removeResource(index: number) {
        const updated = resources.filter((_, i) => i !== index)
        setResources(updated)
        saveResources(updated)
    }

    const actionBtn = (label: string, onClick: () => void, active = false, danger = false) => (
        <button onClick={onClick} style={{
            fontFamily: "'Lora', serif", fontSize: '12px', padding: '5px 14px',
            borderRadius: '6px', border: 'none', cursor: 'pointer',
            background: active ? (danger ? 'var(--cr)' : 'var(--sl)') : 'var(--md)',
            color: active ? 'var(--ml)' : 'var(--sl)',
        }}>{label}</button>
    )

    return (
        <div style={{
            background: isActive ? 'var(--ml)' : 'var(--mb)',
            border: '1px solid var(--md)',
            borderLeft: isActive ? '3px solid var(--cr)' : '1px solid var(--md)',
            borderRadius: isActive ? '0 10px 10px 0' : '10px',
            padding: '16px 20px',
            opacity: isDead ? 0.45 : 1,
        }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>

                <div style={{ textAlign: 'center', minWidth: '38px', flexShrink: 0, paddingTop: '2px' }}>
                    <div style={{ fontFamily: "'Lora', serif", fontSize: '10px', color: 'var(--slm)' }}>init</div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: '26px', fontWeight: 600, color: isActive ? 'var(--cr)' : 'var(--sl)', lineHeight: 1.1 }}>{c.initiative}</div>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>

                    {/* Cabeçalho */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                        <span style={{ fontFamily: "'Cinzel', serif", fontSize: '15px', fontWeight: 600, color: isDead ? 'var(--slm)' : 'var(--ink)' }}>
                            {c.name}
                            {isDead && <span style={{ fontFamily: "'Lora', serif", fontSize: '11px', fontWeight: 400, color: 'var(--cr)', marginLeft: '8px', fontStyle: 'italic' }}>morto</span>}
                        </span>
                        <span style={{ fontFamily: "'Lora', serif", fontSize: '11px', padding: '2px 10px', borderRadius: '20px', background: 'var(--md)', color: 'var(--sl)' }}>
                            {c.isPlayer ? 'jogador' : 'monstro'}
                        </span>
                        <span style={{ marginLeft: 'auto', fontFamily: "'Lora', serif", fontSize: '12px', color: 'var(--sl)' }}>CA {c.ac}</span>
                        <button onClick={removeCombatant} title="remover do encontro" style={{ fontFamily: "'Lora', serif", fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'transparent', color: 'var(--slm)', border: '1px solid var(--md)', cursor: 'pointer' }}>remover</button>
                    </div>

                    {/* HP */}
                    <div style={{ marginBottom: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '7px' }}>
                            <span style={{ fontFamily: "'Cinzel', serif", fontSize: '13px', color: 'var(--sl)' }}>{c.hpCurrent} / {c.hpMax} HP</span>
                            {c.exhaustionLevel > 0 && (
                                <span style={{ fontFamily: "'Lora', serif", fontSize: '11px', color: 'var(--slm)', fontStyle: 'italic' }}>exaustão {c.exhaustionLevel}</span>
                            )}
                        </div>
                        <div style={{ background: 'var(--md)', borderRadius: '4px', height: '8px' }}>
                            <div style={{ background: hpColor, borderRadius: '4px', height: '8px', width: `${hpPercent}%`, transition: 'width 0.3s' }} />
                        </div>
                    </div>

                    {/* Botões de ação */}
                    {!isDead && (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: action || showConditions || showResourceInput ? '12px' : '8px' }}>
                            {actionBtn('− dano', () => { setAction(action === 'dano' ? null : 'dano'); setValor('') }, action === 'dano', true)}
                            {actionBtn('+ cura', () => { setAction(action === 'cura' ? null : 'cura'); setValor('') }, action === 'cura')}
                            {actionBtn('condições', () => setShowConditions(!showConditions), showConditions)}
                            {actionBtn('+ recurso', () => { setShowResourceInput(!showResourceInput); setCurrentResource(''); setEditingIndex(null) }, showResourceInput)}
                        </div>
                    )}

                    {/* Input de dano/cura */}
                    {action && (
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                            <input autoFocus type="number" placeholder={action === 'dano' ? 'dano recebido' : 'HP recuperado'} value={valor}
                                onChange={e => setValor(e.target.value)} onKeyDown={e => e.key === 'Enter' && applyHp()}
                                style={{ flex: 1, fontFamily: "'Lora', serif", fontSize: '13px', background: 'transparent', border: '1px solid var(--md)', borderRadius: '6px', padding: '6px 10px', color: 'var(--ink)', outline: 'none' }} />
                            <button onClick={applyHp} disabled={loading} style={{ fontFamily: "'Lora', serif", fontSize: '13px', padding: '6px 16px', borderRadius: '6px', background: 'var(--cr)', color: 'var(--ml)', border: 'none', cursor: 'pointer' }}>{loading ? '...' : 'ok'}</button>
                            <button onClick={() => setAction(null)} style={{ fontFamily: "'Lora', serif", fontSize: '13px', padding: '6px 10px', borderRadius: '6px', background: 'transparent', color: 'var(--sl)', border: '1px solid var(--md)', cursor: 'pointer' }}>×</button>
                        </div>
                    )}

                    {/* Picker de condições */}
                    {showConditions && (
                        <div style={{ background: 'var(--mb)', border: '1px solid var(--md)', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                            <div style={{ fontFamily: "'Lora', serif", fontSize: '10px', fontStyle: 'italic', color: 'var(--slm)', marginBottom: '8px' }}>clique para marcar — confirme para fechar</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                                {CONDITIONS_5E.map(cond => {
                                    const active = c.conditions.includes(cond)
                                    return (
                                        <button key={cond} onClick={() => toggleCondition(cond)} style={{ fontFamily: "'Lora', serif", fontSize: '11px', padding: '4px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', background: active ? 'var(--crd)' : 'var(--md)', color: active ? 'var(--ml)' : 'var(--sl)' }}>
                                            {cond}
                                        </button>
                                    )
                                })}
                            </div>
                            <button onClick={() => setShowConditions(false)} style={{ fontFamily: "'Lora', serif", fontSize: '12px', padding: '5px 16px', borderRadius: '6px', background: 'var(--sl)', color: 'var(--ml)', border: 'none', cursor: 'pointer' }}>
                                confirmar
                            </button>
                        </div>
                    )}

                    {/* Input de recurso */}
                    {showResourceInput && (
                        <div style={{ background: 'var(--mb)', border: '1px solid var(--md)', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                            <div style={{ fontFamily: "'Lora', serif", fontSize: '10px', fontStyle: 'italic', color: 'var(--slm)', marginBottom: '6px' }}>
                                {editingIndex !== null ? 'editando recurso' : 'novo recurso ou anotação'}
                            </div>
                            <textarea autoFocus value={currentResource} onChange={e => setCurrentResource(e.target.value)}
                                placeholder="Ex: Surto de ação usado  |  Espaço nv1: ●●○○"
                                rows={2}
                                style={{ width: '100%', background: 'transparent', border: '1px solid var(--md)', borderRadius: '6px', color: 'var(--ink)', fontFamily: "'Lora', serif", fontSize: '12px', fontStyle: 'italic', resize: 'none', outline: 'none', padding: '6px 8px', boxSizing: 'border-box', marginBottom: '8px' }}
                            />
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <button onClick={confirmResource} style={{ fontFamily: "'Lora', serif", fontSize: '12px', padding: '5px 16px', borderRadius: '6px', background: 'var(--sl)', color: 'var(--ml)', border: 'none', cursor: 'pointer' }}>
                                    {editingIndex !== null ? 'salvar' : 'concluir'}
                                </button>
                                <button onClick={() => { setShowResourceInput(false); setCurrentResource(''); setEditingIndex(null) }} style={{ fontFamily: "'Lora', serif", fontSize: '12px', padding: '5px 12px', borderRadius: '6px', background: 'transparent', color: 'var(--sl)', border: '1px solid var(--md)', cursor: 'pointer' }}>
                                    cancelar
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Recursos salvos */}
                    {resources.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '8px' }}>
                            {resources.map((r, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', background: 'var(--mb)', border: '1px solid var(--md)', borderRadius: '6px', padding: '6px 10px' }}>
                                    <span style={{ fontFamily: "'Lora', serif", fontSize: '12px', fontStyle: 'italic', color: 'var(--sl)', flex: 1 }}>{r}</span>
                                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                                        <button onClick={() => editResource(i)} style={{ fontFamily: "'Lora', serif", fontSize: '10px', padding: '2px 6px', borderRadius: '4px', border: 'none', background: 'transparent', color: 'var(--slm)', cursor: 'pointer' }}>editar</button>
                                        <button onClick={() => removeResource(i)} style={{ fontFamily: "'Lora', serif", fontSize: '10px', padding: '2px 6px', borderRadius: '4px', border: 'none', background: 'transparent', color: 'var(--slm)', cursor: 'pointer' }}>×</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Condições ativas como tags removíveis */}
                    {c.conditions.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', paddingTop: '10px', borderTop: '1px solid var(--md)' }}>
                            {c.conditions.map(cond => (
                                <button key={cond} onClick={() => toggleCondition(cond)} title="clique para remover"
                                    style={{ fontFamily: "'Lora', serif", fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: 'var(--md)', color: 'var(--crd)', border: 'none', cursor: 'pointer' }}>
                                    {cond} ×
                                </button>
                            ))}
                        </div>
                    )}

                    {isActive && (
                        <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--md)' }}>
                            <span style={{ fontFamily: "'Lora', serif", fontSize: '11px', color: 'var(--cr)', fontStyle: 'italic' }}>— agindo agora</span>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}