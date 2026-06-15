# Sub-Skill: Tailwind v4 + shadcn/ui — Reglas de Compilación

## Estado de compatibilidad (2025)
shadcn/ui >=2.3 es compatible con Tailwind v4.
Usar el CLI oficial para agregar componentes:
```bash
npx shadcn@latest init
npx shadcn@latest add button card dialog
```

## Conflictos conocidos a evitar
- NO instalar @tailwindcss/typography v0.5 (incompatible con v4)
- Usar @tailwindcss/typography v0.6+ si se necesita
- cn() utility requiere clsx + tailwind-merge

## Patrón de componente shadcn personalizado
```tsx
import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'electric'
}
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
        variant === 'electric' && 'bg-accent-electric text-obsidian hover:opacity-90',
        className
      )}
      {...props}
    />
  )
)
Button.displayName = 'Button'
export { Button }
```
