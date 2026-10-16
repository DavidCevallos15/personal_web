/**
 * @author David Cevallos
 * @project DC.dev · personal_web v4
 * @skills web-animation-stack + design-taste-frontend + motion principles (Emil Kowalski)
 */
import { useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { Navbar } from '@/components/layout/Navbar';
import { PointerExperience } from '@/components/motion/PointerExperience';
import { EasterEggs, ReminderWidget } from '@/components/easter/EasterEggs';
import { StickyTabs } from '@/components/ui/StickyTabs';
import { Hero } from '@/sections/Hero';
import { Studio } from '@/sections/Studio';
import { Projects } from '@/sections/Projects';
import { Certificates } from '@/sections/Certificates';
import { TechStack } from '@/sections/TechStack';
import { ContentHub } from '@/sections/ContentHub';
import { Game } from '@/sections/Game';
import { GamePrompt } from '@/components/ui/GamePrompt';
import { AIGallery } from '@/sections/AIGallery';
import { Contact } from '@/sections/Contact';

type Theme = 'dark' | 'light';

function readTheme(): Theme {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    /* storage bloqueado: usar preferencia del sistema */
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* noop */
    }
  }, [theme]);

  return (
    <MotionConfig reducedMotion="user">
      <a href="#works" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent-primary focus:px-4 focus:py-2 focus:text-obsidian">
        Saltar al contenido
      </a>
      <Navbar theme={theme} onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} />
      <main>
        <Hero />
        <Studio />
        <StickyTabs mainNavHeight="4rem">
          <StickyTabs.Item title="Proyectos destacados" id="works">
            <Projects />
          </StickyTabs.Item>
          <StickyTabs.Item title="Certificaciones" id="certificates">
            <Certificates />
          </StickyTabs.Item>
          <StickyTabs.Item title="Stack" id="stack">
            <TechStack />
          </StickyTabs.Item>
        </StickyTabs>
        <Game />
        <ContentHub />
        <AIGallery />
      </main>
      <Contact />
      <PointerExperience />
      <ReminderWidget />
      <GamePrompt />
      <EasterEggs />
    </MotionConfig>
  );
}
