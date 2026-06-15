/**
 * @author David Cevallos
 * @project DC.dev — personal_web v3.1.0
 * @skills ui-ux-pro-max + design-taste-frontend applied
 * @design-read Developer portfolio for recruiters/clients, dark-tech / AI-engineering
 * @dials DESIGN_VARIANCE:6 | MOTION_INTENSITY:6 | VISUAL_DENSITY:4
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  useAnimationFrame,
  useReducedMotion,
} from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import {
  ArrowUpRight,
  Server,
  Layers,
  Database,
  Bot,
  Mail,
  MapPin,
  Sun,
  Moon,
} from 'lucide-react';
import { portfolioData } from './data/portfolioData';
import { literaryArchive } from './data/blogPost';
import { HeroAvatarReveal } from './components/HeroAvatarReveal';
import { Certificates } from './components/sections/Certificates';
import { StickyTabs } from './components/ui/StickyTabs';
// import { AnimatedBorderButton } from './components/ui/AnimatedBorderButton';
import { DottedSurface } from './components/ui/DottedSurface';

gsap.registerPlugin(ScrollTrigger, Draggable);

// Brand SVG icons — lucide-react v1.x doesn't export Github/Linkedin by those names
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────────
// §4.7: Navigation MUST render on a single line. Height cap: 64-72px desktop.
function ThemeToggle({ theme, toggleTheme }: { theme: 'dark' | 'light'; toggleTheme: () => void }) {
  const reduce = useReducedMotion();
  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-accent-primary)]/50 hover:text-[var(--color-accent-primary)] transition-all duration-300 cursor-pointer flex items-center justify-center overflow-hidden w-9 h-9 shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent-primary)] focus-visible:outline-offset-2"
      aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'dark' ? 0 : 180,
          scale: theme === 'dark' ? 1 : 0,
          opacity: theme === 'dark' ? 1 : 0,
        }}
        transition={reduce ? { duration: 0 } : { duration: 0.3 }}
        className="absolute"
      >
        <Moon className="w-4 h-4 text-[var(--color-accent-electric)]" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'light' ? 0 : -180,
          scale: theme === 'light' ? 1 : 0,
          opacity: theme === 'light' ? 1 : 0,
        }}
        transition={reduce ? { duration: 0 } : { duration: 0.3 }}
        className="absolute"
      >
        <Sun className="w-4 h-4 text-[var(--color-accent-primary)]" />
      </motion.div>
    </button>
  );
}

interface NavbarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

function Navbar({ theme, toggleTheme }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: 'top -60',
      onUpdate: (self) => setIsScrolled(self.scroll() > 60),
    });
    return () => trigger.kill();
  }, []);

  const navLinks = [
    { label: 'Proyectos', href: '#works' },
    { label: 'Stack', href: '#stack' },
    { label: 'Arte', href: '#art' },
    { label: 'Contacto', href: '#contact' },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'glass-nav' : 'bg-transparent'
      }`}
      style={{ height: '68px' }}
      initial={reduce ? false : { y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container-lg h-full flex items-center justify-between">
        {/* Wordmark */}
        <a
          href="#hero"
          className="font-mono font-bold text-xl tracking-tight cursor-pointer select-none"
          aria-label="DC.dev — inicio"
        >
          <span className="text-[var(--color-accent-primary)]">DC</span>
          <span className="text-[var(--color-accent-electric)]">.</span>
          <span className="text-[var(--color-text-primary)]">dev</span>
        </a>

        {/* Right controls */}
        <div className="flex items-center gap-4">
          {/* Nav links — desktop only */}
          <div className="hidden md:flex items-center gap-7 text-sm font-sans mr-2">
            {navLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors duration-200 cursor-pointer"
                whileHover={reduce ? {} : { y: -1 }}
              >
                {link.label}
              </motion.a>
            ))}

            <div className="flex items-center gap-3 border-l border-[var(--color-border)] pl-6">
              <motion.a
                href={portfolioData.socials.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                whileHover={reduce ? {} : { scale: 1.1 }}
              >
                <GithubIcon className="w-5 h-5" />
              </motion.a>
              <motion.a
                href={portfolioData.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="text-[var(--color-text-muted)] hover:text-[#0077b5] transition-colors cursor-pointer"
                whileHover={reduce ? {} : { scale: 1.1 }}
              >
                <LinkedinIcon className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Theme Toggle Button */}
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </motion.nav>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────────
// §4.7: min-h-[100dvh] NEVER h-screen. Hero fits in initial viewport.
// §4.7: Headline ≤ 2 lines, subtext ≤ 20 words, CTAs visible.
// §4.7: max 4 text elements in hero. NO tagline below CTAs.
// §4.7: pt-24 max at desktop.
function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();
  const [isGlitching, setIsGlitching] = useState(false);

  const handleGlitch = useCallback(() => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 2000);
  }, []);

  useEffect(() => {
    if (reduce || !headlineRef.current) return;
    const words = headlineRef.current.querySelectorAll('.word');
    gsap.fromTo(
      words,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, stagger: 0.07, duration: 0.4, ease: 'power2.out', delay: 0.3 }
    );
  }, [reduce]);

  const title = 'Diseñando el futuro con sistemas inteligentes.';
  const words = title.split(' ');

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] pt-[88px] pb-16 flex flex-col justify-center overflow-hidden"
      aria-label="Sección principal"
    >
      {/* Background glows — motivated: creates depth/atmosphere for dark-tech aesthetic */}
      <div
        className="glow-orb absolute top-1/4 right-[8%] w-[28vw] h-[28vw] gpu"
        style={{ background: 'var(--color-accent-primary)', opacity: 0.1 }}
        aria-hidden="true"
      />
      <div
        className="glow-orb absolute bottom-1/3 right-[22%] w-[38vw] h-[38vw] gpu"
        style={{ background: 'var(--color-accent-electric)', opacity: 0.05, animationDelay: '4s' }}
        aria-hidden="true"
      />

      <div className="container-lg relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left — content */}
          <div className="lg:col-span-7 space-y-7 min-w-0">
            {/* Status badge — single eyebrow, counts as 1 of the allowed hero elements */}
            <motion.div
              className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border bg-[var(--color-surface)]/60 backdrop-blur-sm transition-colors duration-200 ${
                isGlitching ? 'border-red-500 shadow-[0_0_15px_rgba(255,0,0,0.5)]' : 'border-[var(--color-border)]'
              }`}
              initial={reduce ? false : { opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <span className={`w-2 h-2 rounded-full animate-pulse ${isGlitching ? 'bg-red-500' : 'bg-[var(--color-accent-green)]'}`} aria-hidden="true" />
              <span className={`font-mono text-xs ${isGlitching ? 'text-red-500 font-bold' : 'text-[var(--color-text-muted)]'}`}>
                {isGlitching ? 'AI_OVERRIDE: DETECTED' : 'Disponible para proyectos'}
              </span>
            </motion.div>

            {/* Headline — §4.7: ≤ 2 lines, font-scale appropriate */}
            <h1
              ref={headlineRef}
              className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)]"
            >
              {words.map((word, i) => (
                <span key={i} className="word inline-block mr-[0.3em]" style={{ opacity: reduce ? 1 : 0 }}>
                  {word}
                </span>
              ))}
            </h1>

            {/* Subtext — §4.7: ≤ 20 words */}
            <motion.p
              className="text-base md:text-lg text-[var(--color-text-muted)] max-w-[540px] leading-relaxed text-balance"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
            >
              Full-Stack Developer & TI Engineer (Cand.)
AI Engineering & DevSecOps — Construyendo arquitecturas resilientes.
            </motion.p>

            {/* CTAs — §4.5: ONE label per intent, no wrap */}
            <motion.div
              className="flex flex-wrap gap-4 pt-2"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <a
                href="#contact"
                className="px-6 py-3 bg-[var(--color-accent-primary)] text-[var(--color-obsidian)] rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(var(--color-accent-primary-rgb),0.35)] hover:brightness-110 active:scale-[0.98] transition-all duration-300 cursor-pointer text-sm inline-flex items-center justify-center"
              >
                Trabajemos juntos
              </a>
              <a
                href="#works"
                className="px-6 py-3 border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg font-medium hover:-translate-y-0.5 hover:bg-[var(--color-surface)] hover:border-[var(--color-accent-primary)]/50 hover:shadow-[0_8px_20px_rgba(var(--color-accent-primary-rgb),0.15)] active:scale-[0.98] transition-all duration-300 cursor-pointer text-sm inline-flex items-center justify-center"
              >
                Ver proyectos
              </a>
            </motion.div>

            {/* Environment tags */}
            <motion.div
              className="flex flex-wrap gap-2 pt-1"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {portfolioData.environments.map((env) => (
                <div
                  key={env.name}
                  className="flex items-center gap-1.5 px-3 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md text-xs font-mono text-[var(--color-text-muted)] hover:border-[var(--color-accent-electric)]/40 transition-colors"
                >
                  <Server className="w-3 h-3 text-[var(--color-accent-electric)]" aria-hidden="true" />
                  {env.name}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — avatar visual asset §4.8 */}
          <motion.div
            className="lg:col-span-5 flex justify-center items-center mt-8 lg:mt-0"
            initial={reduce ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 100, damping: 20 }}
          >
            <HeroAvatarReveal isGlitching={isGlitching} onGlitch={handleGlitch} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Work Card ──────────────────────────────────────────────────────────────────
// §4.4: tilt shadow. §4.5: cursor-pointer. §3.B: useMotionValue not useState for physics.
function WorkCard({ work, isEven }: { work: any; isEven: boolean }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const reduce = useReducedMotion();

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['3deg', '-3deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-3deg', '3deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      style={reduce ? {} : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full rounded-xl overflow-hidden border border-[var(--color-border)] group bg-[var(--color-void)] cursor-pointer h-[400px] md:h-[440px] gpu ${
        isEven ? 'md:translate-y-16' : ''
      }`}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[var(--color-obsidian)] via-[var(--color-obsidian)]/50 to-transparent z-10 pointer-events-none"
        style={reduce ? {} : { transform: 'translateZ(8px)' }}
      />
      {/* Image */}
      <div className="absolute inset-0 z-0 bg-[var(--color-surface)] overflow-hidden">
        <img
          src={work.image}
          alt={`Proyecto ${work.title}`}
          className="w-full h-full object-cover opacity-25 group-hover:opacity-55 transition-opacity duration-500"
          loading="lazy"
        />
      </div>
      {/* Hover accent glow */}
      <div
        className="absolute inset-0 z-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 80%, rgba(var(--accent-gemini-rgb), 0.18), transparent 70%)`,
        }}
      />

      {/* Content */}
      <div
        className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none"
        style={reduce ? {} : { transform: 'translateZ(24px)' }}
      >
        <p className="text-xs font-mono text-[var(--color-accent-electric)] mb-2 tracking-wider">{work.category}</p>
        <h3 className="text-xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-primary)] transition-colors duration-200">
          {work.title}
        </h3>
        <p className="text-sm text-[var(--color-text-muted)] mt-2 line-clamp-2 leading-relaxed">{work.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {work.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-xs font-mono px-2 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md text-[var(--color-text-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Links */}
      <div
        className="absolute top-5 right-5 z-30 flex gap-2"
        style={reduce ? {} : { transform: 'translateZ(32px)' }}
      >
        {work.githubUrl && (
          <a
            href={work.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`GitHub de ${work.title}`}
            className="p-2 bg-[var(--color-surface)]/80 border border-[var(--color-border)] rounded-full hover:text-[var(--color-accent-primary)] hover:border-[var(--color-accent-primary)]/50 transition-all duration-200 backdrop-blur pointer-events-auto cursor-pointer"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
        )}
        {work.demoUrl && (
          <a
            href={work.demoUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Demo de ${work.title}`}
            className="p-2 bg-[var(--color-surface)]/80 border border-[var(--color-border)] rounded-full hover:text-[var(--color-accent-electric)] hover:border-[var(--color-accent-electric)]/50 transition-all duration-200 backdrop-blur pointer-events-auto cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

function SelectedWorks() {
  return (
    <div className="w-full px-6 max-w-[1400px] mx-auto">
      <p className="text-[var(--color-text-muted)] text-base max-w-xl mb-10 text-balance leading-relaxed">
        Implementaciones de alto rendimiento para la resolución de problemas complejos en entornos reales.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 pb-12">
        {portfolioData.projects.map((work, index) => (
          <WorkCard key={work.id} work={work} isEven={index % 2 !== 0} />
        ))}
      </div>
    </div>
  );
}



// ── HeyGen AI Video Section ────────────────────────────────────────────────────
// Replaces LinkedIn widget. 3 HeyGen avatar videos in responsive grid.
// Motivated motion: staggered scroll-reveal communicates sequential storytelling.
const heygenVideos = [
  {
    id: 'hg-1',
    src: 'https://app.heygen.com/embeds/b4aee93789934050a35f881a3a30c050',
    title: 'Presentacion con IA — Video 1',
    label: 'Avatar IA · Presentacion',
  },
  {
    id: 'hg-2',
    src: 'https://app.heygen.com/embeds/47998df8222f450ba2ee77ab21569cec',
    title: 'Presentacion con IA — Video 2',
    label: 'Avatar IA · Contenido',
  },
  {
    id: 'hg-3',
    src: 'https://app.heygen.com/embeds/234440781f464f5ba1507e9a25d1753a',
    title: 'Presentacion con IA — Video 3',
    label: 'Avatar IA · Showcasing',
  },
];

function HeyGenSection() {
  const reduce = useReducedMotion();
  return (
    <section
      id="heygen"
      className="py-28 px-6 bg-[var(--color-surface)] border-b border-[var(--color-border)]"
      aria-labelledby="heygen-heading"
    >
      <div className="container-lg">
        {/* Section header — no eyebrow, headline alone is enough (§4.7 EYEBROW RESTRAINT) */}
        <motion.div
          className="mb-12"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            id="heygen-heading"
            className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-3 leading-tight"
          >
            Videos con{' '}
            <span className="gradient-text">Avatar IA</span>
          </h2>
          <p className="text-[var(--color-text-muted)] max-w-lg text-sm leading-relaxed text-balance">
            Produccion de contenido profesional con HeyGen — avatares sinteticos para comunicacion, presentaciones y proyectos de IA generativa.
          </p>
        </motion.div>

        {/* 3-column video grid — exact cell count: 3 items → 3 cells (§4.7 BENTO CELL COUNT) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {heygenVideos.map((video, i) => (
            <motion.div
              key={video.id}
              className="group relative bg-[var(--color-obsidian)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-[var(--color-accent-primary)]/50 transition-colors duration-300"
              initial={reduce ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Label chip */}
              <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-[var(--color-obsidian)]/80 backdrop-blur-sm border border-[var(--color-border)] rounded-full">
                <span className="text-[10px] font-mono text-[var(--color-accent-electric)] tracking-wide">
                  {video.label}
                </span>
              </div>

              {/* Aspect-ratio iframe wrapper — 16:9 responsive, no internal scroll */}
              <div
                className="relative w-full overflow-hidden rounded-xl"
                style={{ aspectRatio: '16/9', overflow: 'hidden', scrollbarWidth: 'none' }}
              >
                <iframe
                  src={video.src}
                  title={video.title}
                  frameBorder="0"
                  allow="encrypted-media; fullscreen;"
                  allowFullScreen
                  loading="lazy"
                  scrolling="no"
                  className="absolute top-0 left-0 border-none"
                  style={{ 
                    width: '102%', 
                    height: '102%', 
                    marginLeft: '-1%', 
                    marginTop: '-1%', 
                    overflow: 'hidden',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  } as React.CSSProperties}
                />
              </div>

              {/* Card footer */}
              <div className="px-4 py-3 border-t border-[var(--color-border)]">
                <p className="text-xs font-mono text-[var(--color-text-muted)] truncate">
                  {video.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── YouTube Channel Widget ─────────────────────────────────────────────────────
// Split layout: featured video embed (left) + channel info (right).
// Different layout family from HeyGen grid — §4.7 Section-Layout-Repetition Ban.
function YouTubeSection() {
  const reduce = useReducedMotion();
  return (
    <section
      id="youtube"
      className="py-28 px-6 bg-[var(--color-obsidian)]"
      aria-labelledby="youtube-heading"
    >
      <div className="container-lg">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Left — featured video embed */}
          <div className="relative">
            {/* Glow behind video */}
            <div
              className="absolute -inset-3 rounded-2xl blur-2xl opacity-20 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, #FF0000 0%, #FF6B6B 100%)' }}
              aria-hidden="true"
            />
            <div className="relative bg-[var(--color-void)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-red-500/30 transition-colors duration-300">
              {/* YouTube badge */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-2.5 py-1 bg-[var(--color-obsidian)]/85 backdrop-blur-sm border border-[var(--color-border)] rounded-full">
                {/* YouTube icon SVG */}
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#FF0000]" aria-hidden="true">
                  <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
                </svg>
                <span className="text-[10px] font-mono text-[var(--color-text-muted)] tracking-wide">YouTube</span>
              </div>

              {/* 16:9 responsive iframe */}
              <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                <iframe
                  src="https://www.youtube.com/embed/kToT4VRtZWw?si=cv3OKALsffu9XRx6"
                  title="Ingenieria de Software Aplicada: Arquitectura del Backend — YouTube"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Right — channel info */}
          <div className="space-y-6">
            <div>
              <h2
                id="youtube-heading"
                className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] leading-tight mb-3"
              >
                Canal de{' '}
                <span style={{ color: '#FF4444' }}>YouTube</span>
              </h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed text-sm text-balance">
                Contenido sobre ingenieria de software, DevSecOps y herramientas de IA. Primer video generado con NotebookLM — tecnologia de IA de Google para transformar contenido en audio y video.
              </p>
            </div>

            {/* Channel stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Canal', value: '@JimmyCevaZam' },
                { label: 'Enfoque', value: 'DevSecOps & AI' },
                { label: 'Primer video', value: 'NotebookLM' },
                { label: 'Plataforma', value: 'YouTube' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg"
                >
                  <p className="text-[10px] font-mono text-[var(--color-text-subtle)] uppercase tracking-widest mb-1">
                    {stat.label}
                  </p>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA — single intent: subscribe / visit channel */}
            <a
              href="https://www.youtube.com/@JimmyCevaZam"
              target="_blank"
              rel="noreferrer"
              id="youtube-channel-cta"
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#FF0000] hover:bg-[#CC0000] text-white font-semibold rounded-lg transition-colors duration-200 cursor-pointer text-sm active:scale-[0.98]"
            >
              {/* YouTube icon */}
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0" aria-hidden="true">
                <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
              </svg>
              Ver canal
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Tech Stack Showcase ────────────────────────────────────────────────────────
// §4.4: Cards only where elevation communicates hierarchy. Shadow tinted.
// §3.B: useMotionValue for pointer physics.
function InteractiveCard({ category, index }: { category: any; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 8;
    const rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current && !reduce) {
      cardRef.current.style.transition = 'transform 0.4s ease';
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    }
  };

  const accentColors = ['#22D3EE', '#7C6FF7', '#34D399'];
  const icons = [
    <Layers className="w-7 h-7" aria-hidden="true" />,
    <Database className="w-7 h-7" aria-hidden="true" />,
    <Bot className="w-7 h-7" aria-hidden="true" />,
  ];

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative p-6 md:p-8 backdrop-blur-md bg-[var(--color-surface)]/25 border border-[var(--color-border)] rounded-xl flex flex-col overflow-hidden group hover:border-[var(--color-accent-primary)]/40 hover:bg-[var(--color-surface)]/45 transition-all duration-200 ease-out h-full cursor-default"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Glow accent — motivated: highlights tech category with brand color */}
      <div
        className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none blur-2xl"
        style={{ background: accentColors[index % 3] }}
        aria-hidden="true"
      />

      <h3
        className="text-base font-bold font-mono text-[var(--color-text-primary)] mb-5 flex items-center gap-2.5 border-b border-[var(--color-border)] pb-4 relative z-10"
        style={{ color: accentColors[index % 3] }}
      >
        {icons[index % 3]}
        <span className="text-[var(--color-text-primary)]">{category.title}</span>
      </h3>

      <div className="space-y-3 flex-1 relative z-10">
        {category.items.map((item: any) => (
          <div
            key={item.id}
            className="p-4 bg-[var(--color-void)]/70 border border-[var(--color-border)]/50 rounded-lg hover:border-[var(--color-border)] transition-colors backdrop-blur-sm"
          >
            <h4 className="font-semibold text-[var(--color-text-primary)] text-sm mb-1.5 flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: accentColors[index % 3] }}
                aria-hidden="true"
              />
              {item.name}
            </h4>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function TechStackShowcase() {
  return (
    <div className="max-w-[1400px] mx-auto w-full px-6">
      <p className="text-[var(--color-text-muted)] max-w-xl text-balance text-base leading-relaxed mb-10">
        Ecosistema completo de Inteligencia Artificial, herramientas de desarrollo y base técnica para entornos de alta exigencia.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8" style={{ perspective: '1200px' }}>
        {portfolioData.techStack.map((category, idx) => (
          <InteractiveCard key={category.title} category={category} index={idx} />
        ))}
      </div>
    </div>
  );
}

// ── AI Art Gallery ─────────────────────────────────────────────────────────────
// §5: ONE marquee per page (this is the only one). Motion motivated: depth + portfolio breadth.
// §3.B: useAnimationFrame + useMotionValue — NOT useState for continuous values.
function AIArtGallery() {
  const baseX = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const reduce = useReducedMotion();
  const marqueeItems = Array(10).fill(portfolioData.aiGallery).flat();

  useAnimationFrame((_time, delta) => {
    if (reduce || isHovered || isDragging || baseX.isAnimating()) return;
    baseX.set(baseX.get() - 0.05 * delta);
  });

  return (
    <section id="art" className="py-28 overflow-hidden bg-[var(--color-surface)] border-b border-[var(--color-border)]" aria-labelledby="gallery-heading">
      <div className="px-6 max-w-[1400px] mx-auto mb-10 flex items-end justify-between">
        <div>
          <h2 id="gallery-heading" className="text-3xl md:text-4xl font-bold mb-3 text-[var(--color-text-primary)]">
            Galería de Arte IA
          </h2>
          <p className="text-[var(--color-text-muted)] max-w-md text-balance text-sm leading-relaxed">
            Orquestación y generación avanzada de imágenes mediante Gemini. Arrastra para explorar.
          </p>
        </div>
      </div>

      <div className="relative w-full cursor-grab active:cursor-grabbing overflow-hidden pb-8">
        <motion.div
          className="flex gap-5 w-max"
          style={{ x: baseX }}
          drag="x"
          dragConstraints={{ right: 0, left: -50000 }}
          dragMomentum={true}
          dragElastic={0.05}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {marqueeItems.map((art, index) => (
            <div
              key={`${art.id}-${index}`}
              className="h-[280px] md:h-[380px] border border-[var(--color-border)] rounded-xl overflow-hidden group relative bg-[var(--color-void)] shrink-0 hover:border-[var(--color-accent-primary)]/40 transition-colors duration-200"
            >
              <img
                src={art.image}
                alt="Arte generado por IA"
                className="h-full w-auto object-contain bg-[var(--color-obsidian)]"
                draggable={false}
                loading="lazy"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Contact ────────────────────────────────────────────────────────────────────
// §4.5: Full state cycle: idle/loading/success/error. Form contrast check: §4.5 WCAG AA.
// §4.6: Label ABOVE input. No placeholder-as-label.
function Contact() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const reduce = useReducedMotion();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <section id="contact" className="py-28 px-6 max-w-[1400px] mx-auto" aria-labelledby="contact-heading">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left */}
        <div>
          <h2 id="contact-heading" className="text-4xl md:text-5xl font-bold mb-5 text-[var(--color-text-primary)] leading-tight">
            Trabajemos juntos
          </h2>
          <p className="text-[var(--color-text-muted)] mb-10 leading-relaxed text-balance">
            Disponible para arquitectura frontend y automatización DevSecOps. Envía tu mensaje.
          </p>

          <div className="space-y-5 font-mono text-sm">
            <div className="flex items-center gap-4">
              <Mail className="w-4 h-4 text-[var(--color-accent-electric)] shrink-0" aria-hidden="true" />
              <a
                href="mailto:jimdav1506ceva@gmail.com"
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                jimdav1506ceva@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="w-4 h-4 text-[var(--color-accent-electric)] shrink-0" aria-hidden="true" />
              <span className="text-[var(--color-text-muted)]">Manabí, Ecuador [UTC-5]</span>
            </div>
          </div>

          {/* Philosophy quote — visual rhythm, not hero */}
          <motion.blockquote
            className="mt-12 border-l-2 border-[var(--color-accent-primary)] pl-5 text-sm italic text-[var(--color-text-muted)]/80 leading-relaxed max-w-[420px]"
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            "No se trata de tener la mejor idea, sino de ejecutar mejor que los demas y no rendirse en el proceso."
          </motion.blockquote>
        </div>

        {/* Form — §4.6: label above, no placeholder-as-label */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-[var(--color-surface)]/50 backdrop-blur-md p-8 rounded-xl border border-[var(--color-border)] shadow-2xl relative z-10"
          aria-label="Formulario de contacto"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-mono text-[var(--color-text-muted)] mb-2 uppercase tracking-wider"
            >
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full bg-[var(--color-obsidian)]/50 border border-[var(--color-border)] rounded-lg px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)]/40 transition-all placeholder:text-[var(--color-text-subtle)] text-sm"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-mono text-[var(--color-text-muted)] mb-2 uppercase tracking-wider"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full bg-[var(--color-obsidian)]/50 border border-[var(--color-border)] rounded-lg px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)]/40 transition-all placeholder:text-[var(--color-text-subtle)] text-sm"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-xs font-mono text-[var(--color-text-muted)] mb-2 uppercase tracking-wider"
            >
              Mensaje
            </label>
        <textarea
              id="message"
              name="message"
              required
              rows={4}
              className="w-full bg-[var(--color-void)]/50 border border-[var(--color-border)] rounded-lg px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-primary)] focus:bg-white/[0.03] focus:ring-1 focus:ring-[var(--color-accent-primary)]/40 transition-all resize-none placeholder:text-[var(--color-text-subtle)] text-sm"
              placeholder="Descripcion del proyecto o consulta tecnica..."
            />
          </div>

          {/* §4.5: Button contrast check: white text on violet (✓ WCAG AA). No wrap at desktop. */}
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            id="contact-submit"
            className="w-full py-3 bg-[var(--color-accent-primary)] text-[var(--color-obsidian)] rounded-lg font-semibold disabled:opacity-50 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(var(--color-accent-primary-rgb),0.35)] hover:brightness-110 active:scale-[0.98] transition-all duration-300 font-mono tracking-wide text-sm relative z-20"
          >
            {status === 'idle'    && 'Enviar mensaje'}
            {status === 'loading' && 'Enviando...'}
            {status === 'success' && 'Mensaje enviado'}
            {status === 'error'   && 'Error al enviar'}
          </button>
        </form>
      </div>
    </section>
  );
}

// ── Floating Reminder Widget ──────────────────────────────────────────────────
function ReminderWidget() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeQuote, setActiveQuote] = useState(0);

  const quotes = [
    {
      text: "No necesitas tener todas las respuestas, solo necesitas dar el primer paso y mejorar en el camino.",
      author: "Enfoque"
    },
    {
      text: "La acción imperfecta hoy, siempre será mejor que la idea perfecta mañana.",
      author: "Acción"
    },
    {
      text: "Allá lejos, a la luz del sol, están mis mayores aspiraciones. Puede que no las alcance, pero puedo mirar hacia arriba y ver su belleza.",
      author: "Louisa May Alcott"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          className="fixed bottom-6 left-6 z-[80] max-w-sm bg-[var(--color-surface)]/95 backdrop-blur-md border border-[var(--color-border)] rounded-xl p-5 shadow-2xl font-mono text-xs select-none"
        >
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2 mb-3">
            <span className="text-[var(--color-accent-electric)] font-bold tracking-wider animate-pulse flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-electric)]" />
              SYS_REMINDER: ACTIVE
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[var(--color-text-muted)] hover:text-white transition-colors cursor-pointer"
            >
              [MINIMIZE]
            </button>
          </div>

          <div className="space-y-3 min-h-[90px] flex flex-col justify-between">
            <p className="text-[var(--color-text-primary)]/95 italic leading-relaxed text-pretty text-[11px]">
              "{quotes[activeQuote].text}"
            </p>
            <p className="text-right text-[var(--color-accent-primary)] font-semibold text-[10px]">
              — {quotes[activeQuote].author}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--color-border)]">
            <div className="flex gap-1.5">
              {quotes.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveQuote(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                    activeQuote === idx ? 'bg-[var(--color-accent-electric)] w-3' : 'bg-[var(--color-border)]'
                  }`}
                  aria-label={`Ver cita ${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setActiveQuote((prev) => (prev + 1) % quotes.length)}
              className="text-[var(--color-accent-electric)] hover:text-white transition-colors cursor-pointer text-[10px]"
            >
              SIGUIENTE &gt;
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-[80] px-3.5 py-2 bg-[var(--color-surface)]/90 backdrop-blur-md border border-[var(--color-accent-electric)]/30 hover:border-[var(--color-accent-electric)] rounded-full text-xs font-mono text-[var(--color-accent-electric)] shadow-lg hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-electric)] animate-pulse" />
          [ ✦ ] SYS_REMINDER
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'dark';
  });
  const [showLiteraryModal, setShowLiteraryModal] = useState(false);
  const [isDestroyed, setIsDestroyed] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    let keys = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      keys = (keys + e.key.toUpperCase()).slice(-3);
      if (keys === 'LOG') {
        setShowLiteraryModal(true);
        keys = '';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    (window as any).destroy = () => {
      setIsDestroyed(true);
      setTimeout(() => {
        window.location.reload();
      }, 5000);
      return "System override accepted. Initiating self-destruct sequence...";
    };
    console.log("%c¿Quieres probar el rendimiento del sistema? Escribe destroy() en la consola y presiona Enter.", "color: #34D399; font-size: 14px;");
  }, []);

  useEffect(() => {
    if (isDestroyed) {
      document.body.classList.add('destroy-shake');
      gsap.to("main > *, nav, footer", {
        y: window.innerHeight,
        rotation: () => Math.random() * 90 - 45,
        opacity: 0,
        duration: 2.5,
        stagger: 0.1,
        ease: "power3.in",
      });
    }
  }, [isDestroyed]);

  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] text-[var(--color-text-primary)] font-sans antialiased selection:bg-[var(--color-accent-primary)]/30 selection:text-[var(--color-text-primary)] overflow-x-hidden relative">
      <AnimatePresence>
        {showLiteraryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0a0f1d]/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0f1d] border border-blue-900/50 rounded-lg shadow-2xl overflow-hidden font-mono"
            >
              <div className="terminal-scanline" />
              <div className="p-4 border-b border-blue-900/50 bg-[#0f172a] flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-500 text-sm">
                  <Bot className="w-4 h-4 animate-pulse" />
                  <span className="terminal-cursor">[ACCESS_GRANTED]: LOADING_PERSONAL_ARCHIVES....</span>
                </div>
                <button
                  onClick={() => setShowLiteraryModal(false)}
                  className="text-blue-500 hover:text-cyan-400 text-xs px-3 py-1 border border-blue-900/50 hover:border-cyan-400/50 rounded transition-colors"
                >
                  SYS.EXIT()
                </button>
              </div>
              <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-cyan-400 mb-2">{literaryArchive.title}</h2>
                <p className="text-blue-500/60 text-xs mb-6 uppercase">{literaryArchive.date} // CODENAME: {literaryArchive.codename}</p>
                <div className="text-blue-100/80 whitespace-pre-wrap text-sm leading-relaxed">
                  {literaryArchive.content}
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setShowLiteraryModal(false)}
                    className="px-4 py-2 bg-cyan-950/30 text-cyan-400 border border-cyan-800/50 hover:bg-cyan-900/50 hover:border-cyan-400 rounded transition-all text-sm"
                  >
                    Close Archive
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <DottedSurface />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />

        <StickyTabs contentLayoutClassName="w-full py-12">
          <StickyTabs.Item title="Proyectos Destacados" id="works">
            <SelectedWorks />
          </StickyTabs.Item>
          <StickyTabs.Item title="Certificaciones e Hitos" id="certificates">
            <Certificates />
          </StickyTabs.Item>
          <StickyTabs.Item title="AI Showcase & Tech Stack" id="stack">
            <TechStackShowcase />
          </StickyTabs.Item>
        </StickyTabs>

        <HeyGenSection />
        <YouTubeSection />
        <AIArtGallery />
      </main>

      <div className="relative overflow-hidden bg-[var(--color-obsidian)] border-t border-[var(--color-border)]">
        {/* Background Video */}
        <video
          src="/animation-footer-background/yo_animado_programando.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-20 pointer-events-none"
        />
        {/* Dark overlays for aesthetic transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-obsidian)] via-transparent to-black/80 z-0 pointer-events-none" />

        <div className="relative z-10">
          <Contact />
          <footer className="py-10 px-6 text-center font-mono text-xs text-[var(--color-text-subtle)] border-t border-[var(--color-border)] bg-transparent">
            <p>&copy; {new Date().getFullYear()} David Cevallos — DC.dev</p>
            <p className="mt-1 text-[var(--color-accent-electric)]/50">Sistema v3.1.0</p>
          </footer>
        </div>
      </div>

      <ReminderWidget />
    </div>
  );
}
