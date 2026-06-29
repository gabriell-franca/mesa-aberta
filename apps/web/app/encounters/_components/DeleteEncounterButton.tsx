'use client'

import { useRouter } from 'next/navigation'
import { API_URL, authHeaders } from '../../../lib/api'

export default function DeleteEncounterButton({ id, name, userEmail }: { id: string; name: string; userEmail: string }) {
    const router = useRouter()

    async function deleteEncounter() {
        if (!confirm(`Deletar "${name}"? Essa ação não pode ser desfeita.`)) return
        await fetch(`${API_URL}/encounters/${id}`, { method: 'DELETE', headers: authHeaders(userEmail) })
        router.refresh()
    }

    return (
        <button onClick={deleteEncounter} style={{ fontFamily: "'Lora', serif", fontSize: '11px', padding: '3px 10px', borderRadius: '4px', background: 'transparent', color: 'var(--slm)', border: '1px solid var(--md)', cursor: 'pointer', flexShrink: 0 }}>
            deletar
        </button>
    )
}