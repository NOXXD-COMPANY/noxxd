// Product names for the navigation. Each product's accent, ink, tint and display face live in
// src/styles.css as .theme-<slug>, so they can follow the light and dark schemes.
export const PROJECTS = {
  urbis: { name: 'Urbis' },
  sigac: { name: 'SIGAC' },
  caritas: { name: 'CARITAS' },
}

export const themeOf = (slug) => `theme-${slug}`
