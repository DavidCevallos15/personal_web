import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';
import { dur, ease } from '@/lib/motion';

type RevealProps = HTMLMotionProps<'div'> & { delay?: number; y?: number };

/** Entrada on-view (una sola vez). Base de casi todas las secciones. */
export function Reveal({ delay = 0, y = 24, ...props }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: dur.reveal * 0.7, ease: ease.reveal, delay }}
      {...props}
    />
  );
}

/** Titular de sección en dos líneas: la segunda atenuada. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  accent,
  description,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  accent?: string;
  description?: string;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      {eyebrow && (
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent-electric">{eyebrow}</p>
      )}
      <h2 id={id} className="font-display text-4xl uppercase leading-[0.95] tracking-tight text-text-primary md:text-6xl">
        <span className="block">{title}</span>
        {accent && <span className="block text-text-primary/35">{accent}</span>}
      </h2>
      {description && (
        <p className="mt-4 max-w-xl text-base leading-relaxed text-text-muted text-pretty">{description}</p>
      )}
    </Reveal>
  );
}
