/**
 * @author Jimmy David Cevallos Zambrano
 * @project personal_web v1.0.0
 * @integrity SHA256:e5f6g7h8i9j0k1l2
 * @license Propietario — Prohibida reproducción sin autorización
 */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function FedoraPhilosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      // Simulate SplitText by splitting into words
      const words = textRef.current.innerText.split(' ');
      textRef.current.innerHTML = '';
      
      words.forEach((word) => {
        const span = document.createElement('span');
        span.innerText = word + ' ';
        span.style.opacity = '0.2';
        span.style.display = 'inline-block';
        textRef.current?.appendChild(span);
      });

      gsap.to(textRef.current.children, {
        opacity: 1,
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 50%',
          scrub: true,
        }
      });
    }
  }, []);

  return (
    <section id="philosophy" ref={sectionRef} className="py-32 px-6 bg-surface">
      <div className="container mx-auto max-w-[1024px]">
        <div className="mb-12 font-mono text-sm text-accent-electric flex items-center gap-4">
          <span className="w-12 h-[1px] bg-border" />
          01 // FILOSOFÍA FEDORA
        </div>
        <p 
          ref={textRef} 
          className="text-3xl md:text-5xl font-sans font-medium leading-tight text-text-primary text-balance"
        >
          El desarrollo de software premium no se trata solo de escribir código. Se trata de esculpir soluciones con precisión técnica, priorizando la seguridad desde el diseño, optimizando cada ciclo del procesador y manteniendo un respeto inquebrantable por la experiencia del usuario final.
        </p>
      </div>
    </section>
  );
}
