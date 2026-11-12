// One muted accent, ink, tint and display face per product: same NOXXD frame, distinct worlds.
// Colour pairs are [light, dark]; themeOf hands both to [data-world] in styles.css, so the one data-theme switch re-tints every world.
export const PROJECTS = {
  urbis: {
    name: 'Urbis',
    accent: ['#2F6B7C', '#6FB3C6'],
    ink: ['#16323B', '#D5EAF0'],
    tint: ['#EBF1F2', '#14252B'],
    font: "'Manrope', 'Inter', sans-serif",
    logo: '/assets/projetos/urbis/logo.svg',
    size: [120, 120],
    kind: ['Zeladoria urbana para prefeituras', 'Urban maintenance for city halls'],
  },
  sigac: {
    name: 'SIGAC',
    accent: ['#8A6A2E', '#D2A85A'],
    ink: ['#1F2D3D', '#DCE5EF'],
    tint: ['#F4EFE6', '#261F12'],
    font: "'Archivo', 'Inter', sans-serif",
    logo: '/assets/projetos/sigac/logo.svg',
    size: [120, 120],
    kind: ['Sistema Integrado de Gestão Administrativa de Contratos', 'Integrated Administrative Contract Management System'],
  },
  caritas: {
    name: 'CARITAS',
    accent: ['#52599A', '#A3A9E6'],
    ink: ['#1E2238', '#DEE0F5'],
    tint: ['#EEEFF6', '#1B1D30'],
    font: "'Sora', 'Inter', sans-serif",
    logo: '/assets/projetos/caritas/logo.svg',
    size: [400, 400],
    kind: ['Plataforma clínica para psicólogas e psicólogos', 'Clinical platform for psychologists'],
  },
}

// shortcut: native light-dark() only (2024+ browsers); older ones drop these decorative fills. Move to CSS variables if that matters.
export const ld = (light, dark) => `light-dark(${light}, ${dark})`

/** Spread on the element that hosts a product world: {...themeOf('urbis')} */
export const themeOf = (slug) => {
  const p = PROJECTS[slug]
  return {
    'data-world': slug,
    style: { '--a-l': p.accent[0], '--a-d': p.accent[1], '--i-l': p.ink[0], '--i-d': p.ink[1], '--t-l': p.tint[0], '--t-d': p.tint[1], '--p-font': p.font },
  }
}
