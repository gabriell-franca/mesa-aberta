'use client'

import { useEffect, useRef, useState } from 'react'
import { THEMES } from './themes'

interface Props {
  current: string
  onChange: (id: string) => void
}

export default function ThemeSwitcher({ current, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'fixed', top: '20px', right: '82px', zIndex: 300 }}>
      <button
        onClick={() => setOpen(o => !o)}
        title="mudar tema"
        style={{
          background: 'transparent',
          border: '1px solid var(--md)',
          borderRadius: '6px',
          padding: '4px 10px',
          color: 'var(--sl)',
          fontFamily: 'inherit',
          fontSize: '10px',
          letterSpacing: '0.05em',
          cursor: 'pointer',
        }}
      >
        {current}
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          right: 0,
          background: 'var(--ml)',
          border: '1px solid var(--md)',
          borderRadius: '6px',
          overflow: 'hidden',
          minWidth: '110px',
          boxShadow: 'var(--card-shadow)',
        }}>
          {THEMES.map((t, i) => (
            <button
              key={t.id}
              onClick={() => { onChange(t.id); setOpen(false) }}
              style={{
                display: 'block',
                width: '100%',
                padding: '6px 12px',
                background: t.id === current ? 'var(--md)' : 'transparent',
                border: 'none',
                borderTop: i > 0 ? '1px solid var(--md)' : 'none',
                color: 'var(--ink)',
                fontFamily: 'inherit',
                fontSize: '10px',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
