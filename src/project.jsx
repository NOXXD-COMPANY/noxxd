import { PROJECTS, themeOf } from './projects.js'
import { T, useLang } from './lang.jsx'
import { Arrow, BlurText, CountUp, Footer, Header, Spotlight } from './ui.jsx'

/** NOXXD frame for a case page: same header and footer as the Home, product theme in between. */
export function ProjectPage({ slug, children }) {
  const { t } = useLang()
  const links = [
    ...Object.entries(PROJECTS).map(([key, p]) => ({ href: `/projetos/${key}/`, label: p.name, current: key === slug, world: key })),
    { href: '/#contato', label: t('Contato', 'Contact') },
  ]
  return (
    <div {...themeOf(slug)}>
      <a href="#conteudo" className="btn absolute -top-16 left-3 z-[60] focus:top-3">
        <T pt="Pular para o conteúdo" en="Skip to content" />
      </a>
      <Header links={links} />
      <main id="conteudo">
        {children}
        <Others slug={slug} />
      </main>
      <Footer />
    </div>
  )
}

export function H2({ id, children, className = '' }) {
  return (
    <h2 id={id} className={`font-product text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.15] font-bold tracking-[-0.025em] text-accent-ink ${className}`}>
      {children}
    </h2>
  )
}

/** Hero: product lockup on its tint plate, blur-in headline, two actions, then the product's signature module. */
export function Hero({ logo, logoSize, name, byline, title, em, lead, secondary, children }) {
  return (
    <section className="plate" aria-labelledby="hero-title">
      <div className="wrap pt-14 pb-16 md:pt-24 md:pb-24">
      <div className="mb-10 flex items-center gap-4 md:mb-14">
        <span className="paper grid size-16 flex-none place-items-center border border-line bg-tint p-2.5">
          <img src={logo} alt={`${name} logo`} width={logoSize[0]} height={logoSize[1]} className="size-full object-contain" />
        </span>
        <p className="font-product text-[1.75rem] leading-none font-bold tracking-[-0.02em] text-accent-ink">
          {name}
          <small className="mt-2 block font-sans text-[0.875rem] font-medium tracking-normal text-text-2">{byline}</small>
        </p>
      </div>
      <h1 id="hero-title" className="max-w-[16ch] font-product text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.05] font-bold tracking-[-0.035em] text-accent-ink">
        <BlurText text={title} em={em} />
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

/** The other two products, each already wearing its own accent, tint and display face. */
function Others({ slug }) {
  const { t } = useLang()
  return (
    <nav className="border-t border-line" aria-label={t('Outros projetos', 'Other projects')}>
      <div className="wrap grid md:grid-cols-2">
        {Object.entries(PROJECTS).filter(([key]) => key !== slug).map(([key, p]) => (
          <Spotlight
            as="a"
            key={key}
            href={`/projetos/${key}/`}
            {...themeOf(key)}
            className="group flex items-center gap-5 border-b border-line py-8 no-underline last:border-b-0 md:border-b-0 md:px-8 md:py-12 md:first:border-r md:first:pl-0 md:last:pr-0"
          >
            <img src={p.logo} alt="" width={p.size[0]} height={p.size[1]} loading="lazy" className="paper size-16 flex-none border border-line bg-tint object-contain p-2.5" />
            <span className="min-w-0 flex-1">
              <span className="block font-product text-[1.5rem] leading-tight font-bold tracking-[-0.02em] text-accent-ink">{p.name}</span>
              <span className="mt-1 block text-[0.9375rem] leading-snug text-text-2">{t(...p.kind)}</span>
            </span>
            <span className="flex-none text-accent transition-transform duration-300 ease-out-expo group-hover:translate-x-1 [&>svg]:size-5"><Arrow /></span>
          </Spotlight>
        ))}
      </div>
    </nav>
  )
}

/** Four facts on hairlines; numbers count up once (React Bits Count Up). items: [value, decimals, suffix, label] */
export function Facts({ items }) {
  const { t } = useLang()
  return (
    <section className="border-y border-line bg-surface" aria-label={t('Números', 'Facts')}>
      <dl className="wrap grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:grid-cols-4 md:py-14">
        {items.map(([value, decimals, suffix, label], i) => (
          <div key={i} className="border-t border-line-2 pt-5">
            <dt className="font-product text-[2.25rem] leading-none font-bold tracking-[-0.03em] text-accent-ink tabular-nums">
              <CountUp to={value} decimals={decimals} />{suffix}
            </dt>
            <dd className="mt-3 text-[0.9375rem] leading-relaxed text-text-2">{label}</dd>
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
          <span aria-hidden="true" className="mt-[0.7em] size-1.5 bg-accent" />
          <span>{lead && <strong className="font-semibold text-ink">{lead}</strong>}{lead && detail && ' · '}{detail}</span>
        </li>
      ))}
    </ul>
  )
}

export function Close({ title, lead }) {
  return (
    <section className="section border-t border-line bg-tint" aria-labelledby="close-title">
      <div className="wrap flex flex-col items-start justify-between gap-9 md:flex-row md:items-end">
        <div className="max-w-[680px]">
          <H2 id="close-title">{title}</H2>
          <p className="lead mt-6">{lead}</p>
        </div>
        <a className="btn flex-none" href="/#contato"><T pt="Falar com a NOXXD" en="Talk to NOXXD" /><Arrow /></a>
      </div>
    </section>
  )
}
