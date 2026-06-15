/**
 * @author Jimmy David Cevallos Zambrano
 * @project personal_web v1.0.0
 * @integrity SHA256:d1e2f3g4h5i6j7k8
 * @license Propietario — Prohibida reproducción sin autorización
 */
import { useState } from 'react';
import { motion } from 'framer-motion';

export function Contact() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate Web3Forms submission
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <section id="contact" className="py-32 px-6 max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Initiate Protocol</h2>
          <p className="text-text-muted mb-8 text-balance">
            Available for selected freelance opportunities and architectural consulting. 
            Send a transmission via the secure channel.
          </p>
          
          <div className="space-y-4 font-mono text-sm">
            <p className="flex items-center gap-4">
              <span className="text-accent-electric">EMAIL</span>
              <a href="mailto:jimdav1506ceva@gmail.com" className="hover:text-text-primary transition-colors">jimdav1506ceva@gmail.com</a>
            </p>
            <p className="flex items-center gap-4">
              <span className="text-accent-electric">LOC</span>
              <span>Manabí, Ecuador [UTC-5]</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-surface p-8 rounded-xl border border-border">
          <div>
            <label htmlFor="name" className="block text-xs font-mono text-text-muted mb-2">IDENTIFICATION</label>
            <input 
              type="text" 
              id="name" 
              required
              className="w-full bg-void border border-border rounded px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-xs font-mono text-text-muted mb-2">RETURN_CHANNEL</label>
            <input 
              type="email" 
              id="email" 
              required
              className="w-full bg-void border border-border rounded px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-xs font-mono text-text-muted mb-2">PAYLOAD</label>
            <textarea 
              id="message" 
              required
              rows={4}
              className="w-full bg-void border border-border rounded px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary transition-colors resize-none"
              placeholder="Describe your project requirements..."
            />
          </div>
          
          <motion.button 
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="w-full py-3 bg-accent-primary text-text-primary rounded font-bold disabled:opacity-50 relative overflow-hidden group cursor-pointer"
            whileHover={{ scale: status === 'idle' ? 1.02 : 1 }}
            whileTap={{ scale: status === 'idle' ? 0.98 : 1 }}
          >
            <span className="relative z-10">
              {status === 'idle' && 'TRANSMIT MESSAGE'}
              {status === 'loading' && 'ENCRYPTING...'}
              {status === 'success' && 'PAYLOAD DELIVERED'}
              {status === 'error' && 'TRANSMISSION FAILED'}
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
          </motion.button>
        </form>
      </div>
    </section>
  );
}
