import { mount } from '../mount.jsx'
import { T, useLang } from '../lang.jsx'
import { Arrow, CountUp, EmblemBuild, Faq, Loop, RiseText, Shell } from '../ui.jsx'
import { themeOf } from '../projects.js'

const STACK = ['React 19', 'React Native', 'Expo', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vite', 'Firebase', 'Supabase', 'Leaflet', 'Recharts', 'Cloudflare R2', 'jsPDF', 'GPT-4o-mini']

// Three reasons, each taken from what the products already do.
const VALUES = [
  [
    ['Feito para o seu contexto', 'Built for your context'],
    ['Cada produto nasce com identidade própria: tom, tipografia e interface pensados para quem vai usar.', 'Every product gets an identity of its own: tone, typography and interface designed for the people who will use it.'],
  ],
  [
    ['Conformidade desde o projeto', 'Compliance by design'],
    ['LGPD, Lei do Governo Digital, normas regulamentadoras e resoluções do CFP entram no desenho, não no remendo.', "LGPD, Brazil's Digital Government Act, workplace safety standards and CFP resolutions are designed in, not patched on."],
  ],
  [
    ['Produtos reais em operação', 'Real products in operation'],
    ['Urbis, HealthSearch e CARITAS mostram como trabalhamos: do app do cidadão ao prontuário clínico.', 'Urbis, HealthSearch and CARITAS show how we work: from a citizen app to a clinical record.'],
  ],
]

const SERVICES = [
  {
    title: ['Criação de Sites e Landing Pages', 'Websites & Landing Pages'],
    text: [
      'Desenvolvimento web moderno, totalmente responsivo e otimizado para motores de busca (SEO) e alta taxa de conversão. Construímos sites institucionais e landing pages de alto padrão visual com identidade própria.',
      'Modern, fully responsive web development optimized for search engines (SEO) and high conversion rates. We build corporate websites and premium landing pages with an identity of their own.',
    ],
    cta: ['Solicitar orçamento', 'Request a quote'],
  },
  {
    title: ['Sistemas Web e SaaS', 'Web Systems & SaaS'],
    text: [
      'Arquitetura e programação de plataformas multi-tenant (SaaS), aplicativos em nuvem e painéis de controle empresariais. Código escalável, controle de acesso seguro e integrações fluidas via APIs REST e GraphQL.',
      'Architecture and development of multi-tenant SaaS platforms, cloud applications, and enterprise dashboards. Scalable code, secure access control, and seamless REST/GraphQL API integrations.',
    ],
    cta: ['Construir sistema', 'Build a system'],
  },
  {
    title: ['Consultoria em Tecnologia', 'Technology Consulting'],
    text: [
      'Auditoria técnica de arquitetura, modernização de sistemas legados, estratégias de migração em nuvem e planejamento tecnológico personalizado para prefeituras, órgãos públicos e empresas inovadoras.',
      'Technical architecture audits, legacy system modernization, cloud migration strategies, and tailored technology planning for municipalities, public entities, and innovative enterprises.',
    ],
    cta: ['Falar com especialista', 'Talk to an expert'],
  },
]

// shot / phone: [file, width, height, [alt pt, alt en]]; every screenshot has a half-width "-sm" twin.
const PROJECT_ROWS = [
  {
    slug: 'urbis',
    name: 'Urbis',
    logo: '/assets/projetos/urbis/logo.svg',
    size: [120, 120],
    shot: ['/assets/projetos/urbis/screens/painel-dashboard.webp', 1440, 900, ['Painel web do Urbis: KPIs e mapa de calor de ocorrências', 'Urbis web dashboard: KPIs and report heatmap']],
    phone: ['/assets/projetos/urbis/screens/app-relatar.webp', 780, 1688, ['App do cidadão Urbis: tela Nova Ocorrência', 'Urbis citizen app: New Report screen']],
    tags: [['GovTech', 'GovTech'], ['App + Painel Web', 'App + Web Dashboard']],
    summary: [
      'Zeladoria urbana para prefeituras: o cidadão relata com foto, áudio e geolocalização exata, e a gestão municipal decide pelo mapa de calor.',
      'Urban maintenance for city halls: citizens report with photos, audio and exact geolocation, and city managers decide from a live heatmap.',
    ],
    stack: 'React Native · Expo 54 · Next.js 14 · Leaflet · Recharts',
    metric: [['Lei 14.129/2021', 'Law 14.129/2021'], ['Governo Digital + LGPD', 'Digital Government + LGPD']],
  },
  {
    slug: 'healthsearch',
    name: 'HealthSearch',
    logo: '/assets/projetos/healthsearch/logo.svg',
    size: [120, 120],
    shot: ['/assets/projetos/healthsearch/screens/dashboard.webp', 1440, 900, ['HealthSearch: painel de conformidade com a situação dos ASOs', 'HealthSearch: compliance dashboard with medical-exam status']],
    tags: [['SST / RH', 'OHS / HR'], ['SaaS', 'SaaS']],
    summary: [
      'Central de Saúde e Segurança do Trabalho que sustenta o SIGAC: ciclo do ASO (NR-07), matriz de NR-01 a NR-35, folha e absenteísmo.',
      'Occupational health and safety hub behind SIGAC: medical-exam cycle (NR-07), NR-01 to NR-35 training matrix, payroll and absenteeism.',
    ],
    stack: 'React 19 · Tailwind v4 · Firebase · Cloudflare R2',
    metric: [['AES-GCM 256 bits', 'AES-GCM 256 bits'], ['CID-10 cifrado no navegador', 'ICD-10 encrypted in the browser']],
  },
  {
    slug: 'caritas',
    name: 'CARITAS',
    logo: '/assets/projetos/caritas/logo.svg',
    size: [400, 400],
    shot: ['/assets/projetos/caritas/screens/sessao.webp', 1440, 900, ['CARITAS: prontuário da paciente com evolução do humor e notas de sessão', 'CARITAS: patient record with mood trend and session notes']],
    tags: [['HealthTech', 'HealthTech'], ['Psicologia', 'Psychology']],
    summary: [
      'Prontuário psicológico seguro com anamnese, resumo clínico por I.A., documentos CFP, agenda com link público e cobrança via PIX.',
      'Secure psychological records with structured intake, AI clinical summaries, CFP documents, a public booking link and PIX billing.',
    ],
    stack: 'React 19 · Vite 8 · Tailwind · GPT-4o-mini · jsPDF',
    metric: [['4,55 / 5', '4.55 / 5'], ['em heurísticas de Nielsen', 'on Nielsen heuristics']],
  },
]

const STEPS = [
  [['Diagnóstico', 'Discovery'], ['Entendemos o problema, o público e as regras do seu setor antes de propor qualquer tela.', "We learn the problem, the audience and your sector's rules before proposing a single screen."]],
  [['Design', 'Design'], ['Protótipos de alta fidelidade com identidade própria, validados com você.', 'High-fidelity prototypes with an identity of their own, validated with you.']],
  [['Engenharia', 'Engineering'], ['Desenvolvimento ágil sobre arquitetura limpa, com entregas que você acompanha.', 'Agile development on clean architecture, with deliveries you can follow.']],
  [['Operação', 'Operation'], ['Publicação, ajustes e evolução contínua com o sistema em uso.', 'Launch, fine-tuning and continuous evolution with the system in use.']],
]

// Every number already appears on a project page or in the contact terms: [value, decimals, suffix, label]
const PROOF = [
  [3, 0, '', ['produtos próprios no portfólio', 'own products in the portfolio']],
  [4.55, 2, ' / 5', ['nota do CARITAS em heurísticas de Nielsen', 'CARITAS score on Nielsen heuristics']],
  [256, 0, ' bits', ['de criptografia AES-GCM no navegador (HealthSearch)', 'of in-browser AES-GCM encryption (HealthSearch)']],
  [24, 0, ' h', ['úteis para responder solicitações técnicas e comerciais', 'business hours to answer technical and commercial inquiries']],
]

const FAQ = [
  [
    ['A NOXXD atende órgãos públicos e empresas privadas?', 'Does NOXXD work with both public bodies and private companies?'],
    ['Sim. Desenvolvemos soluções sob medida para prefeituras, órgãos públicos e empresas privadas.', 'Yes. We build custom solutions for city halls, public bodies and private companies.'],
  ],
  [
    ['O que a NOXXD desenvolve?', 'What does NOXXD build?'],
    ['Sites institucionais e landing pages, sistemas web e plataformas SaaS, além de consultoria em tecnologia.', 'Corporate websites and landing pages, web systems and SaaS platforms, plus technology consulting.'],
  ],
  [
    ['Posso ver uma demonstração dos produtos?', 'Can I see a demo of the products?'],
    ['Sim. Agendamos uma apresentação aprofundada do Urbis, do HealthSearch ou do CARITAS.', 'Yes. We schedule an in-depth demo of Urbis, HealthSearch or CARITAS.'],
  ],
  [
    ['Em quanto tempo vocês respondem?', 'How quickly do you reply?'],
    ['Respondemos solicitações técnicas e comerciais em até 24 horas úteis, de segunda a sexta-feira, das 09h às 18h (horário de Brasília).', 'We respond to technical and commercial inquiries within 24 business hours, Monday to Friday, 9:00 AM to 6:00 PM (BRT).'],
  ],
]

const MAIL = 'mailto:contato@noxxd.com.br'
const WA = 'https://wa.me/5575981802188'

function SectionHead({ id, title, lead }) {
  return (
    <div className="mb-12 max-w-(--container-measure) md:mb-16" data-reveal>
      <h2 id={id} className="h-display text-h2">{title}</h2>
      <p className="lead mt-5">{lead}</p>
    </div>
  )
}

const srcSet = ([src, width]) => `${src.replace('.webp', '-sm.webp')} ${width / 2}w, ${src} ${width}w`

// One product panel in its own theme: lockup, facts, and the real screen rising from the bottom edge.
// The button's hit area covers the whole panel.
function ProjectPanel({ p, wide }) {
  const { t } = useLang()
  const frame = 'h-auto rounded-t-lg border border-b-0 border-line-2 shadow-3 transition-transform duration-(--dur-3) ease-out-expo'
  return (
    <article
      className={`${themeOf(p.slug)} spot group flex flex-col rounded-xl border border-line bg-tint ${wide ? 'lg:col-span-2 lg:grid lg:grid-cols-[5fr_7fr]' : ''}`}
    >
      <div className="flex flex-col items-start p-6 md:p-10">
        <div className="flex items-center gap-4">
          {/* the plate stays light in both themes so every product logo keeps its contrast */}
          <span className="grid size-14 flex-none place-items-center rounded-md border border-line bg-raised p-2 scope-light shadow-1">
            <img src={p.logo} alt="" width={p.size[0]} height={p.size[1]} loading="lazy" className="size-full object-contain" />
          </span>
          <h3 className="h-display text-h2">{p.name}</h3>
        </div>
        <ul className="mt-6 flex flex-wrap gap-1.5">
          {p.tags.map((tag) => <li key={tag[0]} className="chip chip-line">{t(...tag)}</li>)}
        </ul>
        <p className="mt-5 max-w-[52ch]">{t(...p.summary)}</p>
        <p className="mt-3 font-mono text-sm text-text-2">{p.stack}</p>
        <p className="mt-3 text-md text-text-2 tabular-nums">
          <strong className="font-semibold text-accent">{t(...p.metric[0])}</strong> {t(...p.metric[1])}
        </p>
        <a href={`/projetos/${p.slug}/`} className="btn btn-cover mt-8">
          <T pt="Ver projeto" en="View project" /><span className="sr-only"> {p.name}</span><Arrow />
        </a>
      </div>
      <div className={`relative mt-auto px-6 md:px-10 ${wide ? 'lg:self-end lg:pt-10 lg:pr-0 lg:pl-6' : ''}`}>
        <img
          src={p.shot[0]}
          srcSet={srcSet(p.shot)}
          sizes="(min-width: 1024px) 50vw, 100vw"
          alt={t(...p.shot[3])}
          width={p.shot[1]}
          height={p.shot[2]}
          loading="lazy"
          decoding="async"
          className={`block w-full translate-y-2 group-hover:translate-y-0 ${frame} ${wide ? 'lg:rounded-tr-none lg:border-r-0' : ''}`}
        />
        {p.phone && (
          <img
            src={p.phone[0]}
            srcSet={srcSet(p.phone)}
            sizes="160px"
            alt={t(...p.phone[3])}
            width={p.phone[1]}
            height={p.phone[2]}
            loading="lazy"
            decoding="async"
            className={`absolute bottom-0 left-2 w-[22%] translate-y-6 delay-75 group-hover:translate-y-3 md:left-4 lg:-left-2 ${frame}`}
          />
        )}
        <span className="chip absolute right-8 bottom-4 bg-raised text-ink shadow-2 md:right-12"><T pt="Dados fictícios" en="Demo data" /></span>
      </div>
    </article>
  )
}

function Home() {
  const { t } = useLang()
  const links = [
    { href: '#servicos', label: t('Serviços', 'Services') },
    { href: '#projetos', label: t('Projetos', 'Projects') },
    { href: '#processo', label: t('Processo', 'Process') },
    { href: '#faq', label: 'FAQ' },
    { href: '#contato', label: t('Contato', 'Contact') },
  ]

  return (
    <Shell links={links}>
      <section id="inicio" className="checker -mt-16 pt-16 lg:-mt-18 lg:pt-18">
        <div className="wrap grid items-end gap-10 pt-12 pb-16 md:pt-24 md:pb-24 xl:grid-cols-[minmax(0,1fr)_auto] xl:gap-16">
          <div>
            <h1 className="h-display max-w-[14ch] text-h1 tracking-normal">
              <RiseText text={t('CONSTRUA DO SEU JEITO', 'BUILD IT YOUR WAY')} />
            </h1>
            <p className="lead mt-8">
              <T
                pt="Soluções digitais de alto impacto, plataformas SaaS robustas e sistemas inteligentes sob medida para modernizar o setor público e empresas privadas."
                en="High-impact digital solutions, robust SaaS platforms, and intelligent custom systems designed to modernize public administration and private enterprises."
              />
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#projetos" className="btn"><T pt="Conheça nossos projetos" en="Explore our projects" /><Arrow /></a>
              <a href="#contato" className="btn btn-outline"><T pt="Fale conosco" en="Contact us" /></a>
            </div>
          </div>
          <EmblemBuild className="w-20 text-ink max-xl:order-first sm:w-24 xl:w-[clamp(15rem,24vw,21rem)]" />
        </div>
      </section>

      <div className="border-y border-line py-5">
        <Loop
          label="Stack"
          items={STACK}
          itemClass="px-7 font-mono text-md text-text-2 whitespace-nowrap after:ml-14 after:text-sage after:content-['/']"
          speed="56s"
        />
      </div>

      <section className="section" aria-labelledby="valor-title">
        <div className="wrap">
          <h2 id="valor-title" className="h-display max-w-[24ch] text-h2" data-reveal>
            <T pt="Tecnologia sob medida para modernizar a gestão pública e acelerar negócios." en="Custom technology to modernize public administration and accelerate business." />
          </h2>
          <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-3 md:gap-12" data-stagger>
            {VALUES.map(([title, text]) => (
              <div key={title[0]} className="border-t border-line-2 pt-6">
                <h3 className="text-lg font-semibold">{t(...title)}</h3>
                <p className="mt-3 text-text-2">{t(...text)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="servicos" className="section border-t border-line" aria-labelledby="servicos-title">
        <div className="wrap">
          <SectionHead
            id="servicos-title"
            title={t('Nossos Serviços', 'Our Services')}
            lead={t(
              'Engenharia de software ágil, arquitetura limpa e design de alta fidelidade para transformar sua visão em realidade operacional.',
              'Agile software engineering, clean architecture, and high-fidelity design to turn your vision into operational reality.',
            )}
          />
          <div className="border-t border-line" data-stagger>
            {SERVICES.map((s) => (
              <article key={s.title[0]} className="row group grid gap-4 border-b border-line py-8 lg:grid-cols-[5fr_7fr] lg:gap-16 lg:py-10">
                <h3 className="font-display text-h3">{t(...s.title)}</h3>
                <div className="max-w-(--container-measure)">
                  <p className="text-text-2">{t(...s.text)}</p>
                  <a href="#contato" className="text-link mt-3 after:absolute after:inset-0">{t(...s.cta)}<Arrow /></a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="projetos" className="section border-t border-line" aria-labelledby="projetos-title">
        <div className="wrap">
          <SectionHead
            id="projetos-title"
            title={t('Portfólio de Projetos', 'Project Portfolio')}
            lead={t(
              'Produtos reais em operação, cada um com identidade própria. Abra o caso completo de cada projeto.',
              'Real products in operation, each with its own identity. Open the full case for each project.',
            )}
          />
          <div className="grid gap-5 lg:grid-cols-2 lg:gap-6" data-stagger>
            {PROJECT_ROWS.map((p, i) => <ProjectPanel key={p.slug} p={p} wide={i === 0} />)}
          </div>
        </div>
      </section>

      <section id="processo" className="section border-t border-line" aria-labelledby="processo-title">
        <div className="wrap">
          <SectionHead
            id="processo-title"
            title={t('Como trabalhamos', 'How we work')}
            lead={t('Da primeira conversa ao sistema em operação, em quatro etapas.', 'From the first conversation to a system in operation, in four steps.')}
          />
          <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
            {STEPS.map(([title, text], i) => (
              <li key={title[0]} className="relative border-t border-line-2 pt-6 before:absolute before:-top-1 before:left-0 before:size-2 before:rounded-xs before:bg-ink">
                <span className="font-mono text-sm text-text-2">0{i + 1}</span>
                <h3 className="mt-3 font-display text-h3">{t(...title)}</h3>
                <p className="mt-3 text-md text-text-2">{t(...text)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band-night checker" aria-labelledby="prova-title">
        <div className="wrap section grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <h2 id="prova-title" className="h-display text-h2" data-reveal>
            <T pt="Números que vêm dos próprios produtos" en="Numbers that come from the products themselves" />
          </h2>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-10" data-stagger>
            {PROOF.map(([value, decimals, suffix, label]) => (
              <div key={label[0]} className="border-t border-line-2 pt-5">
                <dt className="font-display text-stat tabular-nums">
                  <CountUp to={value} decimals={decimals} /><span className="text-h3 text-text-2">{suffix}</span>
                </dt>
                <dd className="mt-3 text-md text-text-2">{t(...label)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Faq title={t('Perguntas frequentes', 'Frequently asked questions')} items={FAQ.map(([q, a]) => [t(...q), t(...a)])} />

      <section id="contato" className="section border-t border-line" aria-labelledby="contato-title">
        <div className="wrap">
          <div className="checker spot rounded-xl border border-line bg-surface p-6 md:p-14" data-reveal>
            <div className="mb-10 max-w-(--container-measure) md:mb-14">
              <h2 id="contato-title" className="h-display text-h2">{t('Fale Conosco', 'Contact Us')}</h2>
              <p className="lead mt-5">
                <T
                  pt="Pronto para construir sua próxima plataforma ou modernizar a infraestrutura da sua organização? Entre em contato direto com a equipe da NOXXD."
                  en="Ready to build your next platform or modernize your organization's digital infrastructure? Get in touch directly with the NOXXD team."
                />
              </p>
            </div>
            <div className="grid gap-12 border-t border-line-2 pt-10 lg:grid-cols-[7fr_5fr] lg:gap-16">
              <div>
                <h3 className="font-display text-h3"><T pt="Inicie seu projeto" en="Start your project" /></h3>
                <p className="mt-4 max-w-(--container-measure) text-text-2">
                  <T
                    pt="Seja para criar um novo site ou landing page de alto desempenho, construir um sistema SaaS escalável ou agendar uma apresentação aprofundada do Urbis, do HealthSearch ou do CARITAS, nossa equipe de engenharia e produto está pronta para atender seu projeto."
                    en="Whether you need a high-performance website or landing page, a scalable SaaS system, or an in-depth demo of Urbis, HealthSearch or CARITAS, our engineering team is ready to deliver."
                  />
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a href={`${MAIL}?subject=Solicita%C3%A7%C3%A3o%20de%20Proposta%20-%20NOXXD`} className="btn"><T pt="Enviar e-mail agora" en="Send email now" /><Arrow /></a>
                  <a
                    href={`${WA}?text=Ol%C3%A1%2C%20gostaria%20de%20conversar%20sobre%20as%20solu%C3%A7%C3%B5es%20da%20NOXXD.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                  >
                    <T pt="Conversar no WhatsApp" en="Chat on WhatsApp" />
                  </a>
                </div>
              </div>
              <div>
                <h3 className="font-display text-h3"><T pt="Canais diretos" en="Direct channels" /></h3>
                <dl className="mt-4">
                  <dt className="text-xs font-semibold text-text-2"><T pt="E-mail corporativo" en="Corporate email" /></dt>
                  <dd className="mb-4"><a href={MAIL} className="text-link text-lg">contato@noxxd.com.br</a></dd>
                  <dt className="text-xs font-semibold text-text-2"><T pt="WhatsApp comercial" en="Commercial WhatsApp" /></dt>
                  <dd className="mb-4"><a href={WA} target="_blank" rel="noopener noreferrer" className="text-link text-lg tabular-nums">+55 (75) 98180-2188</a></dd>
                </dl>
                <p className="text-md text-text-2">
                  <T
                    pt="Horário de atendimento: segunda a sexta-feira, das 09h às 18h (horário de Brasília). Respondemos solicitações técnicas e comerciais em até 24 horas úteis."
                    en="Business hours: Monday to Friday, 9:00 AM - 6:00 PM (BRT). We respond to technical and commercial inquiries within 24 business hours."
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  )
}

export default Home
mount(Home)
