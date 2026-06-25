'use client'

import { useEffect, useState } from 'react'

export default function HomeContent() {
    const [show, setShow] = useState(false)

    useEffect(() => {
        const seen = sessionStorage.getItem('splash-seen')
        if (seen === 'true') {
            setShow(true)
            return
        }
        // se ainda não viu o splash, espera 3 segundos
        const timer = setTimeout(() => setShow(true), 2000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div style={{
            opacity: show ? 1 : 0,
            transition: 'opacity 2.0s ease',
            pointerEvents: show ? 'auto' : 'none',
            maxWidth: '460px',
            width: '100%',
            background: 'var(--mb)',
            borderRadius: '14px',
            padding: '2.5rem 2rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            textAlign: 'center',
        }}>
            <div style={{
                fontFamily: "'Lora', serif", fontSize: '11px', fontStyle: 'italic',
                color: 'var(--sl)', letterSpacing: '0.1em', textTransform: 'uppercase',
                marginBottom: '12px',
            }}>
                ferramenta gratuita para mestres de RPG
            </div>
            <h1 style={{
                fontFamily: "'Cinzel', serif", fontSize: '2.25rem', fontWeight: 600,
                color: 'var(--ink)', margin: '0 0 10px', letterSpacing: '0.02em',
            }}>
                Mesa Aberta
            </h1>
            <p style={{
                fontFamily: "'Lora', serif", fontSize: '0.9rem', color: 'var(--sl)',
                fontStyle: 'italic', margin: '0 0 1.75rem', lineHeight: 1.6,
            }}>
                Tracker de combate, bestiário e IA para a sua mesa
            </p>
            <a href="/api/auth/signin" style={{
                fontFamily: "'Cinzel', serif", fontSize: '0.9rem', fontWeight: 600,
                background: 'var(--cr)', color: 'var(--ml)',
                padding: '0.875rem 2rem', borderRadius: '8px',
                textDecoration: 'none', letterSpacing: '0.04em', display: 'inline-block',
            }}>
                Entrar com Google
            </a>
            <div style={{ marginTop: '1.25rem' }}>
                <a href="https://github.com/gabriell-franca/mesa-aberta" target="_blank" rel="noreferrer" style={{
                    fontFamily: "'Lora', serif", fontSize: '12px', color: 'var(--slm)',
                    textDecoration: 'none', fontStyle: 'italic',
                }}>
                    ver no GitHub →
                </a>
            </div>
        </div>
    )
}