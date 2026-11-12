import { useEffect, useId, useRef, useState } from 'react'
import { T, useLang } from './lang.jsx'
import { PROJECTS, themeOf } from './projects.js'

const BORDER = 'M0 0h10v10h-10zM20 0h10v10h-10zM40 0h10v10h-10zM60 0h10v10h-10zM80 0h10v10h-10zM100 0h10v10h-10zM10 10h10v10h-10zM30 10h10v10h-10zM50 10h10v10h-10zM70 10h10v10h-10zM90 10h10v10h-10zM110 10h10v10h-10zM0 20h10v10h-10zM100 20h10v10h-10zM10 30h10v10h-10zM110 30h10v10h-10zM0 40h10v10h-10zM100 40h10v10h-10zM10 50h10v10h-10zM110 50h10v10h-10zM0 60h10v10h-10zM100 60h10v10h-10zM10 70h10v10h-10zM110 70h10v10h-10zM0 80h10v10h-10zM100 80h10v10h-10zM10 90h10v10h-10zM110 90h10v10h-10zM0 100h10v10h-10zM20 100h10v10h-10zM40 100h10v10h-10zM60 100h10v10h-10zM80 100h10v10h-10zM100 100h10v10h-10zM10 110h10v10h-10zM30 110h10v10h-10zM50 110h10v10h-10zM70 110h10v10h-10zM90 110h10v10h-10zM110 110h10v10h-10z'
const CORE = 'M20 20h80v80H20zM45.5 38.5L66.7 57.1V38.5h7.8v43h-7.8V68.5L53.3 49.9v31.6h-7.8z'

// NOXXD emblem in currentColor: black on light grounds, white on the night footer.
export function Emblem({ className = 'size-9' }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <path fill="currentColor" fillRule="evenodd" d={BORDER + CORE} />
    </svg>
  )
}

export function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
      <path d="M4 12h15M13 5l7 7-7 7" />
    </svg>
  )
}

// Starts false so the first client render matches the prerendered HTML, then reads the real setting.
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const onChange = (event) => setReduced(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return reduced
}

// Runs `onEnter` once when the element first scrolls into view.
export function useInView(onEnter, threshold = 0.5) {
  const ref = useRef(null)
  const enter = useRef(onEnter)
  enter.current = onEnter
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      enter.current()
    }, { threshold })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [threshold])
  return ref
}

