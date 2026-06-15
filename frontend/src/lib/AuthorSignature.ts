/**
 * @author David Cevallos
 * @project DC.dev — personal_web v2.0.0
 * @integrity Propietario — Prohibida reproducción sin autorización escrita
 */

// ─── FIRMA NIVEL 2: Terminal F12 ─────────────────────────────────────────────
// Ejecutar en main.tsx o App.tsx, antes del render de React

export function mountAuthorSignature(): void {
  const STYLES = {
    title: 'color:#7C6FF7;font-size:18px;font-weight:700;font-family:monospace',
    sub:   'color:#4DFFDB;font-size:12px;font-family:monospace',
    muted: 'color:#8B8A9B;font-size:11px;font-family:monospace',
    warn:  'color:#FF4D6D;font-size:11px;font-weight:600;font-family:monospace',
  }

  console.log('%c⚡ DC.dev', STYLES.title)
  console.log('%cDavid Cevallos — IA Engineering & DevSecOps', STYLES.sub)
  console.log('%cUTM · 9no Semestre · Manabí, Ecuador', STYLES.muted)
  console.log('%c─────────────────────────────────────────────────────────', STYLES.muted)
  console.log('%c⚠ Este código es propiedad intelectual del autor.', STYLES.warn)
  console.log('%cReproducción parcial o total requiere autorización escrita.', STYLES.warn)
  console.log('%cgithub.com/DavidCevallos15 · DC.dev', STYLES.muted)

  // Metadata CSS invisible (Nivel 2 - inspeccionable en Computed Styles)
  const marker = document.createElement('meta')
  marker.name = 'author-signature'
  marker.content = 'David Cevallos | DC.dev v2.0.0 | IA Engineering & DevSecOps'
  document.head.appendChild(marker)
}

// ─── FIRMA NIVEL 3: Easter Egg — Konami Code ─────────────────────────────────
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']
let konamiIdx = 0

export function mountKonamiEasterEgg(): void {
  document.addEventListener('keydown', (e) => {
    if (e.key === KONAMI[konamiIdx]) {
      konamiIdx++
      if (konamiIdx === KONAMI.length) {
        konamiIdx = 0
        triggerEasterEgg()
      }
    } else {
      konamiIdx = 0
    }
  })
}

function triggerEasterEgg(): void {
  const overlay = document.createElement('div')
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:9999;
    background:#0A0A0F;display:flex;flex-direction:column;
    align-items:center;justify-content:center;
    font-family:monospace;color:#4DFFDB;
    animation:fadeIn 0.3s ease;
  `
  overlay.innerHTML = `
    <p style="font-size:48px;margin:0">⚡</p>
    <p style="font-size:24px;font-weight:700;color:#7C6FF7;margin:16px 0 8px">
      David Cevallos
    </p>
    <p style="font-size:14px;color:#8B8A9B;margin:0">
      IA Engineering · DevSecOps · UTM · DC.dev v2.0.0
    </p>
    <p style="font-size:12px;color:#2A2A38;margin-top:48px">
      ESC para cerrar
    </p>
  `
  document.body.appendChild(overlay)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') overlay.remove()
  }, { once: true })
  setTimeout(() => overlay.remove(), 4000)
}
