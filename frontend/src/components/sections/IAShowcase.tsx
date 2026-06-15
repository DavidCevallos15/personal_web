/**
 * @author Jimmy David Cevallos Zambrano
 * @project personal_web v1.0.0
 * @integrity SHA256:c0d1e2f3g4h5i6j7
 * @license Propietario — Prohibida reproducción sin autorización
 */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

const MODELS = [
  { id: 1, name: 'Neural Synthesizer', desc: 'Real-time inference engine' },
  { id: 2, name: 'Vision Transformer', desc: 'Object detection at edge' },
  { id: 3, name: 'LLM RAG Pipeline', desc: 'Enterprise context retrieval' },
  { id: 4, name: 'AutoML Studio', desc: 'No-code training UI' },
];

export function IAShowcase() {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sliderRef.current) {
      Draggable.create(sliderRef.current, {
        type: 'x',
        bounds: { minX: -800, maxX: 0 },
      });
    }
  }, []);

  return (
    <section id="showcase" className="py-32 overflow-hidden bg-obsidian border-y border-border">
      <div className="px-6 max-w-[1440px] mx-auto mb-12">
        <h2 className="text-4xl font-bold">IA Showcase</h2>
        <p className="text-text-muted mt-2">Drag to explore AI models.</p>
      </div>
      
      <div className="pl-6 max-w-[1440px] mx-auto cursor-grab active:cursor-grabbing pb-12">
        <div ref={sliderRef} className="flex gap-6 w-max">
          {MODELS.map((model) => (
            <div 
              key={model.id} 
              className="w-[300px] md:w-[400px] h-[300px] bg-surface border border-border p-8 rounded-xl shrink-0 flex flex-col justify-end transition-colors hover:border-accent-electric/50"
            >
              <div className="w-12 h-12 rounded-full bg-accent-electric/10 mb-auto flex items-center justify-center">
                <span className="w-4 h-4 bg-accent-electric rounded-full animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{model.name}</h3>
              <p className="text-text-muted font-mono text-sm">{model.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