// React Bits "Blur Text" pattern. `em` words take the page accent.
export function BlurText({ text, em }) {
  const words = [...text.split(' ').map((w) => [w, false]), ...(em ? em.split(' ').map((w) => [w, true]) : [])]
  return (
    <span key={text + em}>
      {words.map(([word, accent], i) => (
        <span key={i}>
          <span className={'blur-word' + (accent ? ' text-accent' : '')} style={{ '--i': i }}>{word}</span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </span>
  )
}

// React Bits "Count Up" pattern. Screen readers always get the final value; numbers below the fold
// drop to zero after mount so they count up without first flashing the final value.
export function CountUp({ to, decimals = 0 }) {
  const { lang } = useLang()
  const [value, setValue] = useState(to)
  const ref = useInView(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t0 = performance.now()
    const step = (now) => {
      const k = Math.min(1, Math.max(0, (now - t0) / 1200)) // a frame timestamp can predate t0
      setValue(to * (1 - Math.pow(1 - k, 3)))
      if (k < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, 0.6)
  useEffect(() => {
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches && ref.current.getBoundingClientRect().top > innerHeight) setValue(0)
  }, [])
  const format = (n) => n.toLocaleString(lang === 'en' ? 'en' : 'pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  return (
    <span ref={ref}>
      <span className="sr-only">{format(to)}</span>
      <span aria-hidden="true">{format(value)}</span>
    </span>
  )
}

// React Bits "Spotlight Card" pattern: the pointer position feeds the .spotlight light in styles.css.
export function Spotlight({ as: Tag = 'div', className = '', ...rest }) {
  const move = (event) => {
    const box = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--sx', `${event.clientX - box.left}px`)
    event.currentTarget.style.setProperty('--sy', `${event.clientY - box.top}px`)
  }
  return <Tag onPointerMove={move} className={`spotlight ${className}`} {...rest} />
}

const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789+/'

// React Bits "Decrypted Text" pattern: whenever `text` changes it settles left to right out of noise.
export function Scramble({ text }) {
  const [shown, setShown] = useState(text)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setShown(text)
    let frame = 0
    const id = setInterval(() => {
      frame += 1
      const settled = Math.floor((frame * text.length) / 16)
      setShown(text.slice(0, settled) + Array.from(text.slice(settled), () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join(''))
      if (settled >= text.length) clearInterval(id)
    }, 40)
    return () => clearInterval(id)
  }, [text])
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
    </>
  )
}

// Uiverse-style segmented switch: one stone block slides under the active language.
export function LangSwitch() {
  const { lang, setLang } = useLang()
  return (
    <div className="relative inline-grid grid-cols-2 border border-line-2" role="group" aria-label="Idioma / Language">
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-1/2 bg-stone transition-transform duration-300 ease-out-expo ${lang === 'en' ? 'translate-x-full' : ''}`}
      />
      {['pt', 'en'].map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={lang === code}
          aria-label={code === 'pt' ? 'Português' : 'English'}
          onClick={() => setLang(code)}
          className={`relative min-h-11 min-w-11 cursor-pointer text-[0.8125rem] font-semibold tracking-[0.04em] uppercase transition-colors duration-300 ${
            lang === code ? 'text-bg' : 'text-text-2 hover:text-ink'
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  )
}

// Light/dark for the whole site. The icon is drawn for both states and driven by CSS (.theme-ico in styles.css):
// a drop wells up in the middle of the sun, swallows it and settles as the moon; the page change itself is in lang.jsx.
export function ThemeSwitch({ className = '' }) {
  const { t, theme, toggleTheme } = useLang()
  const bite = useId()
  return (
    <button
      type="button"
      aria-pressed={theme === 'dark'}
      onClick={toggleTheme}
      className={`theme-switch min-h-11 min-w-11 cursor-pointer items-center justify-center gap-3 border border-line-2 text-[0.9375rem] text-text-2 transition-colors hover:bg-surface hover:text-ink ${className}`}
    >
      <svg viewBox="0 0 24 24" className="theme-ico size-5 overflow-visible" aria-hidden="true">
        <mask id={bite} maskUnits="userSpaceOnUse" x="-12" y="-12" width="48" height="48">
          <rect x="-12" y="-12" width="48" height="48" fill="#fff" />
          <circle className="ico-bite" cx="16.5" cy="7.5" r="6" />
        </mask>
        <g className="ico-sun">
          <circle cx="12" cy="12" r="3.6" fill="currentColor" />
          <path d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" fill="none" stroke="currentColor" strokeWidth="2" />
        </g>
        <g mask={`url(#${bite})`}>
          <circle className="ico-drop" cx="12" cy="12" r="7" fill="currentColor" />
        </g>
      </svg>
      <span className="md:sr-only">{t('Tema escuro', 'Dark theme')}</span>
    </button>
  )
}

/** links: [{ href, label, current, world }] — `world` is a project slug: the link carries that product's accent pixel. — hash links get scroll-spy highlighting on the Home. */
export function Header({ links }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(null)
  const toggle = useRef(null)
  const nav = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      toggle.current.focus()
    }
    const onClick = (event) => {
      if (!nav.current.contains(event.target) && !toggle.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
    }
  }, [open])

  useEffect(() => {
    const sections = links.filter((l) => l.href.startsWith('#')).map((l) => document.querySelector(l.href)).filter(Boolean)
    if (!sections.length) return
    const onScroll = () => {
      const y = scrollY + 140
      const hit = sections.findLast((s) => s.offsetTop <= y)
      setActive(hit ? '#' + hit.id : null)
    }
    addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => removeEventListener('scroll', onScroll)
  }, [links])

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg">
      <div className="wrap flex min-h-16 items-center justify-between gap-6 md:min-h-18">
        <a href="/" className="flex items-center gap-3 text-ink no-underline" aria-label="NOXXD — Início / Home">
          <Emblem className="size-8 md:size-9" />
          <span className="font-display text-[1.375rem] leading-none font-bold tracking-[0.04em]">NOXXD</span>
        </a>
        <div className="flex items-center gap-3">
          <nav
            id="primary-nav"
            ref={nav}
            aria-label="Navegação principal / Main navigation"
            className={`${open ? 'flex' : 'hidden'} absolute inset-x-0 top-full flex-col border-b border-line bg-bg px-6 py-3 md:static md:mr-6 md:flex md:flex-row md:items-center md:gap-8 md:border-0 md:p-0`}
          >
            {links.map((link) => {
              const on = link.current || active === link.href
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={link.current ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                  {...(link.world && themeOf(link.world))}
                  className={`flex items-center gap-2.5 border-b py-3.5 text-[0.9375rem] no-underline transition-colors md:py-1.5 ${
                    on ? 'border-line text-ink md:border-ink' : 'border-line text-text-2 hover:text-ink md:border-transparent'
                  }`}
                >
                  {link.world && <i aria-hidden="true" className="size-1.5 flex-none bg-accent" />}
                  {link.label}
                </a>
              )
            })}
            <ThemeSwitch className="my-3 flex w-full md:hidden" />
          </nav>
          <LangSwitch />
          <ThemeSwitch className="hidden md:inline-flex" />
          <button
            ref={toggle}
            type="button"
            className="flex size-11 cursor-pointer flex-col items-center justify-center gap-[5px] border border-line-2 hover:bg-surface md:hidden"
            aria-expanded={open}
            aria-controls="primary-nav"
            aria-label={open ? 'Fechar menu / Close menu' : 'Abrir menu / Open menu'}
            onClick={() => setOpen(!open)}
          >
            <span className={`h-px w-5 bg-ink transition-transform ${open ? 'translate-y-[6px] rotate-45' : ''}`} />
            <span className={`h-px w-5 bg-ink transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`h-px w-5 bg-ink transition-transform ${open ? '-translate-y-[6px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  )
}

const WA = 'https://wa.me/5575981802188'

export function Footer() {
  const col = 'flex flex-col gap-1 text-[0.9375rem]'
  const link = 'inline-flex min-h-11 items-center text-night-2 no-underline transition-colors hover:text-white'
  const head = 'mb-2 text-[0.8125rem] font-semibold text-white'
  return (
    <footer className="bg-night text-night-2 [--ring:0_0_0_2px_#1C1917,0_0_0_4px_#FAFAF9]">
      <div className="wrap grid grid-cols-2 gap-x-6 gap-y-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:py-24">
        <div className="col-span-2 md:col-span-1">
          <a href="/" className="inline-flex items-center gap-4 text-white no-underline" aria-label="NOXXD — Início / Home">
            <Emblem className="size-12" />
            <span className="font-display text-[2rem] leading-none font-bold tracking-[0.04em]">NOXXD</span>
          </a>
          <p className="mt-6 text-[0.8125rem] font-semibold tracking-[0.3em] text-white">
            <T pt="CONSTRUA DO SEU JEITO" en="BUILD IT YOUR WAY" />
          </p>
        </div>
        <nav className={col} aria-label="Projetos / Projects">
          <p className={head}><T pt="Projetos" en="Projects" /></p>
          {Object.entries(PROJECTS).map(([slug, p]) => (
            <a key={slug} className={`${link} gap-2.5`} href={`/projetos/${slug}/`}>
              <i aria-hidden="true" className="size-1.5 flex-none" style={{ background: p.accent[1] }} />
              {p.name}
            </a>
          ))}
        </nav>
        <div className={col}>
          <p className={head}><T pt="Contato" en="Contact" /></p>
          <a className={link} href="mailto:contato@noxxd.com.br">contato@noxxd.com.br</a>
          <a className={link} href={WA} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </div>
        <div className={col}>
          <p className={head}><T pt="Redes" en="Social" /></p>
          <a className={link} href="https://instagram.com/noxxd_company?dlrf=MXA5Zzdsbm53cGFucA%3D%3D" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="wrap py-6 text-[0.875rem]">
          <T pt="© 2026 NOXXD. Todos os direitos reservados." en="© 2026 NOXXD. All rights reserved." />
        </p>
      </div>
    </footer>
  )
}

/** Browser or phone frame around a real screenshot. Screens are always labelled as demo data. */
export function Shot({ src, alt, width, height, url, caption, phone = false, eager = false, className = '' }) {
  return (
    <figure className={className}>
      <div className={`border border-line-2 bg-bg ${eager ? '' : 'unroll'} ${phone ? 'mx-auto max-w-[300px] p-2' : ''}`}>
        {!phone && (
          <div className="flex items-center gap-2 border-b border-line bg-surface px-3 py-2" aria-hidden="true">
            <i className="size-2 bg-line-2" /><i className="size-2 bg-line-2" /><i className="size-2 bg-line-2" />
            <span className="ml-2 truncate font-mono text-[0.75rem] text-text-2">{url}</span>
          </div>
        )}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : undefined}
          decoding="async"
          className="dim block h-auto w-full"
        />
      </div>
      <figcaption className="mt-3 text-[0.875rem] leading-relaxed text-text-2">
        {caption && <>{caption} · </>}
        <span className="text-ink"><T pt="Dados fictícios" en="Demo data" /></span>
      </figcaption>
    </figure>
  )
}

/** FAQ on native <details>, 21st.dev FAQ-section layout: question rows on hairlines, plus turns to minus. */
export function Faq({ title, items }) {
  return (
    <section className="section border-t border-line" aria-labelledby="faq-title">
      <div className="wrap grid gap-8 md:grid-cols-[5fr_7fr] md:gap-12">
        <h2 id="faq-title" className="font-product text-[1.875rem] leading-tight font-bold text-accent-ink">{title}</h2>
        <div className="border-t border-line">
          {items.map(([q, a], i) => (
            <details key={i} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-[1.0625rem] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {q}
                <span aria-hidden="true" className="relative mt-2.5 size-3 flex-none">
                  <i className="absolute inset-x-0 top-1/2 h-px bg-current" />
                  <i className="absolute inset-y-0 left-1/2 w-px bg-current transition-transform duration-300 group-open:scale-y-0" />
                </span>
              </summary>
              <p className="max-w-[60ch] pb-6 text-text-2">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
