import { createContext, useContext, useEffect, useState } from 'react'
import { symbiote } from './symbiote.js'

const LangContext = createContext({ lang: 'pt', setLang() {}, t: (pt) => pt, theme: 'light', toggleTheme() {} })

// Read once at import, before any effect renames the tab; absent during the build-time prerender.
const titles = typeof document === 'undefined' ? null : { pt: document.title, en: document.documentElement.dataset.titleEn || document.title }

export const readSaved = () => {
  try {
    return localStorage.getItem('noxxd_lang') === 'en' ? 'en' : 'pt'
  } catch {
    return 'pt' // storage blocked: Portuguese is the default
  }
}

// PT/EN and light/dark shared by every page through localStorage "noxxd_lang" and "noxxd_theme".
// Titles come from each HTML file; the theme is set before paint by the inline script in each HTML head.
export function LangProvider({ children }) {
  const [lang, setLang] = useState(readSaved)
  const [theme, setTheme] = useState('light') // matches the prerendered HTML; the real value is read after mount

  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR'
    document.documentElement.removeAttribute('data-wait') // set by the inline script in each HTML head
    document.title = titles[lang]
    try {
      localStorage.setItem('noxxd_lang', lang)
    } catch {
      // storage blocked: the choice lasts for this page view
    }
  }, [lang])

  useEffect(() => {
    const root = document.documentElement
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(dark ? 'dark' : 'light')
    if (dark) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#161412') // browser chrome follows a saved dark theme
  }, [])

  // "Symbiote" theme change: the dark page leaves the pressed control as tendrils and swallows the viewport;
  // going back to light, the same mass is sucked into the control. One clip-path animation on the page snapshot.
  const toggleTheme = (event) => {
    const root = document.documentElement
    if (root.classList.contains('goo-vt')) return // a change is already crawling across the page
    const next = theme === 'dark' ? 'light' : 'dark'
    const apply = () => {
      root.dataset.theme = next
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#161412' : '#FAFAF9')
    }
    setTheme(next)
    try {
      localStorage.setItem('noxxd_theme', next)
    } catch {
      // storage blocked: the choice lasts for this page view
    }
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return apply()
    const box = event.currentTarget.getBoundingClientRect()
    const frames = symbiote(box.left + box.width / 2, box.top + box.height / 2, innerWidth, innerHeight)
    const retreat = next === 'light' // the dark snapshot stays on top and shrinks
    root.classList.add('goo-vt', retreat ? 'goo-out' : 'goo-in')
    const change = document.startViewTransition(apply)
    let crawl
    change.ready
      .then(() => {
        root.classList.add('goo-run') // starts the icon animation in step with the mass
        crawl = root.animate(frames, {
          duration: 900,
          easing: 'cubic-bezier(0.7, 0, 0.2, 1)', // a slow quarter of creeping tendrils, then the rush
          direction: retreat ? 'reverse' : 'normal',
          fill: 'both',
          pseudoElement: retreat ? '::view-transition-old(root)' : '::view-transition-new(root)',
        })
      })
      .catch(() => {}) // transition skipped (tab hidden, another one started): the theme is applied anyway
    change.finished.finally(() => {
      crawl?.cancel() // a filled animation outlives its snapshot: left alone, the retreat's empty clip hides the page on the next change
      root.classList.remove('goo-vt', 'goo-in', 'goo-out', 'goo-run')
    })
  }

  const t = (pt, en) => (lang === 'en' ? en : pt)
  return <LangContext.Provider value={{ lang, setLang, t, theme, toggleTheme }}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)

export function T({ pt, en }) {
  return useLang().t(pt, en)
}
