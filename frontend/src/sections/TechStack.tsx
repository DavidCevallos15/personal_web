import { Reveal } from '@/components/motion/Reveal';
import { techStack } from '@/data/content';

/** Stack agrupado en 2 columnas, sin cajas: cada grupo separado por una sola línea superior. */
export function TechStack() {
  return (
    <div className="container-lg pb-14">
      <p className="mb-10 max-w-xl text-base leading-relaxed text-text-muted text-pretty">
        Herramientas que uso en proyectos reales, y para qué. La IA acelera; la revisión y los tests deciden.
      </p>
      <div className="grid gap-x-16 gap-y-10 md:grid-cols-2">
        {techStack.map((group, i) => (
          <Reveal key={group.title} delay={(i % 2) * 0.06} className="border-t border-border pt-5">
            <h3 className="font-display text-2xl uppercase tracking-wide text-text-primary">{group.title}</h3>
            <dl className="mt-4 space-y-4">
              {group.items.map((item) => (
                <div key={item.name} className="grid gap-1 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-6">
                  <dt className="font-mono text-sm text-accent-primary">{item.name}</dt>
                  <dd className="text-sm leading-relaxed text-text-muted">{item.use}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
