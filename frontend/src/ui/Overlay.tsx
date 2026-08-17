// Ventana sobre el juego, con el escenario atenuado detras.
// Se monta dentro del GameFrame.
import type { ReactNode } from "react"

interface Props {
  title: string
  subtitle?: string
  onClose?: () => void
  children: ReactNode
  footer?: ReactNode
}

export function Overlay({ title, subtitle, onClose, children, footer }: Props) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 p-3">
      <section
        role="dialog"
        aria-label={title}
        className="flex max-h-full w-full max-w-2xl flex-col rounded-lg bg-espol-arena text-espol-azulOscuro shadow-2xl"
      >
        <header className="flex items-start justify-between border-b border-black/10 px-4 py-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-espol-azul">
              ESPOL Quest
            </p>
            <h2 className="text-lg font-bold leading-tight">{title}</h2>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="rounded border border-black/20 px-2 leading-none text-lg hover:bg-black/5"
            >
              ×
            </button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-3">{children}</div>

        {footer && <footer className="border-t border-black/10 px-4 py-3">{footer}</footer>}
      </section>
    </div>
  )
}
