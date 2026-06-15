/**
 * @author Jimmy David Cevallos Zambrano
 * @project personal_web v1.0.0
 * @integrity SHA256:d1b2a3b4c5d6e7f8
 * @license Propietario — Prohibida reproducción sin autorización
 */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: 'top -50',
      onUpdate: (self) => {
        setIsScrolled(self.scroll() > 50);
      }
    });
    return () => trigger.kill();
  }, []);

  return (
    <motion.nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'blur-backdrop bg-void/80 py-4 border-b border-border' : 'bg-transparent py-6'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container mx-auto px-6 max-w-[1440px] flex items-center justify-between">
        <div className="font-mono font-bold text-accent-primary text-xl tracking-tight">
          JD<span className="text-accent-electric">.</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-sans">
          {['Works', 'Philosophy', 'Showcase', 'Contact'].map((item) => (
            <motion.a 
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-text-muted hover:text-text-primary transition-colors"
              whileHover={{ y: -2 }}
            >
              {item}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
