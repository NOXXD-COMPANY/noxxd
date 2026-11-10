import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { T, useLang } from './lang.jsx'

const BORDER = 'M0 0h10v10h-10zM20 0h10v10h-10zM40 0h10v10h-10zM60 0h10v10h-10zM80 0h10v10h-10zM100 0h10v10h-10zM10 10h10v10h-10zM30 10h10v10h-10zM50 10h10v10h-10zM70 10h10v10h-10zM90 10h10v10h-10zM110 10h10v10h-10zM0 20h10v10h-10zM100 20h10v10h-10zM10 30h10v10h-10zM110 30h10v10h-10zM0 40h10v10h-10zM100 40h10v10h-10zM10 50h10v10h-10zM110 50h10v10h-10zM0 60h10v10h-10zM100 60h10v10h-10zM10 70h10v10h-10zM110 70h10v10h-10zM0 80h10v10h-10zM100 80h10v10h-10zM10 90h10v10h-10zM110 90h10v10h-10zM0 100h10v10h-10zM20 100h10v10h-10zM40 100h10v10h-10zM60 100h10v10h-10zM80 100h10v10h-10zM100 100h10v10h-10zM10 110h10v10h-10zM30 110h10v10h-10zM50 110h10v10h-10zM70 110h10v10h-10zM90 110h10v10h-10zM110 110h10v10h-10z'
const CORE = 'M20 20h80v80H20zM45.5 38.5L66.7 57.1V38.5h7.8v43h-7.8V68.5L53.3 49.9v31.6h-7.8z'

// NOXXD emblem in currentColor: black on light grounds, white on dark ones.
export function Emblem({ className = 'size-9' }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <path fill="currentColor" fillRule="evenodd" d={BORDER + CORE} />
    </svg>
  )
}

// Border squares in a scattered but fixed order, so the build looks hand-placed and matches the prerender.
const SQUARES = [...BORDER.matchAll(/M(\d+) (\d+)/g)]
  .map(([, x, y]) => [Number(x), Number(y)])
  .sort((a, b) => ((a[0] * 7 + a[1] * 13) % 17) - ((b[0] * 7 + b[1] * 13) % 17))

// Home hero: the emblem assembles square by square, then the "N" block lands.
export function EmblemBuild({ className = '' }) {
  return (
    <svg viewBox="0 0 120 120" className={`build ${className}`} fill="currentColor" aria-hidden="true">
      {SQUARES.map(([x, y], i) => <rect key={i} x={x} y={y} width="10" height="10" style={{ '--i': i }} />)}
      <path fillRule="evenodd" d={CORE} style={{ '--i': SQUARES.length + 6 }} />
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

// Cross-fades a DOM change (language, theme) so it never flashes; plain update where unsupported.
const swap = (update) => {
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) update()
  else document.startViewTransition(update)
}

// Scroll reveal for [data-reveal] (one block) and [data-stagger] (its children, in turn).
// What is already on screen is marked first, so turning the effect on never hides visible content.
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.dataset.in = ''
        io.unobserve(entry.target)
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    for (const node of document.querySelectorAll('[data-reveal], [data-stagger]')) {
      if (node.getBoundingClientRect().top < innerHeight) node.dataset.in = ''
      else io.observe(node)
    }
    document.documentElement.dataset.motion = ''
    return () => io.disconnect()
  }, [])
}

// React Bits "Spotlight Card" pattern: the nearest .spot gets the pointer position as --x / --y.
const spotlight = (event) => {
  const card = event.target.closest?.('.spot')
  if (!card) return
  const box = card.getBoundingClientRect()
  card.style.setProperty('--x', `${event.clientX - box.left}px`)
  card.style.setProperty('--y', `${event.clientY - box.top}px`)
}

