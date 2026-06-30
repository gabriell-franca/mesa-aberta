export interface ThemeConfig {
  id: string
  label: string
}

export const THEMES: ThemeConfig[] = [
  { id: 'original', label: 'original' },
  { id: 'cyber', label: 'cyber' },
  { id: 'vtm', label: 'vtm' },
  { id: 'medieval', label: 'medieval' },
  { id: 'paladin', label: 'paladin' },
  { id: 'druid', label: 'druid' },
  { id: 'metals', label: 'metals' },
]

export const DEFAULT_THEME = 'original'

/** Temas que possuem arte de fundo interativa */
export const THEMES_WITH_ART = new Set(['original', 'cyber'])

export function applyTheme(id: string) {
  document.documentElement.setAttribute('data-theme', id === 'original' ? '' : id)
}

export function loadSavedTheme(): string {
  if (typeof window === 'undefined') return DEFAULT_THEME
  const saved = localStorage.getItem('mesa-theme')
  return THEMES.some(t => t.id === saved) ? saved! : DEFAULT_THEME
}

export function saveTheme(id: string) {
  localStorage.setItem('mesa-theme', id)
}
