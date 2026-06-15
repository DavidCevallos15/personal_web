import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { mountAuthorSignature, mountKonamiEasterEgg } from './lib/AuthorSignature'

mountAuthorSignature();
mountKonamiEasterEgg();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