// Headline words rise in one at a time (React Bits "Blur Text" timing, transform and opacity only).
// `em` words take the page accent.
export function RiseText({ text, em }) {
  const words = [...text.split(' ').map((w) => [w, false]), ...(em ? em.split(' ').map((w) => [w, true]) : [])]
  return (
    <span key={text + em}>
      {words.map(([word, accent], i) => (
        <span key={i}>
          <span className={'rise-word' + (accent ? ' text-accent' : '')} style={{ '--i': i }}>{word}</span>
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

// React Bits "Logo Loop" pattern; the copy track is hidden from assistive tech.
export function Loop({ label, items, speed, itemClass }) {
  const track = (hidden) => (
    <ul className="loop__track" aria-hidden={hidden || undefined}>
      {items.map((item, i) => <li key={i} className={itemClass}>{item}</li>)}
    </ul>
  )
  return (
    <div className="loop" role="region" aria-label={label} style={{ '--loop-speed': speed }}>
      {track(false)}
      {track(true)}
    </div>
  )
}

// Uiverse-style segmented switch: one ink block slides under the active language.
export function LangSwitch() {
  const { lang, setLang } = useLang()
  return (
    <div className="relative inline-grid grid-cols-2 overflow-hidden rounded-md border border-line-2 bg-raised" role="group" aria-label="Idioma / Language">
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-1/2 bg-ink transition-transform duration-(--dur-2) ease-out-expo ${lang === 'en' ? 'translate-x-full' : ''}`}
      />
      {['pt', 'en'].map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={lang === code}
          aria-label={code === 'pt' ? 'PT, Português' : 'EN, English'}
          onClick={() => lang !== code && swap(() => flushSync(() => setLang(code)))}
          className={`relative min-h-11 min-w-11 cursor-pointer text-xs font-semibold tracking-[0.04em] uppercase transition-colors duration-(--dur-2) ${
            lang === code ? 'text-bg' : 'text-text-2 hover:text-ink'
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  )
}

// Follows the system theme until the visitor picks one; the choice lives in localStorage "noxxd_theme".
export function ThemeToggle({ className = '' }) {
  const toggle = () => {
    const root = document.documentElement
    const current = root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    const next = current === 'dark' ? 'light' : 'dark'
    swap(() => { root.dataset.theme = next })
    try {
      localStorage.setItem('noxxd_theme', next)
    } catch {
      // storage blocked: the choice lasts for this page view
    }
  }
  return (
    <button type="button" className={`icon-btn ${className}`} onClick={toggle} aria-label="Alternar tema claro ou escuro / Toggle light or dark theme">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <g className="theme-sun"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></g>
        <path className="theme-moon" d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
      </svg>
    </button>
  )
}

function Brand() {
  return (
    <a href="/" className="flex min-h-11 items-center gap-2.5 text-ink no-underline" aria-label="NOXXD — Início / Home">
      <Emblem className="size-8" />
      <span className="font-display text-xl leading-none font-bold tracking-[0.04em]">NOXXD</span>
    </a>
  )
}

/** links: [{ href, label, current }] — hash links get scroll-spy highlighting on the Home.
    Below lg the links move into a full-screen <dialog>: native focus trap, Esc to close, inert page. */
export function Header({ links }) {
  const [active, setActive] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menu = useRef(null)
  const hrefs = links.map((l) => l.href).join()

  useEffect(() => {
    const sections = hrefs.split(',').filter((h) => h.startsWith('#')).map((h) => document.querySelector(h)).filter(Boolean)
    const onScroll = () => {
      setScrolled(scrollY > 8)
      const y = scrollY + 160
      const hit = sections.findLast((s) => s.offsetTop <= y)
      setActive(hit ? '#' + hit.id : null)
    }
    addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => removeEventListener('scroll', onScroll)
  }, [hrefs])

  return (
    <>
      <header className="site-header" data-scrolled={scrolled || undefined}>
        <div className="wrap flex h-16 items-center justify-between gap-3 lg:h-18">
          <Brand />
          <nav aria-label="Navegação principal / Main navigation" className="hidden items-center lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={link.current ? 'page' : undefined}
                data-on={link.current || active === link.href || undefined}
                className="nav-link"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <LangSwitch />
            <ThemeToggle className="max-sm:hidden" />
            <button
              type="button"
              className="icon-btn lg:hidden"
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls="menu"
              aria-label="Abrir menu / Open menu"
              onClick={() => {
                menu.current.showModal()
                setOpen(true)
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16M4 16h16" /></svg>
            </button>
          </div>
        </div>
      </header>

      <dialog ref={menu} id="menu" className="menu" aria-label="Menu" onClose={() => setOpen(false)}>
        <div className="wrap flex min-h-full flex-col">
          <div className="flex h-16 flex-none items-center justify-between">
            <Brand />
            <form method="dialog">
              <button className="icon-btn" aria-label="Fechar menu / Close menu">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </form>
          </div>
          <nav aria-label="Menu" className="flex flex-col py-6">
            {links.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={link.current ? 'page' : undefined}
                onClick={() => menu.current.close()}
                style={{ '--i': i }}
                className={`menu-link flex min-h-16 items-center border-b border-line font-display text-h3 no-underline ${link.current || active === link.href ? 'text-ink' : 'text-text-2'}`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-auto flex items-center justify-between gap-4 py-6">
            <a href="mailto:contato@noxxd.com.br" className="text-link">contato@noxxd.com.br</a>
            <ThemeToggle />
          </div>
        </div>
      </dialog>
    </>
  )
}

const WA = 'https://wa.me/5575981802188'

export function Footer() {
  const col = 'flex flex-col gap-1 text-md'
  const link = 'inline-flex min-h-11 items-center wrap-anywhere text-text-2 no-underline transition-colors duration-(--dur-1) hover:text-ink'
  const head = 'mb-2 text-xs font-semibold text-ink'
  return (
    <footer className="band-night checker">
      <div className="wrap grid grid-cols-2 gap-x-6 gap-y-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:py-24">
        <div className="col-span-2 md:col-span-1">
          <a href="/" className="inline-flex items-center gap-4 text-ink no-underline" aria-label="NOXXD — Início / Home">
            <Emblem className="size-12" />
            <span className="font-display text-h2 leading-none font-bold tracking-[0.04em]">NOXXD</span>
          </a>
          <p className="mt-6 text-xs font-semibold tracking-[0.3em] text-ink">
            <T pt="CONSTRUA DO SEU JEITO" en="BUILD IT YOUR WAY" />
          </p>
        </div>
        <nav className={col} aria-label="Projetos / Projects">
          <p className={head}><T pt="Projetos" en="Projects" /></p>
          <a className={link} href="/projetos/urbis/">Urbis</a>
          <a className={link} href="/projetos/healthsearch/">HealthSearch</a>
          <a className={link} href="/projetos/caritas/">CARITAS</a>
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
      <div className="border-t border-line">
        <p className="wrap py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-sm text-text-2">
          <T pt="© 2026 NOXXD. Todos os direitos reservados." en="© 2026 NOXXD. All rights reserved." />
        </p>
      </div>
    </footer>
  )
}

/** Browser or phone frame around a real screenshot; click opens the page lightbox.
    Screens are always labelled as demo data. Each screenshot has a half-width "-sm" twin for small viewports. */
export function Shot({ src, alt, width, height, url, caption, phone = false, eager = false, sizes = '(min-width: 1024px) 50vw, 100vw', className = '' }) {
  const { t } = useLang()
  return (
    <figure className={className}>
      <button type="button" className="shot-zoom" data-shot={src} data-caption={caption}>
        <span className="sr-only">{t('Ampliar imagem', 'Enlarge image')}: </span>
        <span className={`shot-frame block overflow-hidden border border-line-2 bg-raised shadow-2 ${phone ? 'mx-auto max-w-75 rounded-xl p-2' : 'rounded-lg'}`}>
          {!phone && (
            <span className="flex items-center gap-1.5 border-b border-line bg-surface px-3 py-2" aria-hidden="true">
              <i className="size-2 rounded-full bg-line-2" /><i className="size-2 rounded-full bg-line-2" /><i className="size-2 rounded-full bg-line-2" />
              <span className="ml-2 truncate font-mono text-xs text-text-2">{url}</span>
            </span>
          )}
          <img
            src={src}
            srcSet={`${src.replace('.webp', '-sm.webp')} ${width / 2}w, ${src} ${width}w`}
            sizes={phone ? '300px' : sizes}
            alt={alt}
            width={width}
            height={height}
            loading={eager ? 'eager' : 'lazy'}
            fetchPriority={eager ? 'high' : undefined}
            decoding="async"
            className={`block h-auto w-full ${phone ? 'rounded-lg' : ''}`}
          />
        </span>
      </button>
      <figcaption className="mt-3 text-sm text-text-2">
        {caption && <>{caption} · </>}
        <span className="font-medium text-ink"><T pt="Dados fictícios" en="Demo data" /></span>
      </figcaption>
    </figure>
  )
}

// One lightbox per page for every <Shot>: arrow keys or buttons move through the gallery, Esc closes.
function Lightbox() {
  const { t } = useLang()
  const dialog = useRef(null)
  const [shots, setShots] = useState([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const onClick = (event) => {
      const hit = event.target.closest?.('[data-shot]')
      if (!hit) return
      const all = [...document.querySelectorAll('[data-shot]')]
      setShots(all.map((node) => {
        const img = node.querySelector('img')
        return { src: node.dataset.shot, alt: img.alt, width: img.width, height: img.height, caption: node.dataset.caption }
      }))
      setIndex(all.indexOf(hit))
      dialog.current.showModal()
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const shot = shots[index]
  const move = (step) => setIndex((i) => (i + step + shots.length) % shots.length)
  const arrow = (step, label, d) => (
    <button type="button" className="icon-btn" aria-label={label} onClick={() => move(step)}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d={d} /></svg>
    </button>
  )
  return (
    <dialog
      ref={dialog}
      className="lightbox"
      aria-label={t('Imagem ampliada', 'Enlarged image')}
      onClick={(event) => event.target === dialog.current && dialog.current.close()}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') move(1)
        if (event.key === 'ArrowLeft') move(-1)
      }}
    >
      {shot && (
        <figure className="pointer-events-none mx-auto flex h-full max-w-(--container-page) flex-col justify-center gap-4 *:pointer-events-auto">
          <img
            key={shot.src}
            src={shot.src}
            alt={shot.alt}
            width={shot.width}
            height={shot.height}
            className="mx-auto max-h-[calc(100dvh-9rem)] w-auto max-w-full animate-rise rounded-lg object-contain shadow-3"
          />
          <figcaption className="flex flex-wrap items-center justify-between gap-3 text-sm text-text-2">
            <p aria-live="polite">
              {shot.caption && <>{shot.caption} · </>}
              <span className="font-medium text-ink"><T pt="Dados fictícios" en="Demo data" /></span>
              <span className="ml-3 tabular-nums">{index + 1} / {shots.length}</span>
            </p>
            <span className="flex gap-2">
              {shots.length > 1 && arrow(-1, t('Imagem anterior', 'Previous image'), 'M15 5l-7 7 7 7')}
              {shots.length > 1 && arrow(1, t('Próxima imagem', 'Next image'), 'M9 5l7 7-7 7')}
              <form method="dialog">
                <button className="icon-btn" aria-label={t('Fechar', 'Close')}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>
              </form>
            </span>
          </figcaption>
        </figure>
      )}
    </dialog>
  )
}

/** FAQ on native <details>, 21st.dev FAQ-section layout: question rows on hairlines, plus turns to minus. */
export function Faq({ title, items }) {
  return (
    <section id="faq" className="section border-t border-line" aria-labelledby="faq-title">
      <div className="wrap grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <h2 id="faq-title" className="h-display text-h2" data-reveal>{title}</h2>
        <div className="border-t border-line" data-reveal>
          {items.map(([q, a], i) => (
            <details key={i} className="faq group border-b border-line">
              <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-6 py-4 text-lg font-semibold text-ink transition-colors duration-(--dur-1) hover:text-accent">
                {q}
                <span aria-hidden="true" className="relative grid size-8 flex-none place-items-center rounded-full border border-line-2 transition-transform duration-(--dur-2) ease-out-expo group-open:rotate-180">
                  <i className="absolute h-px w-3 bg-current" />
                  <i className="absolute h-3 w-px bg-current transition-transform duration-(--dur-2) group-open:scale-y-0" />
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

/** Page frame shared by the Home and every project: skip link, header, main, footer, lightbox,
    plus the scroll-reveal observer and the spotlight pointer tracking. `className` carries a project theme. */
export function Shell({ links, className, children }) {
  useReveal()
  return (
    <div className={className} onPointerMove={spotlight}>
      <a href="#conteudo" className="btn absolute -top-20 left-3 z-60 w-auto! focus:top-3">
        <T pt="Pular para o conteúdo" en="Skip to content" />
      </a>
      <Header links={links} />
      <main id="conteudo">{children}</main>
      <Footer />
      <Lightbox />
    </div>
  )
}
