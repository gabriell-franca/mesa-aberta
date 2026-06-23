'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewEncounterButton() {
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [showForm, setShowForm] = useState(false)
    const router = useRouter()

    async function createEncounter() {
        if (!name.trim()) return
        setLoading(true)

        await fetch('http://localhost:3001/encounters', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        })

        setLoading(false)
        setName('')
        setShowForm(false)
        router.refresh()
    }

    if (!showForm) {
        return (
            <button
                onClick={() => setShowForm(true)}
                style={{ fontFamily: "'Lora', serif", background: 'var(--cr)', color: 'var(--ml)', border: 'none', padding: '0.625rem 1.25rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem' }}
            >
                + novo encontro
            </button>
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input
                type="text"
                placeholder="Nome do encontro..."
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createEncounter()}
                style={{ fontFamily: "'Lora', serif", background: 'transparent', border: '1px solid var(--md)', borderRadius: '6px', padding: '0.625rem 0.875rem', color: 'var(--ink)', fontSize: '0.875rem', outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                    onClick={createEncounter}
                    disabled={loading}
                    style={{ fontFamily: "'Lora', serif", background: 'var(--cr)', color: 'var(--ml)', border: 'none', padding: '0.625rem 1.25rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? 'criando...' : 'criar'}
                </button>
                <button
                    onClick={() => setShowForm(false)}
                    style={{ fontFamily: "'Lora', serif", background: 'transparent', color: 'var(--sl)', border: '1px solid var(--md)', padding: '0.625rem 1.25rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem' }}
                >
                    cancelar
                </button>
            </div>
        </div>
    )
}