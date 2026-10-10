import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from 'motion/react';
import { useState } from 'react';

/**
 * La patita de la gata de DC.dev: sale del borde derecho mientras haces scroll,
 * intentando alcanzar un punto láser que siempre se le escapa.
 * Estilo "clay" del video del Studio: pata negra mate + mano blanca con almohadillas rosadas.
 *
 * - Scroll-linked con la VELOCIDAD del scroll (useVelocity → useSpring): rápido = estira más.
 * - Solo transform/opacity (compositor). pointer-events: none, aria-hidden.
 * - reduced-motion: no se renderiza.
 */
export function CatPaw() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const [armed, setArmed] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => setArmed(y > window.innerHeight * 0.6));

  const reach = useSpring(useTransform(velocity, (v) => Math.min(Math.abs(v) / 1400, 1)), {
    stiffness: 140,
    damping: 18,
    mass: 0.6,
  });
  const x = useTransform(reach, [0, 1], ['82%', '6%']);
  const rotate = useSpring(useTransform(velocity, [-2500, 0, 2500], [9, 0, -9]), { stiffness: 120, damping: 14 });
  const toes = useTransform(reach, [0.4, 1], [1, 1.12]);
  const laserX = useTransform(reach, [0, 1], [0, -48]);
  const laserOpacity = useTransform(reach, [0.05, 0.35], [0, 1]);
  const laserY = useTransform(scrollY, (y) => Math.sin(y / 140) * 26);

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed right-0 top-[62%] z-40 hidden w-[min(34vw,340px)] sm:block"
      initial={false}
      animate={{ opacity: armed ? 1 : 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Punto láser: lo que la patita quiere alcanzar */}
      <motion.span
        style={{ x: laserX, y: laserY, opacity: laserOpacity }}
        className="absolute left-[2%] top-[42%] block size-2.5 rounded-full bg-[#ff2d55] shadow-[0_0_10px_3px_rgba(255,45,85,0.55)]"
      />
      <motion.div style={{ x, rotate, transformOrigin: '100% 50%' }} className="will-change-transform">
        <PawSvg toesScale={toes} />
      </motion.div>
    </motion.div>
  );
}

function PawSvg({ toesScale }: { toesScale: MotionValue<number> }) {
  return (
    <svg viewBox="0 0 420 170" className="w-full drop-shadow-[0_18px_22px_rgba(0,0,0,0.35)]">
      <defs>
        {/* Textura de plastilina: ruido fino solo dentro de las formas */}
        <filter id="paw-clay" x="-10%" y="-20%" width="120%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.09 0" result="grain" />
          <feComposite in="grain" in2="SourceGraphic" operator="in" result="grainIn" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="grainIn" />
          </feMerge>
        </filter>
        <linearGradient id="paw-leg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3a44" />
          <stop offset="0.35" stopColor="#1d1d24" />
          <stop offset="1" stopColor="#0c0c10" />
        </linearGradient>
        <radialGradient id="paw-white" cx="0.42" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#f1ece4" />
          <stop offset="1" stopColor="#cfc6b9" />
        </radialGradient>
        <radialGradient id="paw-bean" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#f7c3c6" />
          <stop offset="1" stopColor="#d98d94" />
        </radialGradient>
      </defs>

      <g filter="url(#paw-clay)">
        {/* Pata negra (entra desde el borde derecho) */}
        <path
          d="M430 58 C 330 50, 250 58, 168 66 C 150 68, 142 104, 162 110 C 245 116, 330 120, 430 122 Z"
          fill="url(#paw-leg)"
          stroke="rgba(226,182,92,0.28)"
          strokeWidth="1.5"
        />
        {/* Luz de borde (rim light cálida, como la lámpara del video) para que la pata se lea sobre fondo oscuro */}
        <path d="M420 61 C 330 54, 250 61, 172 69" stroke="#f3c77a" strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M420 74 C 330 68, 250 74, 182 80" stroke="#8a8a96" strokeOpacity="0.25" strokeWidth="6" strokeLinecap="round" fill="none" />

        {/* Mano blanca */}
        <ellipse cx="128" cy="88" rx="64" ry="50" fill="url(#paw-white)" />

        {/* Dedos: se abren al estirar */}
        <motion.g style={{ scaleY: toesScale, transformOrigin: '96px 88px' }}>
          <ellipse cx="74" cy="52" rx="20" ry="17" fill="url(#paw-white)" />
          <ellipse cx="58" cy="80" rx="20" ry="17" fill="url(#paw-white)" />
          <ellipse cx="60" cy="110" rx="19" ry="16" fill="url(#paw-white)" />
          <ellipse cx="80" cy="134" rx="17" ry="14" fill="url(#paw-white)" />
          {/* Almohadillas */}
          <ellipse cx="70" cy="53" rx="9" ry="8" fill="url(#paw-bean)" />
          <ellipse cx="54" cy="80" rx="9" ry="8" fill="url(#paw-bean)" />
          <ellipse cx="56" cy="109" rx="8.5" ry="7.5" fill="url(#paw-bean)" />
          <ellipse cx="76" cy="132" rx="7.5" ry="6.5" fill="url(#paw-bean)" />
        </motion.g>
        <path d="M100 66 C 122 60, 140 78, 136 94 C 133 110, 112 118, 98 110 C 86 104, 84 72, 100 66 Z" fill="url(#paw-bean)" />
        {/* Brillo especular tipo plastilina */}
        <ellipse cx="146" cy="62" rx="22" ry="9" fill="#ffffff" opacity="0.55" />
      </g>
    </svg>
  );
}
