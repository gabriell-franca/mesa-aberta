'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
    encounterId: string
    status: string
}

export default function TrackerActions({ encounterId, status }: Props) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function callEndpoint(endpoint: string) {
        setLoading(true)
        await fetch(`http://localhost:3001/encounters/${encounterId}/${endpoint}`, {
            method: 'POST',
        })
        setLoading(false)
        router.refresh()
    }

    if (status === 'ENDED') {
        return (
            <p style={{ fontFamily: "'Lora', serif", fontSize: '0.875rem', fontStyle: 'italic', color: 'var(--slm)', marginBottom: '1.5rem' }}>
                combate encerrado
            </p>
        )
    }

    return (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {status === 'PLANNED' && (
                <button onClick={() => callEndpoint('start')} disabled={loading} style={{ fontFamily: "'Lora', serif", background: 'var(--cr)', color: 'var(--ml)', border: 'none', padding: '0.625rem 1.25rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'iniciando...' : '⚔ iniciar combate'}
                </button>
            )}
            {status === 'ACTIVE' && (
                <>
                    <button onClick={() => callEndpoint('next-turn')} disabled={loading} style={{ fontFamily: "'Lora', serif", background: 'var(--cr)', color: 'var(--ml)', border: 'none', padding: '0.625rem 1.25rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', opacity: loading ? 0.7 : 1 }}>
                        {loading ? '...' : 'próximo turno →'}
                    </button>
                    <button onClick={() => callEndpoint('end')} disabled={loading} style={{ fontFamily: "'Lora', serif", background: 'transparent', color: 'var(--sl)', border: '1px solid var(--md)', padding: '0.625rem 1.25rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem' }}>
                        encerrar
                    </button>
                </>
            )}
        </div>
    )
}