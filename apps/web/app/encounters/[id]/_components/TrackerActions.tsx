'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_URL, authHeaders } from '../../../../lib/api'

export default function TrackerActions({ encounterId, status, userEmail }: { encounterId: string; status: string; userEmail: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function call(endpoint: string) {
        setLoading(true)
        await fetch(`${API_URL}/encounters/${encounterId}/${endpoint}`, { method: 'POST', headers: authHeaders(userEmail) })
        setLoading(false)
        router.refresh()
    }

    const btn = (label: string, action: string, primary = false) => (
        <button onClick={() => call(action)} disabled={loading} style={{ fontFamily: "'Cinzel', serif", fontSize: '0.875rem', fontWeight: primary ? 600 : 400, background: primary ? 'var(--cr)' : 'transparent', color: primary ? 'var(--ml)' : 'var(--sl)', border: primary ? 'none' : '1px solid var(--md)', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', opacity: loading ? 0.7 : 1, letterSpacing: primary ? '0.03em' : 0 }}>
            {loading ? '...' : label}
        </button>
    )

    if (status === 'ACTIVE') return (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
            {btn('Próximo Turno →', 'next-turn', true)}
            {btn('pausar', 'pause')}
            {btn('reiniciar rodadas', 'restart')}
        </div>
    )

    return (
        <div style={{ marginBottom: '2rem' }}>
            {btn('⚔ Iniciar Combate', 'start', true)}
        </div>
    )
}