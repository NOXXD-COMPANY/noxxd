import { PROJECTS, themeOf } from './projects.js'
import { T, useLang } from './lang.jsx'
import { Arrow, CountUp, RiseText, Shell } from './ui.jsx'

/** NOXXD frame for a case page: same header and footer as the Home, product theme in between. */
export function ProjectPage({ slug, children }) {
  const { t } = useLang()
  const links = [
    ...Object.entries(PROJECTS).map(([key, p]) => ({ href: `/projetos/${key}/`, label: p.name, current: key === slug })),
    { href: '/#contato', label: t('Contato', 'Contact') },
  ]
  return <Shell links={links} className={themeOf(slug)}>{children}</Shell>
}

export function H2({ id, children, className = '' }) {
  return <h2 id={id} className={`h-display text-h2 ${className}`}>{children}</h2>
}

/** Hero: product lockup on its tint wash, rising headline, two actions, then the product's signature module. */
export function Hero({ logo, logoSize, name, byline, title, em, lead, secondary, children }) {
  return (
    <section className="hero-wash checker -mt-16 pt-16 lg:-mt-18 lg:pt-18" aria-labelledby="hero-title">
      <div className="wrap pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="mb-10 flex items-center gap-4 md:mb-14">
          {/* the plate stays light in both themes so every product logo keeps its contrast */}
          <span className="grid size-16 flex-none place-items-center rounded-lg border border-line bg-raised p-2.5 scope-light shadow-1">
            <img src={logo} alt={`${name} logo`} width={logoSize[0]} height={logoSize[1]} className="size-full object-contain" />
          </span>
          <p className="h-display text-h3 leading-none">
            {name}
            <small className="mt-2 block font-sans text-sm font-medium tracking-normal text-text-2">{byline}</small>
          </p>
        </div>
        <h1 id="hero-title" className="h-display max-w-[16ch] text-h1">
          <RiseText text={title} em={em} />
        </h1>
        <p className="lead mt-7">{lead}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a className="btn" href="/#contato"><T pt="Solicitar demonstração" en="Request a demo" /><Arrow /></a>
          <a className="btn btn-outline" href={secondary[0]}>{secondary[1]}</a>
        </div>
        {children}
      </div>
    </section>
  )
}

/** Four facts on hairlines; numbers count up once (React Bits Count Up). items: [value, decimals, suffix, label] */
export function Facts({ items }) {
  const { t } = useLang()
  return (
    <section className="border-y border-line bg-surface" aria-label={t('Números', 'Facts')}>
      <dl className="wrap grid grid-cols-2 gap-x-6 gap-y-8 py-12 md:grid-cols-4 md:py-16" data-stagger>
        {items.map(([value, decimals, suffix, label], i) => (
          <div key={i} className="border-t border-line-2 pt-5">
            <dt className="h-display text-stat tabular-nums">
              <CountUp to={value} decimals={decimals} />{suffix}
            </dt>
            <dd className="mt-3 text-md text-text-2">{label}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/** Small square marker list: a lead-in in ink, then the detail. items: [lead, detail] */
export function Points({ items, className = '' }) {
  return (
    <ul className={`grid gap-3 ${className}`}>
      {items.map(([lead, detail], i) => (
        <li key={i} className="grid grid-cols-[14px_1fr] gap-3 text-text-2">
          <span aria-hidden="true" className="mt-[0.7em] size-1.5 rounded-xs bg-accent" />
          <span>{lead && <strong className="font-semibold text-ink">{lead}</strong>}{lead && detail && ' · '}{detail}</span>
        </li>
      ))}
    </ul>
  )
}

/** Closing call to action: one tinted panel in the product colour, checker in the corner. */
export function Close({ title, lead }) {
  return (
    <section className="section border-t border-line" aria-labelledby="close-title">
      <div className="wrap">
        <div className="hero-wash checker spot flex flex-col items-start justify-between gap-9 rounded-xl border border-line p-8 md:flex-row md:items-end md:p-14" data-reveal>
          <div className="max-w-(--container-measure)">
            <H2 id="close-title">{title}</H2>
            <p className="lead mt-6">{lead}</p>
          </div>
          <a className="btn flex-none" href="/#contato"><T pt="Falar com a NOXXD" en="Talk to NOXXD" /><Arrow /></a>
        </div>
      </div>
    </section>
  )
}
