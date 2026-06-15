/**
 * @author Jimmy David Cevallos Zambrano
 * @project personal_web v1.0.0
 * @integrity SHA256:m4n5o6p7q8r9s0t1
 * @license Propietario — Prohibida reproducción sin autorización
 */
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const WORKS = [
  { id: 1, title: 'Quantum Ledger', category: 'DevSecOps', image: 'bg-accent-primary/20', height: 'h-[400px]' },
  { id: 2, title: 'Neural Architect', category: 'IA Engineering', image: 'bg-accent-electric/20', height: 'h-[300px]' },
  { id: 3, title: 'Vortex Protocol', category: 'Systems', image: 'bg-danger/20', height: 'h-[350px]' },
  { id: 4, title: 'Nexus Bridge', category: 'Cloud', image: 'bg-success/20', height: 'h-[450px]' },
];

function WorkCard({ work }: { work: typeof WORKS[0] }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full rounded-xl overflow-hidden border border-border group ${work.height} ${work.image} gpu cursor-pointer`}
      whileHover={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <div 
        className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent opacity-80" 
        style={{ transform: 'translateZ(10px)' }}
      />
      <div 
        className="absolute bottom-6 left-6 right-6"
        style={{ transform: 'translateZ(30px)' }}
      >
        <p className="text-xs font-mono text-accent-electric mb-2">{work.category}</p>
        <h3 className="text-2xl font-bold text-text-primary group-hover:text-accent-primary transition-colors">{work.title}</h3>
      </div>
    </motion.div>
  );
}

export function SelectedWorks() {
  return (
    <section id="works" className="py-32 px-6 max-w-[1440px] mx-auto">
      <div className="mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Selected Works</h2>
        <p className="text-text-muted">Showcasing high-performance solutions.</p>
      </div>
      
      <div className="columns-1 md:columns-2 gap-6 space-y-6">
        {WORKS.map((work) => (
          <div key={work.id} className="break-inside-avoid">
            <WorkCard work={work} />
          </div>
        ))}
      </div>
    </section>
  );
}
