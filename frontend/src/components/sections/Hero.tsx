/**
 * @author Jimmy David Cevallos Zambrano
 * @project personal_web v1.0.0
 * @integrity SHA256:c4d5e6f7a8b9c0d1
 * @license Propietario — Prohibida reproducción sin autorización
 */
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export function Hero() {
  const textRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    if (textRef.current) {
      const chars = textRef.current.innerText.split('');
      textRef.current.innerText = '';
      chars.forEach((c) => {
        const span = document.createElement('span');
        span.innerText = c === ' ' ? '\u00A0' : c;
        span.style.opacity = '0';
        textRef.current?.appendChild(span);
      });
      
      gsap.to(textRef.current.children, {
        opacity: 1,
        stagger: 0.05,
        duration: 0.1,
        ease: 'power2.inOut',
        delay: 0.5
      });
    }
  }, []);

  return (
    <section id="hero" className="relative min-h-screen pt-32 pb-20 px-6 max-w-[1440px] mx-auto flex flex-col justify-center overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center z-10">
        <div className="lg:col-span-8 space-y-8">
          <motion.div 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="font-mono text-xs text-text-muted">SYSTEM: ONLINE_</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-sans font-bold leading-tight text-balance">
            <span ref={textRef} className="text-text-primary block h-[1.2em]">Engineering the future</span>
            <span className="text-text-muted">with intelligent systems.</span>
          </h1>
          
          <motion.p 
            className="text-xl text-text-muted max-w-2xl text-balance"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            IA Engineering & DevSecOps specialist building resilient, high-performance architectures.
          </motion.p>
          
          <motion.div 
            className="flex gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <button className="px-6 py-3 bg-accent-primary text-text-primary rounded font-medium hover:bg-accent-primary/90 transition-colors">
              Explore Works
            </button>
            <button className="px-6 py-3 border border-border text-text-primary rounded font-medium hover:bg-surface transition-colors">
              Contact Protocol
            </button>
          </motion.div>
        </div>
      </div>
      
      {/* Asymmetric decoration */}
      <div className="absolute top-1/4 right-[10%] w-[30vw] h-[30vw] bg-accent-primary/10 rounded-full blur-[100px] pointer-events-none gpu" />
      <div className="absolute bottom-1/4 right-[20%] w-[40vw] h-[40vw] bg-accent-electric/5 rounded-full blur-[120px] pointer-events-none gpu" />
    </section>
  );
}
