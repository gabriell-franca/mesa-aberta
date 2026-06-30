export interface ThemeConfig {
  id: string
  label: string
  swatch: string   // cor representativa para o dot
  ready: boolean   // false = em breve (sem arte ainda)
}

export const THEMES: ThemeConfig[] = [
  { id: 'original', label: 'Original',  swatch: '#921821', ready: true  },
  { id: 'cyber',    label: 'Cyber',     swatch: '#00e5ff', ready: true  },
  { id: 'vtm',      label: 'VtM',       swatch: '#cc1133', ready: false },
  { id: 'medieval', label: 'Medieval',  swatch: '#c09050', ready: false },
  { id: 'paladin',  label: 'Paladino',  swatch: '#c8a020', ready: false },
  { id: 'druid',    label: 'Druida',    swatch: '#50c840', ready: false },
  { id: 'metals',   label: 'Metais',    swatch: '#d4a030', ready: false },
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
