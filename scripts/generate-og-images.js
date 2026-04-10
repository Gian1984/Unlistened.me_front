/**
 * generate-og-images.js
 *
 * Generates 1200×630 OG images for every static page.
 * Each image has a blue-to-indigo gradient background, the Unlistened.me logo,
 * and the page title rendered as white text.
 *
 * Usage:  node scripts/generate-og-images.js
 * Runs after `npm run build` — writes into dist/images/og/
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST = path.resolve(ROOT, 'dist')
const OUT_DIR = path.resolve(DIST, 'images', 'og')
const LOGO_PATH = path.resolve(ROOT, 'public', 'images', 'unlistened_transparen_logo_300.png')

const WIDTH = 1200
const HEIGHT = 630
const LOGO_SIZE = 160

// ── Pages to generate OG images for ────────────────────────────────────
// key  = output filename (without .png)
// title = text rendered on the image
const PAGES = [
  { key: 'home',          title: 'Free Podcasts & Music' },
  { key: 'podcasts',      title: 'Podcasts' },
  { key: 'music',         title: 'Free Music' },
  { key: 'categories',    title: 'Categories' },
  { key: 'about',         title: 'About' },
  { key: 'documentation', title: 'Documentation' },
  { key: 'terms',         title: 'Terms & Conditions' },
  { key: 'privacy',       title: 'Privacy Policy' },
  { key: 'search',        title: 'Search' },
  { key: 'login',         title: 'Sign In' },
  { key: 'signup',        title: 'Create Account' },
  { key: 'default',       title: 'Unlistened.me' },
]

// ── SVG helpers ─────────────────────────────────────────────────────────

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/**
 * Creates the full-size SVG with gradient background, a centered tagline,
 * and the page title. The logo is composited separately via sharp.
 */
function buildSvg(title) {
  const escaped = escapeXml(title)

  // Position: logo area top, title centered vertically below logo
  const titleY = 420
  const taglineY = 500
  const tagline = 'No tracking. No ads. Just listen.'

  return `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e1b4b;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#312e81;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4338ca;stop-opacity:1" />
    </linearGradient>
    <!-- subtle decorative circles -->
    <radialGradient id="glow1" cx="20%" cy="30%" r="40%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:#6366f1;stop-opacity:0" />
    </radialGradient>
    <radialGradient id="glow2" cx="80%" cy="70%" r="35%">
      <stop offset="0%" style="stop-color:#818cf8;stop-opacity:0.2" />
      <stop offset="100%" style="stop-color:#818cf8;stop-opacity:0" />
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow1)" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow2)" />

  <!-- Decorative line -->
  <rect x="525" y="370" width="150" height="3" rx="2" fill="#818cf8" opacity="0.6" />

  <!-- Page title -->
  <text x="${WIDTH / 2}" y="${titleY}"
        font-family="'Segoe UI','Helvetica Neue',Arial,sans-serif"
        font-size="52" font-weight="700" fill="white"
        text-anchor="middle" dominant-baseline="middle">
    ${escaped}
  </text>

  <!-- Tagline -->
  <text x="${WIDTH / 2}" y="${taglineY}"
        font-family="'Segoe UI','Helvetica Neue',Arial,sans-serif"
        font-size="24" fill="#a5b4fc"
        text-anchor="middle" dominant-baseline="middle">
    ${tagline}
  </text>

  <!-- Bottom bar -->
  <rect x="0" y="${HEIGHT - 6}" width="${WIDTH}" height="6" fill="#6366f1" />
</svg>`
}

// ── Main ────────────────────────────────────────────────────────────────

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })

  // Resize logo once
  const logo = await sharp(LOGO_PATH)
    .resize(LOGO_SIZE, LOGO_SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()

  const logoLeft = Math.round((WIDTH - LOGO_SIZE) / 2)
  const logoTop = 130

  let count = 0
  for (const page of PAGES) {
    const svgBuffer = Buffer.from(buildSvg(page.title))

    const image = await sharp(svgBuffer)
      .composite([
        {
          input: logo,
          left: logoLeft,
          top: logoTop,
        },
      ])
      .png({ quality: 90, compressionLevel: 9 })
      .toBuffer()

    const outPath = path.join(OUT_DIR, `${page.key}.png`)
    fs.writeFileSync(outPath, image)
    count++
  }

  // Also copy the default as ogimage-min.png at the images root for backward compat
  const defaultSrc = path.join(OUT_DIR, 'default.png')
  const defaultDst = path.join(DIST, 'images', 'ogimage-min.png')
  if (fs.existsSync(defaultSrc)) {
    fs.copyFileSync(defaultSrc, defaultDst)
  }

  console.log(`OG images generated: ${count} images in ${OUT_DIR}`)
}

main().catch((err) => {
  console.error('Failed to generate OG images:', err)
  process.exit(1)
})
