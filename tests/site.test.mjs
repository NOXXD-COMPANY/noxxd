import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { symbiote } from '../src/symbiote.js'

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
    assert.match(html, /setAttribute\('data-theme'/, `${file} lacks the pre-paint theme`)
  }
})


test('the old HealthSearch address still lands on SIGAC', () => {
  assert.match(read('public/projetos/healthsearch/index.html'), /url=\/projetos\/sigac\//)
  for (const file of sources) assert.doesNotMatch(read(file), /healthsearch/i, `${file} still says HealthSearch`)
})

test('the theme symbiote starts inside the control and ends past every corner', () => {
  const [cx, cy, w, h] = [1180, 36, 1280, 800]
  const frames = symbiote(cx, cy, w, h, 7)
  const reach = (frame) => [...frame.clipPath.matchAll(/(-?[\d.]+)px (-?[\d.]+)px/g)].map(([, x, y]) => Math.hypot(x - cx, y - cy))
  const corner = Math.hypot(cx, h - cy)
  assert.equal(Math.max(...reach(frames[0])), 0)
  assert.ok(Math.min(...reach(frames.at(-1))) >= corner, 'last frame leaves part of the viewport uncovered')
  assert.equal(new Set(frames.map((frame) => reach(frame).length)).size, 1, 'frames must share a vertex count to interpolate')
  assert.deepEqual([frames[0].offset, frames.at(-1).offset], [0, 1])
})
