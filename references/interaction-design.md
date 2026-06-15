# Sub-Skill: Interaction Design — Físicas del Cursor y Scroll

## Arquitectura de animación (regla absoluta)
GSAP ScrollTrigger → controla todo lo basado en posición de scroll
Framer Motion → controla estados de componentes (hover, tap, enter/exit)
PROHIBIDO mezclar ambas en el mismo elemento

## Configuración GSAP base
```ts
// src/lib/gsap-config.ts
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

// Evitar Layout Thrashing
gsap.config({ force3D: true, nullTargetWarn: false })
ScrollTrigger.config({ limitCallbacks: true })
```

## Variantes Framer Motion base
```ts
// src/lib/motion-variants.ts
export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
}
export const magneticHover = {
  whileHover: { scale: 1.04 },
  whileTap: { scale: 0.97 },
  transition: { type: 'spring', stiffness: 400, damping: 20 }
}
```

## Física del cursor magnético (Nivel 3 firma)
```ts
// Hook: useMouseMagnet.ts
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

export function useMouseMagnet(strength = 0.35) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      gsap.to(el, {
        x: (e.clientX - cx) * strength,
        y: (e.clientY - cy) * strength,
        duration: 0.4, ease: 'power2.out'
      })
    }
    const handleLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    return () => { el.removeEventListener('mousemove', handleMove); el.removeEventListener('mouseleave', handleLeave) }
  }, [strength])
  return ref
}
```
