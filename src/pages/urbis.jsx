import { mount } from '../mount.jsx'
import { T, useLang } from '../lang.jsx'
import { Faq, Loop, Shot } from '../ui.jsx'
import { Close, Facts, H2, Hero, Points, ProjectPage } from '../project.jsx'

// Report statuses from the product, muted: [pt, en, ink on light, ink on dark], painted by .tone
const STATUS = {
  pendente: ['Pendente', 'Pending', '#8E3B32', '#E8A097'],
  analise: ['Em Análise', 'Under Review', '#6E5114', '#DDBE78'],
  andamento: ['Em Andamento', 'In Progress', '#2F6B7C', '#7FBBCC'],
  resolvido: ['Resolvido', 'Resolved', '#3F6B35', '#9CCB90'],
  rejeitado: ['Rejeitado', 'Rejected', '#57534E', '#B8B2AC'],
}

function Badge({ status, step }) {
  const { t } = useLang()
  const [pt, en, light, dark] = STATUS[status]
  return (
    <span
      className={`tone inline-flex items-center gap-2 rounded-sm px-3.5 py-2 text-sm font-bold whitespace-nowrap ${step !== undefined ? 'animate-step' : ''}`}
      style={{ '--l': light, '--d': dark, animationDelay: `${(step || 0) * 2.5}s` }}
    >
      <i aria-hidden="true" className="size-2 rounded-xs bg-current" />
      {t(pt, en)}
    </span>
  )
}

const CATEGORIES = [
  ['Buraco na via', 'Pothole', '#A2483E'],
  ['Acúmulo de lixo', 'Waste build-up', '#A87B2C'],
  ['Enchente', 'Flooding', '#3F6E8C'],
  ['Deslizamento', 'Landslide', '#6B5B8C'],
  ['Poluição sonora', 'Noise', '#94597A'],
  ['Vandalismo', 'Vandalism', '#78716C'],
  ['Iluminação pública', 'Street lighting', '#B07A3E'],
  ['Obras sem sinalização', 'Unsigned works', '#3F7A6E'],
]

