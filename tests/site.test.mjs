import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const read = (file) => readFileSync(join(root, file), 'utf8')
const sources = [
  'index.html',
  ...['urbis', 'sigac', 'caritas'].map((slug) => `projetos/${slug}/index.html`),
  ...readdirSync(join(root, 'src'), { recursive: true }).filter((f) => /\.jsx?$/.test(f)).map((f) => join('src', f)),
]

test('every /assets path used by the site exists in public/', () => {
  for (const file of sources) {
    for (const [path] of read(file).matchAll(/\/assets\/[\w./-]+\.(?:png|svg|webp)/g)) {
      assert.ok(existsSync(join(root, 'public', path)), `${file} points to missing ${path}`)
    }
  }
})

test('every /projetos/<slug>/ link has a page and a build entry', () => {
  const config = read('vite.config.js')
  for (const file of sources) {
    for (const [, slug] of read(file).matchAll(/\/projetos\/([a-z]+)\/(?!index|screens|logo)/g)) {
      assert.ok(existsSync(join(root, 'projetos', slug, 'index.html')), `${file} links to missing page ${slug}`)
      assert.ok(config.includes(`projetos/${slug}/index.html`), `${slug} is not a Vite build input`)
    }
  }
})

test('pages keep the custom domain, canonical URL and English title', () => {
  assert.equal(read('public/CNAME').trim(), 'noxxd.com.br')
  for (const file of sources.filter((f) => f.endsWith('.html'))) {
    const html = read(file)
    assert.match(html, /<link rel="canonical" href="https:\/\/noxxd\.com\.br\//, `${file} lacks canonical`)
    assert.match(html, /data-title-en="[^"]+"/, `${file} lacks the English title`)
    assert.match(html, /setAttribute\('data-wait'/, `${file} lacks the English pre-paint guard`)
  }
})


test('every screenshot has its half-width "-sm" twin for srcset', () => {
  for (const slug of ['urbis', 'sigac', 'caritas']) {
    const dir = join(root, 'public/assets/projetos', slug, 'screens')
    for (const file of readdirSync(dir).filter((f) => !f.endsWith('-sm.webp'))) {
      assert.ok(existsSync(join(dir, file.replace('.webp', '-sm.webp'))), `${slug}/${file} lacks a -sm twin`)
    }
  }
})

test('pages set the saved theme before paint and load no third-party fonts', () => {
  for (const file of sources.filter((f) => f.endsWith('.html'))) {
    const html = read(file)
    assert.match(html, /getItem\('noxxd_theme'\)/, `${file} lacks the theme pre-paint guard`)
    assert.doesNotMatch(html, /fonts\.googleapis\.com/, `${file} still loads Google Fonts`)
  }
})

test('the theme symbiote starts inside the control and ends past every corner', async () => {
  const { symbiote } = await import('../src/symbiote.js')
  const [cx, cy, w, h] = [1180, 36, 1280, 800]
  const frames = symbiote(cx, cy, w, h, 7)
  const reach = (frame) => [...frame.clipPath.matchAll(/(-?[\d.]+)px (-?[\d.]+)px/g)].map(([, x, y]) => Math.hypot(x - cx, y - cy))
  assert.equal(Math.max(...reach(frames[0])), 0)
  assert.ok(Math.min(...reach(frames.at(-1))) >= Math.hypot(cx, h - cy), 'last frame leaves part of the viewport uncovered')
  assert.equal(new Set(frames.map((frame) => reach(frame).length)).size, 1, 'frames must share a vertex count to interpolate')
})
