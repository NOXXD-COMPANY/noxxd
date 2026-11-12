// Outline of the "symbiote" that carries a theme change: a noisy blob that leaves (cx, cy) as curling tendrils,
// then swells until it covers a w × h viewport. Returns Web Animations keyframes for clip-path.
// Every frame has the same vertex count, so the browser interpolates between them without any per-frame JS.
const POINTS = 180
const FRAMES = 40

export function symbiote(cx, cy, w, h, seed = Math.random() * 100) {
  const reach = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) * 1.2 // the body dips to 0.85 × reach, still past the far corner
  return Array.from({ length: FRAMES }, (_, k) => {
    const p = (k / (FRAMES - 1)) ** 2 // frames crowd the start, where the tendrils creep
    const body = reach * p ** 1.6
    const grab = Math.min(1, p * 40) * (44 + reach * 0.62 * p ** 0.7) * (1 - p) // tendrils run ahead early and merge into the body at the end
    const points = Array.from({ length: POINTS }, (_, i) => {
      const a = (i / POINTS) * Math.PI * 2
      const noise = Math.sin(a * 4 + seed + p * 3) + Math.sin(a * 7 + seed * 2 - p * 5) + Math.sin(a * 11 + seed * 3 + p * 2)
      const finger = Math.max(0, noise / 3 + 0.3) ** 1.7 // a few fat arms of uneven length
      const strand = Math.max(0, Math.sin(a * 17 + seed * 5 + p * 6)) ** 3 * 0.35 // thin strands between them
      const r = body * (1 + 0.1 * Math.sin(a * 3 + seed) + 0.05 * Math.sin(a * 6 - seed)) + grab * (finger + strand)
      const curl = a + 0.2 * (1 - p) * Math.min(1, r / 160) * Math.sin(r / 110 + a * 2 + seed) // arms bend as they stretch
      return `${(cx + r * Math.cos(curl)).toFixed(1)}px ${(cy + r * Math.sin(curl)).toFixed(1)}px`
    })
    return { offset: p, clipPath: `polygon(${points.join(',')})` }
  })
}