function Urbis() {
  const { t } = useLang()
  return (
    <ProjectPage slug="urbis">
      <Hero
        logo="/assets/projetos/urbis/logo.svg"
        logoSize={[120, 120]}
        name="Urbis"
        byline={t('Plataforma GovTech · desenvolvida pela NOXXD', 'GovTech platform · built by NOXXD')}
        title={t('A cidade relata.', 'The city reports.')}
        em={t('A prefeitura resolve.', 'City hall resolves.')}
        lead={t(
          'Zeladoria urbana de ponta a ponta: o cidadão abre o relato no celular com foto, áudio e geolocalização exata, e a prefeitura despacha equipes a partir de um centro de comando com mapa de calor.',
          'End-to-end urban maintenance: citizens file a report from their phone with photos, audio and exact geolocation, and city hall dispatches crews from a command center with a live heatmap.',
        )}
        secondary={['#frentes', t('Ver os dois front-ends', 'See both front-ends')]}
      >
        <div className="mt-16 border-t border-line pt-6">
          <p className="mb-4 text-sm font-semibold text-text-2"><T pt="Ciclo de vida de cada ocorrência" en="Lifecycle of every report" /></p>
          <ol className="flex flex-wrap items-center gap-2.5">
            {['pendente', 'analise', 'andamento', 'resolvido'].map((s, i) => (
              <li key={s} className="flex items-center gap-2.5">
                {i > 0 && <span aria-hidden="true" className="hidden h-px w-6 bg-line-2 sm:block md:w-10" />}
                <Badge status={s} step={i} />
              </li>
            ))}
            <li className="flex items-center gap-2.5 text-sm text-text-2 sm:ml-4 sm:border-l sm:border-line-2 sm:pl-5">
              <T pt="ou" en="or" /> <Badge status="rejeitado" />
            </li>
          </ol>
          <p className="mt-4 max-w-[70ch] text-md text-text-2">
            <T
              pt="Toda mudança de status exige justificativa técnica do servidor e entra no histórico auditável, usado por Tribunal de Contas e Ouvidoria."
              en="Every status change requires a written technical justification and is stored in an auditable history used by audit courts and the ombudsman."
            />
          </p>
        </div>
      </Hero>

      <section id="frentes" className="section border-t border-line" aria-label={t('Os dois front-ends', 'The two front-ends')}>
        <div data-stagger className="wrap grid gap-16 md:grid-cols-[minmax(240px,0.42fr)_1fr] md:gap-x-16">
          <Shot
            phone
            eager
            className="order-1 md:order-none"
            src="/assets/projetos/urbis/screens/app-relatar.webp"
            alt={t('App do cidadão Urbis: tela Nova Ocorrência com categorias', 'Urbis citizen app: New Report screen with categories')}
            width={780}
            height={1688}
            caption={t('App do cidadão', 'Citizen app')}
          />
          <Shot
            className="order-3 md:order-none md:self-end"
            src="/assets/projetos/urbis/screens/painel-relatos.webp"
            alt={t('Painel web do Urbis: tabela de ocorrências com status', 'Urbis web dashboard: report table with statuses')}
            width={1440}
            height={900}
            url="/relatos"
            caption={t('Painel da prefeitura', 'City hall dashboard')}
          />
          <article className="order-2 md:order-none">
            <H2>{t('App do Cidadão', 'Citizen App')}</H2>
            <p className="mt-2 font-mono text-sm text-accent">React Native 0.81 · Expo SDK 54 · TypeScript</p>
            <p className="mt-4 text-text-2"><T pt="Simples, nativo e pensado para quem nunca abriu um protocolo na vida." en="Simple, native and designed for people who have never filed a city request before." /></p>
            <Points
              className="mt-6"
              items={[
                [t('Relato com evidências', 'Evidence-backed reports'), t('até 3 fotos, nota de voz e GPS com endereço por geocodificação reversa.', 'up to 3 photos, a voice note and GPS with reverse-geocoded address.')],
                [t('Alertas da Defesa Civil', 'Civil Defense alerts'), t('e destaques do município na tela inicial.', 'and city highlights on the home screen.')],
                [t('Guia turístico', 'Tourism guide'), t('pontos de interesse, rotas seguras e busca com filtros.', 'points of interest, safe routes and filtered search.')],
                [t('Acessibilidade', 'Accessibility'), t('alto contraste, TalkBack e VoiceOver, áudio para idosos e pessoas com deficiência.', 'high contrast, TalkBack and VoiceOver, audio for older adults and people with disabilities.')],
              ]}
            />
          </article>
          <article className="order-4 md:order-none">
            <H2>{t('Painel Web da Prefeitura', 'City Hall Web Dashboard')}</H2>
            <p className="mt-2 font-mono text-sm text-accent">Next.js 14 · Tailwind CSS · React Leaflet + leaflet.heat · Recharts</p>
            <p className="mt-4 text-text-2"><T pt="A mesa de despacho da zeladoria: triagem, moderação e decisão com base em dados." en="The maintenance dispatch desk: triage, moderation and data-driven decisions." /></p>
            <Points
              className="mt-6"
              items={[
                [t('Mapa de calor', 'Heatmap'), t('sobre OpenStreetMap com os pontos GPS dos chamados abertos.', 'over OpenStreetMap built from the GPS points of open reports.')],
                [t('Prontuário do relato', 'Report record'), t('fotos ampliadas, áudio, mapa e moderação com justificativa obrigatória.', 'enlarged photos, audio, map and moderation with mandatory justification.')],
                [t('CMS municipal', 'City CMS'), t('alertas e banners publicados direto no app do munícipe.', 'alerts and banners published straight to the citizen app.')],
                [t('Base de cidadãos', 'Citizen database'), t('dados mascarados conforme a LGPD e permissões por operador.', 'LGPD-compliant data masking and per-operator permissions.')],
              ]}
            />
          </article>
        </div>
      </section>

      <Facts
        items={[
          [2, 0, '', t('front-ends integrados: app do cidadão e painel da prefeitura', 'integrated front-ends: citizen app and city dashboard')],
          [3, 0, '', t('etapas para abrir um relato com evidências', 'steps to file an evidence-backed report')],
          [5, 0, '', t('status no ciclo de vida auditável de cada ocorrência', "statuses in each report's auditable lifecycle")],
          [8, 0, '', t('categorias de zeladoria, configuráveis por município', 'maintenance categories, configurable per city')],
        ]}
      />

      <div className="border-b border-line py-5">
        <Loop
          label={t('Categorias de ocorrência', 'Report categories')}
          speed="40s"
          itemClass="mr-3 inline-flex items-center gap-2.5 rounded-md border border-line-2 bg-raised px-4 py-2 text-md font-semibold whitespace-nowrap"
          items={CATEGORIES.map(([pt, en, dot]) => (
            <>
              <i aria-hidden="true" className="size-2 rounded-xs" style={{ background: dot }} />
              {t(pt, en)}
            </>
          ))}
        />
      </div>

      <section className="section" aria-labelledby="flow-title">
        <div data-reveal className="wrap">
          <H2 id="flow-title">{t('Do buraco na rua ao serviço executado', 'From pothole to completed service')}</H2>
          <p className="lead mt-6">
            <T
              pt="O relato foi desenhado em três etapas curtas, com transições a 60 fps e validação assistida, para funcionar até com sinal fraco."
              en="Reporting takes three short steps, with 60 fps transitions and assisted validation, designed to work even on a weak signal."
            />
          </p>
          <ol className="mt-14 grid gap-10 md:grid-cols-[1fr_1.35fr_1fr_auto] md:gap-10" data-stagger>
            {[
              [t('Categoria', 'Category'), t('Iluminação, buraco, lixo, vazamento: as categorias vêm do banco de cada município, sem reescrever código.', "Lighting, potholes, waste, leaks: categories load from each city's database, with no code changes.")],
              [t('Evidências', 'Evidence'), t('Câmera nativa com redimensionamento antes do upload, nota de voz com pulso visual e coordenadas convertidas em rua e bairro.', 'Native camera with pre-upload resizing, a voice note with a visual pulse, and coordinates converted to street and district.')],
              [t('Confirmação', 'Confirmation'), t('Revisão, descrição complementar e envio. O cidadão acompanha cada mudança de status na aba Monitorar.', 'Review, extra description and submit. Citizens follow every status change in the Monitor tab.')],
            ].map(([title, text], i) => (
              <li key={i} className="border-t border-accent pt-5">
                <span className="font-mono text-sm text-accent">0{i + 1}</span>
                <h3 className="mt-2 h-display text-xl">{title}</h3>
                <p className="mt-2 text-text-2">{text}</p>
                {i === 1 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {[t('Até 3 fotos', 'Up to 3 photos'), t('Nota de voz', 'Voice note'), t('GPS exato', 'Exact GPS')].map((e) => (
                      <li key={e} className="chip">{e}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li className="border-t border-line-2 pt-5">
              <p className="mb-3 text-md text-text-2"><T pt="Chega ao painel como" en="Lands on the dashboard as" /></p>
              <Badge status="pendente" />
            </li>
          </ol>
        </div>
      </section>

      <section className="section border-t border-line bg-surface" aria-labelledby="cmd-title">
        <div data-stagger className="wrap grid items-center gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <H2 id="cmd-title">{t('Centro de comando geoespacial', 'Geospatial command center')}</H2>
            <p className="lead mt-6">
              <T pt="Gestores enxergam onde os problemas se concentram e priorizam investimento com base em dados, não em achismo." en="Managers see where problems cluster and prioritize investment on data, not guesswork." />
            </p>
            <dl className="mt-8 border-t border-line-2">
              {[
                [t('Mapa de calor', 'Heatmap'), t('Manchas críticas de buracos, lixo e falta de iluminação por bairro.', 'Critical clusters of potholes, waste and lighting failures by district.')],
                [t('KPIs e evolução', 'KPIs and trends'), t('Linhas de evolução temporal e barras por categoria com Recharts.', 'Time-series lines and per-category bars powered by Recharts.')],
                [t('Tabela gerencial', 'Management table'), t('Busca e filtros dinâmicos para triagem e despacho das equipes de campo.', 'Search and dynamic filters for triage and field-crew dispatch.')],
              ].map(([dt, dd]) => (
                <div key={dt} className="border-b border-line-2 py-4">
                  <dt className="h-display">{dt}</dt>
                  <dd className="text-text-2">{dd}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Shot
            src="/assets/projetos/urbis/screens/painel-dashboard.webp"
            alt={t('Painel web do Urbis: KPIs e mapa de calor de ocorrências', 'Urbis web dashboard: KPIs and report heatmap')}
            width={1440}
            height={900}
            url="/"
            caption={t('Dashboard principal: KPIs, mapa de calor e gráficos em uma única tela', 'Main dashboard: KPIs, heatmap and charts on a single screen')}
          />
        </div>
      </section>

      <section className="section border-t border-line" aria-labelledby="trust-title">
        <div data-stagger className="wrap grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-24">
          <div>
            <H2 id="trust-title">{t('Governo digital, dentro da lei', 'Digital government, by the book')}</H2>
            <p className="h-display mt-7 mb-3 text-stat text-accent">Lei 14.129/2021</p>
            <p className="text-text-2">
              <T
                pt="Construído sobre o Marco Legal do Governo Digital e a LGPD, e pronto para ser licenciado a novos municípios."
                en="Built on Brazil's Digital Government Act and the LGPD data-protection law, and ready to be licensed to new cities."
              />
            </p>
          </div>
          <dl className="border-t border-line">
            {[
              ['LGPD', t('Dados pessoais do munícipe mascarados no painel, com permissões por perfil de operador.', 'Citizen personal data masked in the dashboard, with role-based operator permissions.')],
              [t('Auditoria', 'Audit trail'), t('Histórico de status com justificativa técnica para Tribunal de Contas e Ouvidoria.', 'Status history with technical justification for audit courts and the ombudsman.')],
              ['White-label', t('Cores, brasão, secretarias e categorias de cada prefeitura configuradas centralmente.', "Each city's colors, coat of arms, departments and categories configured centrally.")],
              [t('Inclusão', 'Inclusion'), t('Leitores de tela, alto contraste e máscaras de CPF, RG e telefone que evitam erros.', 'Screen readers, high contrast, and input masks for ID and phone numbers that prevent mistakes.')],
            ].map(([dt, dd]) => (
              <div key={dt} className="grid gap-2 border-b border-line py-5 sm:grid-cols-[160px_1fr] sm:gap-6">
                <dt className="h-display">{dt}</dt>
                <dd className="text-text-2">{dd}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Faq
        title={t('Perguntas frequentes', 'Frequently asked questions')}
        items={[
          [t('O app funciona com sinal fraco?', 'Does the app work on a weak signal?'), t('Sim. O relato tem três etapas curtas e as fotos são redimensionadas antes do envio, para gastar poucos dados do cidadão.', "Yes. Reporting has three short steps and photos are resized before upload, so it uses little of the citizen's data.")],
          [t('O cidadão precisa digitar o endereço?', 'Do citizens have to type the address?'), t('Não. O GPS do celular captura as coordenadas e a geocodificação reversa preenche rua, número aproximado e bairro.', "No. The phone's GPS captures the coordinates and reverse geocoding fills in street, approximate number and district.")],
          [t('Dá para usar a identidade visual da nossa prefeitura?', "Can it carry our city hall's visual identity?"), t('Sim. O Urbis é white-label: cores, brasão, ícone, tela de abertura, secretarias e categorias são configurados por município.', 'Yes. Urbis is white-label: colors, coat of arms, icon, splash screen, departments and categories are set per city.')],
          [t('Como ficam a LGPD e a auditoria?', 'What about the LGPD and audits?'), t('Dados pessoais aparecem mascarados no painel, cada operador tem permissões próprias e toda mudança de status guarda justificativa e histórico.', 'Personal data is masked in the dashboard, each operator has their own permissions and every status change keeps a justification and history.')],
        ]}
      />

      <Close
        title={t('Leve o Urbis para o seu município', 'Bring Urbis to your city')}
        lead={t(
          'Agende uma apresentação com a equipe da NOXXD e veja o app e o painel funcionando com os dados da sua cidade.',
          "Book a walkthrough with the NOXXD team and see the app and dashboard running with your city's data.",
        )}
      />
    </ProjectPage>
  )
}

export default Urbis
mount(Urbis)
