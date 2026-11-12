import { mount } from '../mount.jsx'
import { T, useLang } from '../lang.jsx'
import { Arrow, BlurText, Footer, Header, Spotlight } from '../ui.jsx'
import { PROJECTS, themeOf } from '../projects.js'

const STACK = ['React 19', 'React Native', 'Expo', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vite', 'Firebase', 'Supabase', 'Leaflet', 'Recharts', 'Cloudflare R2', 'jsPDF', 'GPT-4o-mini']

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

const PROJECT_ROWS = [
  {
    slug: 'urbis',
    tags: [['GovTech', 'GovTech'], ['App + Painel Web', 'App + Web Dashboard']],
    summary: [
      'Zeladoria urbana para prefeituras: o cidadão relata com foto, áudio e geolocalização exata, e a gestão municipal decide pelo mapa de calor.',
      'Urban maintenance for city halls: citizens report with photos, audio and exact geolocation, and city managers decide from a live heatmap.',
    ],
    stack: 'React Native · Expo 54 · Next.js 14 · Leaflet · Recharts',
    metric: [['Lei 14.129/2021', 'Law 14.129/2021'], ['Governo Digital + LGPD', 'Digital Government + LGPD']],
  },
  {
    slug: 'sigac',
    tags: [['SST / RH', 'OHS / HR'], ['SaaS', 'SaaS']],
    summary: [
      'Sistema Integrado de Gestão Administrativa de Contratos, com central de Saúde e Segurança do Trabalho: ciclo do ASO (NR-07), matriz de NR-01 a NR-35, folha e absenteísmo.',
      'Integrated Administrative Contract Management System, with an occupational health and safety hub: medical-exam cycle (NR-07), NR-01 to NR-35 training matrix, payroll and absenteeism.',
    ],
    stack: 'React 19 · Tailwind v4 · Firebase · Cloudflare R2',
    metric: [['AES-GCM 256 bits', 'AES-GCM 256 bits'], ['CID-10 cifrado no navegador', 'ICD-10 encrypted in the browser']],
  },
  {
    slug: 'caritas',
    tags: [['HealthTech', 'HealthTech'], ['Psicologia', 'Psychology']],
    summary: [
      'Prontuário psicológico seguro com anamnese, resumo clínico por I.A., documentos CFP, agenda com link público e cobrança via PIX.',
      'Secure psychological records with structured intake, AI clinical summaries, CFP documents, a public booking link and PIX billing.',
    ],
    stack: 'React 19 · Vite 8 · Tailwind · GPT-4o-mini · jsPDF',
    metric: [['4,55 / 5', '4.55 / 5'], ['em heurísticas de Nielsen', 'on Nielsen heuristics']],
  },
]

const MAIL = 'mailto:contato@noxxd.com.br'
const WA = 'https://wa.me/5575981802188'

function SectionHead({ id, title, lead }) {
  return (
    <div className="mb-12 max-w-[680px]">
      <h2 id={id} className="font-display text-[1.875rem] leading-[1.3] font-bold tracking-[-0.015em]">{title}</h2>
      <p className="lead mt-6">{lead}</p>
    </div>
  )
}

function Home() {
  const { t } = useLang()
  const links = [
    { href: '#inicio', label: t('Início', 'Home') },
    { href: '#servicos', label: t('Serviços', 'Services') },
    { href: '#projetos', label: t('Projetos', 'Projects') },
    { href: '#contato', label: t('Contato', 'Contact') },
  ]

  return (
    <>
      <a href="#conteudo" className="btn absolute -top-16 left-3 z-[60] focus:top-3">
        <T pt="Pular para o conteúdo" en="Skip to content" />
      </a>
      <Header links={links} />

      <main id="conteudo">
        <section id="inicio" className="plate">
          <div className="wrap pt-16 pb-14 md:pt-28 md:pb-24">
          <h1 className="max-w-[14ch] font-display text-[clamp(2.4rem,6.4vw,4.75rem)] leading-[1.12] font-normal tracking-[-0.01em]">
            <BlurText text={t('CONSTRUA DO SEU JEITO', 'BUILD IT YOUR WAY')} />
          </h1>
          <p className="lead mt-9">
            <T
              pt="Soluções digitais de alto impacto, plataformas SaaS robustas e sistemas inteligentes sob medida para modernizar o setor público e empresas privadas."
              en="High-impact digital solutions, robust SaaS platforms, and intelligent custom systems designed to modernize public administration and private enterprises."
            />
          </p>
          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href="#projetos" className="btn"><T pt="Conheça nossos projetos" en="Explore our projects" /><Arrow /></a>
            <a href="#contato" className="btn btn-outline"><T pt="Fale conosco" en="Contact us" /></a>
          </div>
          </div>
        </section>

        <ul aria-label="Stack" className="wrap flex flex-wrap gap-x-6 gap-y-1 border-y border-line py-6 font-mono text-[0.9375rem] text-text-2">
          {STACK.map((tech) => (
            <li key={tech} className="after:ml-6 after:text-sage after:content-['/'] last:after:content-none">{tech}</li>
          ))}
        </ul>

        <section id="servicos" className="section" aria-labelledby="servicos-title">
          <div className="wrap">
            <SectionHead
              id="servicos-title"
              title={t('Nossos Serviços', 'Our Services')}
              lead={t(
                'Engenharia de software ágil, arquitetura limpa e design de alta fidelidade para transformar sua visão em realidade operacional.',
                'Agile software engineering, clean architecture, and high-fidelity design to turn your vision into operational reality.',
              )}
            />
            <div className="border-t border-line">
              {SERVICES.map((s) => (
                <article key={s.title[0]} className="grid gap-6 border-b border-line py-9 md:grid-cols-[5fr_7fr] md:gap-12 md:py-12">
                  <h3 className="font-display text-[1.375rem] leading-[1.4] font-normal tracking-[-0.01em]">{t(...s.title)}</h3>
                  <div className="max-w-[680px]">
                    <p className="text-text-2">{t(...s.text)}</p>
                    <a href="#contato" className="text-link mt-6 inline-block">{t(...s.cta)}</a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="projetos" className="section pt-0!" aria-labelledby="projetos-title">
          <div className="wrap">
            <SectionHead
              id="projetos-title"
              title={t('Portfólio de Projetos', 'Project Portfolio')}
              lead={t(
                'Produtos reais em operação, cada um com identidade própria. Abra o caso completo de cada projeto.',
                'Real products in operation, each with its own identity. Open the full case for each project.',
              )}
            />
            <div className="border-t border-line">
              {PROJECT_ROWS.map(({ slug, ...row }) => ({ slug, ...row, ...PROJECTS[slug] })).map((p) => (
                <Spotlight
                  as="article"
                  key={p.slug}
                  {...themeOf(p.slug)}
                  className="group grid gap-6 border-b border-line py-9 sm:grid-cols-[144px_minmax(0,1fr)] sm:gap-9 md:grid-cols-[200px_minmax(0,1fr)] md:gap-12 md:py-12"
                >
                  <a href={`/projetos/${p.slug}/`} tabIndex={-1} aria-hidden="true" className="block w-30 self-start sm:w-auto">
                    <img
                      src={p.logo}
                      alt=""
                      width={p.size[0]}
                      height={p.size[1]}
                      loading="lazy"
                      className="paper aspect-square w-full border border-line bg-tint object-contain p-4 transition-colors group-hover:border-line-2 md:p-6"
                    />
                  </a>
                  <div>
                    <h3 className="font-product text-[1.875rem] leading-[1.3] font-bold tracking-[-0.02em] text-accent-ink">{p.name}</h3>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {p.tags.map((tag) => (
                        <li key={tag[0]} className="border border-line-2 px-3 py-1 text-[0.8125rem] leading-normal font-medium text-text-2">{t(...tag)}</li>
                      ))}
                    </ul>
                    <p className="mt-6 max-w-[680px]">{t(...p.summary)}</p>
                    <p className="mt-3 font-mono text-[0.875rem] text-text-2">{p.stack}</p>
                    <p className="mt-3 text-[0.9375rem] text-text-2 tabular-nums">
                      <strong className="font-semibold text-accent">{t(...p.metric[0])}</strong> {t(...p.metric[1])}
                    </p>
                    <a href={`/projetos/${p.slug}/`} className="btn mt-6">
                      <T pt="Ver projeto" en="View project" /><span className="sr-only"> {p.name}</span><Arrow />
                    </a>
                  </div>
                </Spotlight>
              ))}
            </div>
          </div>
        </section>

        <section id="contato" className="section pt-0!" aria-labelledby="contato-title">
          <div className="wrap">
            <SectionHead
              id="contato-title"
              title={t('Fale Conosco', 'Contact Us')}
              lead={t(
                'Pronto para construir sua próxima plataforma ou modernizar a infraestrutura da sua organização? Entre em contato direto com a equipe da NOXXD.',
                "Ready to build your next platform or modernize your organization's digital infrastructure? Get in touch directly with the NOXXD team.",
              )}
            />
            <div className="grid gap-12 border-t border-line pt-12 md:grid-cols-[5fr_7fr]">
              <div>
                <h3 className="font-display text-[1.375rem] leading-[1.4] font-normal"><T pt="Canais diretos" en="Direct channels" /></h3>
                <dl className="mt-9">
                  <dt className="text-[0.8125rem] font-semibold text-text-2"><T pt="E-mail corporativo" en="Corporate email" /></dt>
                  <dd className="mb-6"><a href={MAIL} className="inline-block py-1.5 text-[1.125rem] text-ink hover:text-stone">contato@noxxd.com.br</a></dd>
                  <dt className="text-[0.8125rem] font-semibold text-text-2"><T pt="WhatsApp comercial" en="Commercial WhatsApp" /></dt>
                  <dd className="mb-6"><a href={WA} target="_blank" rel="noopener noreferrer" className="inline-block py-1.5 text-[1.125rem] text-ink hover:text-stone">+55 (75) 98180-2188</a></dd>
                </dl>
                <p className="text-[0.9375rem] leading-[1.7] text-text-2">
                  <T
                    pt="Horário de atendimento: segunda a sexta-feira, das 09h às 18h (horário de Brasília). Respondemos solicitações técnicas e comerciais em até 24 horas úteis."
                    en="Business hours: Monday to Friday, 9:00 AM - 6:00 PM (BRT). We respond to technical and commercial inquiries within 24 business hours."
                  />
                </p>
              </div>
              <div>
                <h3 className="font-display text-[1.375rem] leading-[1.4] font-normal"><T pt="Inicie seu projeto" en="Start your project" /></h3>
                <p className="mt-6 max-w-[680px] text-text-2">
                  <T
                    pt="Seja para criar um novo site ou landing page de alto desempenho, construir um sistema SaaS escalável ou agendar uma apresentação aprofundada do Urbis, do SIGAC ou do CARITAS, nossa equipe de engenharia e produto está pronta para atender seu projeto."
                    en="Whether you need a high-performance website or landing page, a scalable SaaS system, or an in-depth demo of Urbis, SIGAC or CARITAS, our engineering team is ready to deliver."
                  />
                </p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default Home
mount(Home)
