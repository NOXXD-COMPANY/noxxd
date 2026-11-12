import { useEffect, useRef, useState } from 'react'
import { mount } from '../mount.jsx'
import { T, useLang } from '../lang.jsx'
import { Faq, Scramble, Shot } from '../ui.jsx'
import { Close, Facts, H2, Hero, Points, ProjectPage } from '../project.jsx'

// SIGAC traffic light and ASO states, muted
const C = { ok: '#4F7A4A', due: '#9A6E1F', late: '#A2483E', requested: '#5B5F97', booked: '#3F6E8C', pending: '#78716C' }

const DUE = [6, 12, 33]
const LATE = [18, 35]
const NRS = Array.from({ length: 35 }, (_, i) => {
  const n = i + 1
  return { n: String(n).padStart(2, '0'), status: LATE.includes(n) ? 'late' : DUE.includes(n) ? 'due' : 'ok' }
})

function Matrix() {
  const { t } = useLang()
  const [show, setShow] = useState('all')
  const filters = [
    ['all', t('Todas', 'All'), C.pending],
    ['ok', t('Em dia', 'Up to date'), C.ok],
    ['due', t('A vencer', 'Due soon'), C.due],
    ['late', t('Vencido', 'Expired'), C.late],
  ]
  return (
    <figure className="card p-5 md:p-6" aria-labelledby="matrix-cap">
      <figcaption className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <strong id="matrix-cap" className="h-display"><T pt="Matriz de treinamentos" en="Training matrix" /></strong>
        <span className="font-mono text-xs whitespace-nowrap text-text-2">NR-01 — NR-35</span>
      </figcaption>
      <p className="sr-only">
        <T pt="Demonstração: 30 normas em dia; NR-06, NR-12 e NR-33 a vencer; NR-18 e NR-35 vencidas." en="Demo: 30 standards up to date; NR-06, NR-12 and NR-33 due soon; NR-18 and NR-35 expired." />
      </p>
      <ol className="grid grid-cols-7 gap-1.5" aria-hidden="true">
        {NRS.map(({ n, status }) => (
          <li
            key={n}
            className={`grid aspect-square place-items-center rounded-sm font-mono text-xs transition-opacity duration-(--dur-2) ${status === 'ok' ? 'tone' : 'text-white'}`}
            // only exceptions are solid; compliant standards stay a quiet tint
            style={{ '--l': '#3D5F39', '--d': '#A9CDA3', background: status === 'ok' ? undefined : C[status], opacity: show === 'all' || show === status ? 1 : 0.15 }}
          >
            {n}
          </li>
        ))}
      </ol>
      <div className="mt-5 flex flex-wrap items-center gap-1.5" role="group" aria-label={t('Filtrar normas', 'Filter standards')}>
        {filters.map(([key, label, color]) => (
          <button
            key={key}
            type="button"
            aria-pressed={show === key}
            onClick={() => setShow(key)}
            className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-3 text-xs font-semibold transition-colors duration-(--dur-1) ${
              show === key ? 'border-ink bg-ink text-bg' : 'border-line-2 text-text-2 hover:text-ink'
            }`}
          >
            <i aria-hidden="true" className="size-2 rounded-xs" style={{ background: color }} />
            {label}
          </button>
        ))}
        <em className="ml-auto text-xs text-text-2 not-italic"><T pt="Dados ilustrativos" en="Illustrative data" /></em>
      </div>
    </figure>
  )
}

// The preventive window, hands-on: drag the days left on one exam and its state follows the NR-07 traffic light.
function Feed({ items }) {
  const { t } = useLang()
  const [days, setDays] = useState(45)
  const state = days < 0 ? 'late' : days <= 30 ? 'due' : 'ok'
  const label = { ok: t('Em Dia', 'Up to Date'), due: t('A Vencer', 'Due Soon'), late: t('Vencido', 'Expired') }[state]
  const detail = days < 0
    ? t(`Venceu há ${-days} dia${days === -1 ? '' : 's'} · inconformidade com a NR-07`, `Expired ${-days} day${days === -1 ? '' : 's'} ago · NR-07 non-compliance`)
    : t(`Vence em ${days} dia${days === 1 ? '' : 's'} · Metalúrgica Vale Azul`, `Due in ${days} day${days === 1 ? '' : 's'} · Metalúrgica Vale Azul`)
  return (
    <div>
      <label className="card block p-5">
        <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <span className="font-semibold text-ink"><T pt="Dias até o vencimento do ASO" en="Days until the exam expires" /></span>
          <output className="font-product text-h3 leading-none font-semibold text-accent-ink tabular-nums">{days}</output>
        </span>
        <input
          type="range"
          min="-15"
          max="60"
          value={days}
          onChange={(event) => setDays(Number(event.target.value))}
          aria-valuetext={`${days} · ${label}`}
          className="range mt-4 w-full"
          style={{ '--range': C[state] }}
        />
        <span className="mt-2 flex justify-between text-xs text-text-2" aria-hidden="true">
          <span><T pt="Vencido" en="Expired" /></span>
          <span><T pt="janela de 30 dias" en="30-day window" /></span>
          <span><T pt="Em dia" en="Up to date" /></span>
        </span>
      </label>
      <ul className="mt-5 border-t border-line" aria-label={t('Alertas', 'Alerts')}>
        <li key={state} className="grid animate-[feed-in_0.6s_var(--ease-out-expo)] grid-cols-[10px_1fr_auto] items-start gap-4 border-b border-line py-4">
          <i aria-hidden="true" className="mt-2 size-2.5" style={{ background: C[state] }} />
          <span>
            <strong className="block font-semibold text-ink"><T pt="ASO periódico" en="Periodic exam" /> · Igor Batista</strong>
            <small className="text-sm text-text-2">{detail}</small>
          </span>
          <b className="px-2.5 py-1 text-xs whitespace-nowrap text-white" style={{ background: C[state] }}>{label}</b>
        </li>
        {items.map(([title, detail, color]) => (
          <li key={title} className="grid grid-cols-[10px_1fr] gap-4 border-b border-line py-4">
            <i aria-hidden="true" className="mt-2 size-2.5" style={{ background: color }} />
            <span>
              <strong className="block font-semibold text-ink">{title}</strong>
              <small className="text-sm text-text-2">{detail}</small>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const b64 = (bytes) => btoa(String.fromCharCode(...bytes))

// The claim, run for real: this field is encrypted with AES-GCM 256 by the Web Crypto API in this very browser.
// The key is generated here, never leaves the tab and is thrown away with it.
function Cipher() {
  const { t } = useLang()
  const [code, setCode] = useState('M54.5')
  const [out, setOut] = useState({ iv: 'q3Z9rT0bWm1xYc2K', ct: '8fJ2pL0vQe7nR4sT1wXk9uZb6yHc3mAd', live: false }) // prerendered placeholder
  const key = useRef(null)
  useEffect(() => {
    let current = true
    const run = async () => {
      key.current ||= await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt'])
      const iv = crypto.getRandomValues(new Uint8Array(12))
      const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key.current, new TextEncoder().encode(code))
      if (current) setOut({ iv: b64(iv), ct: b64(new Uint8Array(ct)), live: true })
    }
    run().catch(() => {}) // no Web Crypto (insecure origin, old browser): the illustrative values stay
    return () => {
      current = false
    }
  }, [code])
  return (
    <div className="card p-6 font-mono text-sm md:p-8">
      <label className="block">
        <span className="font-sans text-xs font-semibold text-text-2"><T pt="Campo no formulário (edite)" en="Form field (edit it)" /></span>
        <span className="mt-2 flex items-center rounded-md border border-line-2 bg-surface px-4 text-ink focus-within:border-accent">
          cid10:&nbsp;
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            maxLength={8}
            spellCheck={false}
            autoComplete="off"
            className="min-h-12 w-full bg-transparent outline-none"
          />
        </span>
      </label>
      <p className="my-5 flex items-center gap-3 text-accent">
        <span aria-hidden="true" className="h-px flex-1 bg-accent/40" />
        AES-GCM · 256 bits
        <span aria-hidden="true" className="h-px flex-1 bg-accent/40" />
      </p>
      <p className="font-sans text-xs font-semibold text-text-2"><T pt="Gravado no banco" en="Stored in the database" /></p>
      <p className="mt-2 rounded-sm bg-surface px-4 py-3 break-all text-ink">
        iv: "<Scramble text={out.iv} />"<br />ct: "<Scramble text={out.ct} />"
      </p>
      <p className="mt-4 font-sans text-xs text-text-2">
        {out.live
          ? t('Cifrado agora, neste navegador, com uma chave descartável.', 'Encrypted just now, in this browser, with a throwaway key.')
          : t('Valores ilustrativos.', 'Illustrative values.')}
      </p>
    </div>
  )
}

const norm = (text) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// Command palette demo: live filter over demo data, Ctrl/Cmd + K focuses the field
function Palette({ items }) {
  const { t } = useLang()
  const [query, setQuery] = useState('')
  const input = useRef(null)
  useEffect(() => {
    const onKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        input.current.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])
  const q = norm(query.trim())
  const hits = items.filter(([title, detail]) => !q || norm(`${title} ${detail}`).includes(q))
  return (
    <div className="card overflow-hidden">
      <label className="flex items-center gap-3 border-b border-line px-4">
        <svg viewBox="0 0 24 24" className="size-5 flex-none text-text-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
          <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
        </svg>
        <span className="sr-only">{t('Buscar', 'Search')}</span>
        <input
          ref={input}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('Beatriz, NR-35, clínica…', 'Beatriz, NR-35, clinic…')}
          autoComplete="off"
          className="min-h-14 w-full bg-transparent text-base text-ink -outline-offset-2 placeholder:text-text-2"
        />
      </label>
      <ul aria-label={t('Resultados', 'Results')}>
        {hits.map(([title, detail, color]) => (
          <li key={title} className="grid grid-cols-[10px_1fr] gap-4 border-b border-line px-4 py-3 last:border-b-0">
            <i aria-hidden="true" className="mt-2 size-2.5" style={{ background: color }} />
            <span>
              <strong className="block text-md font-semibold text-ink">{title}</strong>
              <small className="text-xs text-text-2">{detail}</small>
            </span>
          </li>
        ))}
      </ul>
      <p className="sr-only" aria-live="polite">{t(`${hits.length} resultado${hits.length === 1 ? '' : 's'}`, `${hits.length} result${hits.length === 1 ? '' : 's'}`)}</p>
      {!hits.length && <p className="px-4 py-6 text-md text-text-2"><T pt="Nada encontrado nos dados de demonstração." en="Nothing found in the demo data." /></p>}
      <p className="flex justify-between border-t border-line bg-surface px-4 py-2 text-xs text-text-2">
        <span><kbd>Ctrl</kbd> + <kbd>K</kbd></span>
        <T pt="Dados fictícios" en="Demo data" />
      </p>
    </div>
  )
}

function SIGAC() {
  const { t } = useLang()
  const kbd = (
    <>
      <kbd>Ctrl</kbd> + <kbd>K</kbd>
    </>
  )
  return (
    <ProjectPage slug="sigac">
      <Hero
        logo="/assets/projetos/sigac/logo.svg"
        logoSize={[120, 120]}
        name="SIGAC"
        byline={t('Central de SST que sustenta o SIGAC · desenvolvida pela NOXXD', 'The OHS hub behind SIGAC · built by NOXXD')}
        title={t('Nenhum ASO vence', 'No medical exam expires')}
        em={t('sem aviso.', 'unnoticed.')}
        lead={t(
          'Saúde e Segurança do Trabalho em uma única central: ciclo completo do ASO, matriz de treinamentos das NRs, fechamento mensal de folha e absenteísmo, com dados clínicos criptografados no próprio navegador.',
          'Occupational health and safety in a single hub: the full medical-exam (ASO) cycle, the regulatory training matrix, monthly payroll closing and absenteeism, with clinical data encrypted right in the browser.',
        )}
        secondary={['#modulos', t('Ver os módulos', 'See the modules')]}
      >
        <div className="mt-16 grid gap-10 border-t border-line pt-10 md:grid-cols-[1fr_1.1fr] md:gap-16">
          <div className="grid content-start gap-6">
            {[
              [t('Em Dia', 'Up to Date'), t('Exame válido, aptidão ocupacional regularizada.', 'Valid exam, occupational fitness confirmed.'), C.ok],
              [t('A Vencer', 'Due Soon'), t('Janela preventiva de 30 dias antes do vencimento normativo.', 'A 30-day preventive window before the regulatory deadline.'), C.due],
              [t('Vencido', 'Expired'), t('ASO expirado: inconformidade imediata com a NR-07, sinalizada no painel.', 'Expired exam: immediate NR-07 non-compliance, flagged on the dashboard.'), C.late],
            ].map(([title, text, color]) => (
              <div key={title} className="grid grid-cols-[12px_1fr] gap-4">
                <i aria-hidden="true" className="mt-2 size-3" style={{ background: color }} />
                <div>
                  <p className="h-display text-xl">{title}</p>
                  <p className="text-text-2">{text}</p>
                </div>
              </div>
            ))}
          </div>
          <Matrix />
        </div>
      </Hero>

      <section className="section border-t border-line" aria-labelledby="cycle-title">
        <div data-reveal className="wrap">
          <H2 id="cycle-title">{t('O ciclo do ASO, de ponta a ponta (NR-07)', 'The full medical-exam cycle (NR-07)')}</H2>
          <p className="lead mt-6">
            <T
              pt="Cada colaborador tem um estado claro em todas as telas: ficha, exames complementares e painel analítico falam a mesma língua de cores."
              en="Every employee has a clear state on every screen: profile, complementary exams and analytics share the same color language."
            />
          </p>
          <ol className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6" data-stagger>
            {[
              [t('Solicitado', 'Requested'), t('Guia de encaminhamento gerada no sistema.', 'Referral form generated in the system.'), C.requested],
              [t('Agendado', 'Scheduled'), t('Consulta marcada em clínica credenciada.', 'Appointment booked at an accredited clinic.'), C.booked],
              [t('Pendente', 'Pending'), t('Aguardando exame complementar ou laudo.', 'Awaiting a complementary exam or report.'), C.pending],
              [t('Em Dia', 'Up to Date'), t('Aptidão regularizada.', 'Fitness confirmed.'), C.ok],
              [t('A Vencer', 'Due Soon'), t('30 dias para agir.', '30 days to act.'), C.due],
              [t('Vencido', 'Expired'), t('Prioridade imediata.', 'Immediate priority.'), C.late],
            ].map(([title, text, color]) => (
              <li key={title} className="border-t-2 pt-4" style={{ borderColor: color }}>
                <strong className="block h-display">{title}</strong>
                <span className="text-md text-text-2">{text}</span>
              </li>
            ))}
          </ol>
          <Shot
            className="mt-14"
            src="/assets/projetos/sigac/screens/ficha-colaborador.webp"
            alt={t('SIGAC: ficha do funcionário com dados, NRs aplicáveis e histórico de ASOs', 'SIGAC: employee profile with details, applicable NRs and exam history')}
            width={1440}
            height={900}
            url="/funcionarios/func_003"
            caption={t('Ficha do funcionário: vínculo, NRs aplicáveis e histórico de ASOs com status', 'Employee profile: employment, applicable NRs and exam history with status')}
          />
        </div>
      </section>

      <Facts
        items={[
          [35, 0, '', t('normas regulamentadoras na matriz de treinamentos', 'regulatory standards in the training matrix')],
          [30, 0, ' d', t('de janela preventiva antes de um ASO vencer', 'preventive window before an exam expires')],
          [6, 0, '', t('estados no ciclo do ASO, do pedido ao vencimento', 'states in the exam cycle, from request to expiry')],
          [0, 0, '', t('taxa de egress no armazenamento (Cloudflare R2)', 'storage egress fees (Cloudflare R2)')],
        ]}
      />

      <section className="section" aria-labelledby="feed-title">
        <div data-stagger className="wrap grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <div>
            <H2 id="feed-title">{t('O alerta chega antes do vencimento', 'The alert arrives before the deadline')}</H2>
            <p className="lead mt-6">
              <T
                pt="Exames, treinamentos e guias mudam de estado e aparecem para a equipe de SST na hora, com a cor do semáforo."
                en="Exams, training and referrals change state and reach the OHS team right away, in traffic-light colour."
              />
            </p>
            <p className="mt-4 text-sm text-text-2"><T pt="Dados fictícios" en="Demo data" /></p>
          </div>
          <Feed
            items={[
              ['NR-35 · Helena Campos', t('Treinamento vencido · Agro Sertão Verde', 'Training expired · Agro Sertão Verde'), C.late],
              ['ASO admissional · Kléber Ramos', t('Agendado na Clínica Ocupacional Vida', 'Booked at Clínica Ocupacional Vida'), C.booked],
              ['ASO periódico · Beatriz Pinto', t('Laudo anexado, aptidão em dia', 'Report attached, fitness confirmed'), C.ok],
              ['Guia de encaminhamento · Luana Freitas', t('Solicitada para exame complementar', 'Requested for a complementary exam'), C.requested],
            ]}
          />
        </div>
      </section>

      <section id="modulos" className="section border-t border-line" aria-labelledby="mod-title">
        <div data-reveal className="wrap">
          <H2 id="mod-title">{t('Uma central para toda a operação de SST', 'One hub for the whole OHS operation')}</H2>
          <div className="mt-12 grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
            <Shot
              src="/assets/projetos/sigac/screens/dashboard.webp"
              alt={t('SIGAC: painel de conformidade com ASOs vencidos, a vencer e gráfico de vencimentos', 'SIGAC: compliance dashboard with expired and due exams and an expiry chart')}
              width={1440}
              height={900}
              url="/dashboard"
              caption={t('Painel de conformidade: situação dos ASOs, filtros por empresa e próximos vencimentos', 'Compliance dashboard: exam status, company filters and upcoming expirations')}
            />
            <dl className="border-t border-line">
              {[
                [t('Gestão do ASO', 'Medical exam management'), t('Ciclo de vida completo do ASO, exames complementares e ficha do colaborador, com folhas A4 normativas geradas no cliente via jsPDF.', 'The full exam lifecycle, complementary exams and employee profile, with regulatory A4 sheets rendered client-side with jsPDF.')],
                [t('Matriz de treinamentos', 'Training matrix'), t('Treinamentos da NR-01 à NR-35 organizados em uma matriz por colaborador.', 'Training from NR-01 to NR-35 organized in a per-employee matrix.')],
                [t('Folha e absenteísmo', 'Payroll and absenteeism'), t('Fechamento mensal de folha e acompanhamento de absenteísmo, com indicadores visuais em Recharts.', 'Monthly payroll closing and absenteeism tracking, with visual indicators in Recharts.')],
                [t('Busca global SIGAC', 'SIGAC global search'), <>{t('Colaboradores, exames e clínicas em uma janela acionada por', 'Employees, exams and clinics in one window opened with')} {kbd}{t(', de qualquer tela.', ', from any screen.')}</>],
              ].map(([dt, dd]) => (
                <div key={dt} className="border-b border-line py-5">
                  <dt className="h-display text-lg">{dt}</dt>
                  <dd className="mt-1 text-text-2">{dd}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="section border-t border-line bg-surface" aria-labelledby="pal-title">
        <div data-stagger className="wrap grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <div>
            <H2 id="pal-title">{t('Experimente a busca global', 'Try the global search')}</H2>
            <p className="lead mt-6">
              {t('No sistema,', 'In the system,')} {kbd} {t('abre a busca de qualquer tela. Aqui ela também funciona: digite um nome, uma NR ou uma clínica.', 'opens search from any screen. It works here too: type a name, an NR or a clinic.')}
            </p>
          </div>
          <Palette
            items={[
              ['Beatriz Pinto', t('Colaboradora · Pedreiro · Construtora Horizonte', 'Employee · Bricklayer · Construtora Horizonte'), C.ok],
              ['Igor Batista', t('Colaborador · Soldador · Metalúrgica Vale Azul', 'Employee · Welder · Metalúrgica Vale Azul'), C.due],
              ['Helena Campos', t('Colaboradora · Tratorista · Agro Sertão Verde', 'Employee · Tractor driver · Agro Sertão Verde'), C.late],
              ['ASO periódico · Mateus Ramos', t('Exame · vence em 12 dias', 'Exam · due in 12 days'), C.due],
              ['NR-35 · Trabalho em altura', t('Treinamento · 4 vencidos', 'Training · 4 expired'), C.late],
              ['Clínica Ocupacional Vida', t('Clínica credenciada · Vila Serena', 'Accredited clinic · Vila Serena'), C.pending],
            ]}
          />
        </div>
      </section>

      <section className="section border-t border-line" aria-labelledby="crypto-title">
        <div data-stagger className="wrap grid items-center gap-12 md:grid-cols-[1fr_1fr] md:gap-16">
          <div>
            <H2 id="crypto-title">{t('O CID-10 é cifrado antes de sair do navegador', 'ICD-10 codes are encrypted before they leave the browser')}</H2>
            <p className="lead mt-6">
              <T
                pt="Diagnósticos e dados sensíveis de saúde são criptografados no cliente com a Web Crypto API. O servidor guarda apenas o texto cifrado."
                en="Diagnoses and sensitive health data are encrypted client-side with the Web Crypto API. The server only ever stores ciphertext."
              />
            </p>
            <Points
              className="mt-6"
              items={[
                ['', t('AES-GCM com chave de 256 bits e autenticação integrada', 'AES-GCM with a 256-bit key and built-in authentication')],
                ['', t('Validação de entrada com Zod 4 em todos os formulários', 'Zod 4 input validation on every form')],
                ['', t('Rotas protegidas por perfil de acesso', 'Role-protected routes')],
              ]}
            />
          </div>
          <Cipher />
        </div>
      </section>

      <section className="section border-t border-line" aria-labelledby="stack-title">
        <div data-reveal className="wrap">
          <H2 id="stack-title">{t('Arquitetura de custo zero', 'Zero-cost architecture')}</H2>
          <p className="lead mt-6">
            <T
              pt="Uma SPA client-centric que roda em infraestrutura serverless, sem servidor dedicado para manter e sem taxa de saída de dados."
              en="A client-centric SPA running on serverless infrastructure, with no dedicated server to maintain and no data-egress fees."
            />
          </p>
          <dl className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
            {[
              ['React 19', '+ Vite 8', t('Rotas com React Router 7, cache com TanStack Query e carregamento sob demanda com retry.', 'React Router 7 routes, TanStack Query caching and lazy loading with retry.')],
              ['Tailwind v4', 'CSS-first @theme', t('Tokens de marca e semáforo SST declarados direto no CSS, sem config em JavaScript.', 'Brand and OHS status tokens declared straight in CSS, no JavaScript config.')],
              ['Firebase', 'serverless', t('Backend serverless: nenhum servidor próprio para provisionar ou corrigir.', 'Serverless backend: no server of your own to provision or patch.')],
              ['Cloudflare R2', t('sem taxa de egress', 'no egress fees'), t('Arquivos e documentos armazenados sem pagar pelo download.', 'Files and documents stored without paying for downloads.')],
            ].map(([name, sub, text]) => (
              <div key={name} className="border-t border-accent pt-5">
                <dt>
                  <b className="font-product text-xl text-accent-ink">{name}</b>
                  <small className="ml-2 font-mono text-xs text-text-2">{sub}</small>
                </dt>
                <dd className="mt-2 text-md text-text-2">{text}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 max-w-[70ch] text-md text-text-2">
            <T
              pt="Interface com zero emojis, ícones Heroicons e alto contraste estrito (anti-washout) em conformidade com WCAG AA."
              en="An interface with zero emojis, Heroicons iconography and strict anti-washout high contrast to WCAG AA."
            />
          </p>
        </div>
      </section>

      <Faq
        title={t('Perguntas frequentes', 'Frequently asked questions')}
        items={[
          [t('Preciso manter um servidor?', 'Do I need to run a server?'), t('Não. A aplicação roda em infraestrutura serverless (Firebase) e guarda arquivos no Cloudflare R2, sem taxa de saída de dados.', 'No. The app runs on serverless infrastructure (Firebase) and stores files on Cloudflare R2, with no egress fees.')],
          [t('Como a equipe sabe que um ASO vai vencer?', 'How does the team know an exam is about to expire?'), t('Pelo semáforo: 30 dias antes do vencimento o exame passa para "A Vencer" e aparece nos painéis e alertas.', 'Through the traffic light: 30 days before the deadline the exam turns "Due Soon" and shows up on dashboards and alerts.')],
          [t('Quem pode ver e editar os dados?', 'Who can see and edit the data?'), t('As rotas são protegidas por perfil de acesso (assessor, SST, supervisor) e os formulários validam cada campo antes de salvar.', 'Routes are protected by access profile (assistant, OHS, supervisor) and forms validate every field before saving.')],
          [t('Os documentos saem prontos para arquivar?', 'Do documents come out ready to file?'), t('Sim. As folhas A4 normativas são geradas no próprio navegador em PDF.', 'Yes. Regulatory A4 sheets are generated as PDF right in the browser.')],
        ]}
      />

      <Close
        title={t('Sua SST em dia, todos os dias', 'Your OHS up to date, every day')}
        lead={t(
          'Converse com a NOXXD sobre implantar o SIGAC ou construir uma central sob medida para a sua empresa.',
          'Talk to NOXXD about deploying SIGAC or building a custom hub for your company.',
        )}
      />
    </ProjectPage>
  )
}

export default SIGAC
mount(SIGAC)
