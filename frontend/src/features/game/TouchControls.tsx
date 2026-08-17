// Controles tactiles: D-pad a la izquierda, botones A y B a la derecha.
interface Props {
  onLeft: (activo: boolean) => void
  onRight: (activo: boolean) => void
  onJump: (activo: boolean) => void
  onInteract: () => void
  canInteract: boolean
}

export function TouchControls({
  onLeft, onRight, onJump, onInteract, canInteract,
}: Props) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-4">
      <div className="pointer-events-auto text-center">
        <div className="flex items-center gap-2">
          <Boton etiqueta="◀" alPresionar={onLeft} />
          <Boton etiqueta="▲" alPresionar={onJump} />
          <Boton etiqueta="▶" alPresionar={onRight} />
        </div>
        <p className="mt-1 rounded bg-black/45 font-mono text-[9px] tracking-[0.3em] text-white/80 backdrop-blur-sm">D-PAD</p>
      </div>

      <div className="pointer-events-auto flex items-end gap-4">
        <div className="text-center">
          <BotonAccion etiqueta="B" alPresionar={onJump} />
          <p className="mt-1 rounded bg-black/45 font-mono text-[9px] tracking-[0.2em] text-white/80 backdrop-blur-sm">SALTAR</p>
        </div>
        <div className="text-center">
          <BotonAccion etiqueta="A" alPulsar={onInteract} resaltado={canInteract} />
          <p className="mt-1 rounded bg-black/45 font-mono text-[9px] tracking-[0.2em] text-white/80 backdrop-blur-sm">INTERACTUAR</p>
          <p className="rounded bg-black/45 font-mono text-[8px] tracking-[0.2em] text-white/70 backdrop-blur-sm">TECLA E</p>
        </div>
      </div>
    </div>
  )
}

// Mantener presionado mueve; soltar detiene.
function Boton({ etiqueta, alPresionar }: { etiqueta: string; alPresionar: (a: boolean) => void }) {
  return (
    <button
      type="button"
      onPointerDown={(e) => { e.preventDefault(); alPresionar(true) }}
      onPointerUp={() => alPresionar(false)}
      onPointerLeave={() => alPresionar(false)}
      onPointerCancel={() => alPresionar(false)}
      className="h-12 w-12 select-none touch-none rounded-lg border border-white/30 bg-black/50 text-lg text-white backdrop-blur-sm transition active:scale-95 active:bg-black/70"
    >
      {etiqueta}
    </button>
  )
}

function BotonAccion({
  etiqueta, alPresionar, alPulsar, resaltado,
}: {
  etiqueta: string
  alPresionar?: (a: boolean) => void
  alPulsar?: () => void
  resaltado?: boolean
}) {
  return (
    <button
      type="button"
      onPointerDown={(e) => {
        e.preventDefault()
        alPulsar?.()
        alPresionar?.(true)
      }}
      onPointerUp={() => alPresionar?.(false)}
      onPointerLeave={() => alPresionar?.(false)}
      onPointerCancel={() => alPresionar?.(false)}
      className={`h-16 w-16 select-none touch-none rounded-full border-2 text-xl font-bold text-white backdrop-blur-sm transition active:scale-95 ${
        resaltado
          ? "animate-pulse border-espol-celeste bg-espol-celeste/50 shadow-lg shadow-espol-celeste/40"
          : "border-white/40 bg-white/20 active:bg-white/40"
      }`}
    >
      {etiqueta}
    </button>
  )
}
