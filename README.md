<p align="center">
  <img src="public/assets/logo-black.svg#gh-light-mode-only" alt="NOXXD" width="96">
  <img src="public/assets/logo-white.svg#gh-dark-mode-only" alt="NOXXD" width="96">
</p>

# NOXXD — Website & Portfólio Institucional

> **CONSTRUA DO SEU JEITO** · *BUILD IT YOUR WAY*
> Tecnologia sob medida para o setor público e empresas privadas.
> Acesse: [noxxd.com.br](https://noxxd.com.br)

## Sobre a NOXXD

A **NOXXD** desenvolve sites, landing pages, sistemas web e plataformas SaaS sob medida para modernizar a gestão pública e acelerar negócios.

### Projetos em portfólio

Cada projeto tem página própria, com a moldura NOXXD e um tom, uma tipografia e a logo do produto:

- **[Urbis](https://noxxd.com.br/projetos/urbis/)**: zeladoria urbana para prefeituras, com app do cidadão (React Native / Expo 54) e painel web com mapa de calor (Next.js 14).
- **[SIGAC](https://noxxd.com.br/projetos/sigac/)**: central de Saúde e Segurança do Trabalho que sustenta o SIGAC (ASO NR-07, matriz NR-01 a NR-35, CID-10 cifrado em AES-GCM 256).
- **[CARITAS](https://noxxd.com.br/projetos/caritas/)**: plataforma clínica para psicólogas(os), com prontuário, anamnese, I.A., documentos CFP, agenda e PIX.

Os prints dos sistemas vêm de execuções locais com **dados fictícios** e levam esse rótulo no site.

## Identidade visual

- **Logo:** emblema xadrez com o "N" vazado, em duas versões: `public/assets/logo-black.svg` (fundos claros) e `public/assets/logo-white.svg` (fundos escuros). O favicon usa a preta no tema claro e a branca no tema escuro do sistema.
- **Cores:** neutros de pedra quentes (`#FAFAF9`, `#1C1917`, `#78716C`) e linhas finas. Cada projeto recebe um único tom discreto: Urbis `#2F6B7C`, SIGAC `#8A6A2E`, CARITAS `#52599A`, cada um com um par mais claro para o tema escuro.
- **Temas:** claro e escuro. O site segue o tema do sistema até a pessoa escolher um no botão do cabeçalho; a escolha fica em `localStorage` (`noxxd_theme`).
- **Tipografia:** Libre Baskerville (títulos), Inter (texto) e Source Code Pro (stack e código). Nos projetos, os títulos usam a fonte do produto: Manrope, Archivo e Sora. As fontes são servidas pelo próprio site (pacotes `@fontsource-variable/*`), sem chamada a terceiros.
- **Forma:** superfícies em camadas, cantos suaves (6, 10, 16 e 24 px), sombras leves e linhas finas. O xadrez da logo aparece como textura discreta no topo das páginas e nos blocos de chamada.
- **Tokens:** cores, escala tipográfica fluida, espaçamento, raios, sombras e tempos de animação ficam em `src/styles.css`. Os temas dos projetos são as classes `.theme-<slug>` no mesmo arquivo.

## Tecnologias

- **React 19 + Vite** com build de várias páginas (Home e uma página por projeto), cada uma com seu próprio HTML, título, meta tags e URL canônica.
- **Tailwind CSS v4** com os tokens da marca em `src/styles.css`.
- **PT | EN** com a escolha salva em `localStorage` (`noxxd_lang`) e compartilhada entre as páginas.
- Componentes adaptados de padrões do React Bits (Blur Text, Count Up, Spotlight Card, Decrypted Text), 21st.dev (FAQ) e Uiverse (seletor de idioma), sem bibliotecas de interface. O menu do celular e a galeria ampliada dos prints usam `<dialog>` nativo (foco preso, Esc para fechar, página travada ao fundo).
- Animações só com `transform` e `opacity`: entrada ao rolar, cartões com foco de luz, cabeçalho que ganha fundo ao rolar e transição suave entre páginas, idiomas e temas. Tudo respeita `prefers-reduced-motion`.
- Cada print tem uma versão de meia largura (`-sm.webp`) usada via `srcset` em telas pequenas.

## Desenvolvimento

```bash
npm install
npm run dev      # servidor local
npm test         # links de páginas e assets, domínio, títulos, prints -sm e tema
npm run build    # gera dist/
```

```
index.html                 Home
projetos/<slug>/index.html Páginas dos projetos
src/pages/                 Uma página React por HTML
src/ui.jsx, src/project.jsx Componentes compartilhados
public/                    Logos, prints e CNAME (copiados para dist/)
```

## Deploy

O GitHub Actions (`.github/workflows/deploy.yml`) roda os testes, faz o build e publica `dist/` no GitHub Pages a cada push na `main`. Em **Settings → Pages → Source**, a opção precisa estar em **GitHub Actions**. O domínio `noxxd.com.br` vem de `public/CNAME`.

## Licença

Este projeto está sob a licença [MIT](LICENSE).
