'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_URL, authHeaders } from '../../../../lib/api'

export default function AddCombatantForm({ encounterId, userEmail }: { encounterId: string; userEmail: string }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({ name: '', initiative: '', hpMax: '', ac: '', isPlayer: false })
    const router = useRouter()

    async function submit() {
        if (!form.name || !form.initiative || !form.hpMax || !form.ac) return
        setLoading(true)
        await fetch(`${API_URL}/encounters/${encounterId}/combatants`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders(userEmail) },
            body: JSON.stringify({
                name: form.name,
                initiative: Number(form.initiative),
                hpMax: Number(form.hpMax),
                ac: Number(form.ac),
                isPlayer: form.isPlayer,
            }),
        })
        setLoading(false)
        setForm({ name: '', initiative: '', hpMax: '', ac: '', isPlayer: false })
        setOpen(false)
        router.refresh()
    }

    const input = (placeholder: string, field: keyof typeof form, type = 'text') => (
        <input
            type={type}
            placeholder={placeholder}
            value={form[field] as string}
            onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
            style={{ fontFamily: "'Lora', serif", fontSize: '13px', background: 'transparent', border: '1px solid var(--md)', borderRadius: '6px', padding: '6px 10px', color: 'var(--ink)', outline: 'none', width: '100%' }}
        />
    )

    if (!open) return (
        <button onClick={() => setOpen(true)} style={{ fontFamily: "'Lora', serif", fontSize: '13px', background: 'transparent', color: 'var(--sl)', border: '1px solid var(--md)', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', width: '100%', marginTop: '0.75rem' }}>
            + adicionar combatente
        </button>
    )

    return (
        <div style={{ background: 'var(--ml)', border: '1px solid var(--md)', borderRadius: '8px', padding: '1rem', marginTop: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div style={{ gridColumn: '1 / -1' }}>{input('Nome', 'name')}</div>
                {input('Iniciativa', 'initiative', 'number')}
                {input('HP máximo', 'hpMax', 'number')}
                {input('CA', 'ac', 'number')}
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Lora', serif", fontSize: '13px', color: 'var(--sl)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.isPlayer} onChange={e => setForm(f => ({ ...f, isPlayer: e.target.checked }))} />
                    jogador
                </label>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={submit} disabled={loading} style={{ fontFamily: "'Lora', serif", fontSize: '13px', background: 'var(--cr)', color: 'var(--ml)', border: 'none', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                    {loading ? '...' : 'adicionar'}
                </button>
                <button onClick={() => setOpen(false)} style={{ fontFamily: "'Lora', serif", fontSize: '13px', background: 'transparent', color: 'var(--sl)', border: '1px solid var(--md)', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>
                    cancelar
                </button>
            </div>
        </div>
    )
}