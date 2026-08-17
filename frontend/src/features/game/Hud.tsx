// Barra superior de la partida: jugador, nivel, puntaje, insignias, vidas,
// tiempo y pausa.

import { formatTime } from "../../format"

// Los corazones perdidos quedan vacios en vez de desaparecer.
const VIDAS_MOSTRADAS = 3

interface Props {
  nickname: string
  levelName: string
  score: number
  badges: number
  lives: number
  explorationPct: number
  seconds: number
  onPause: () => void
  onExit: () => void
}

export function Hud({
  nickname, levelName, score, badges, lives, explorationPct, seconds,
  onPause, onExit,
}: Props) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-3 font-mono text-white">
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={onExit}
          aria-label="Salir del nivel"
          className="pointer-events-auto rounded bg-black/55 px-2 py-1 text-xs backdrop-blur-sm hover:bg-black/75"
        >
          ×
        </button>

        <div className="rounded bg-black/55 px-3 py-1.5 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-widest">{nickname}</p>
          <p className="text-[10px] text-espol-celeste">{levelName}</p>
          <div className="mt-1 h-1.5 w-28 overflow-hidden rounded bg-white/25">
            <div className="h-full bg-espol-celeste transition-all" style={{ width: `${explorationPct}%` }} />
          </div>
          <p className="mt-0.5 text-[9px] text-white/75">EXPLORACION {explorationPct}%</p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="rounded bg-black/55 px-3 py-1.5 text-right text-xs backdrop-blur-sm">
          <p className="text-[9px] uppercase tracking-widest text-white/75">Puntaje</p>
          <p className="text-lg font-bold leading-none">{score.toLocaleString("es-EC")} pts</p>

          <dl className="mt-1.5 space-y-0.5 text-[10px]">
            <div className="flex items-center justify-end gap-2">
              <dt className="uppercase tracking-wider text-white/75">Insignias</dt>
              <dd className="w-10 text-left font-bold">◆ {badges}</dd>
            </div>
            <div className="flex items-center justify-end gap-2">
              <dt className="uppercase tracking-wider text-white/75">Vidas</dt>
              <dd className="w-10 text-left font-bold text-red-300">
                {"♥".repeat(lives)}{"♡".repeat(Math.max(0, VIDAS_MOSTRADAS - lives))}
              </dd>
            </div>
            <div className="flex items-center justify-end gap-2">
              <dt className="uppercase tracking-wider text-white/75">Tiempo</dt>
              <dd className="w-10 text-left font-bold">{formatTime(seconds)}</dd>
            </div>
          </dl>
        </div>

        <button
          type="button"
          onClick={onPause}
          aria-label="Pausar"
          className="pointer-events-auto rounded bg-black/55 px-2 py-1 text-sm backdrop-blur-sm hover:bg-black/75"
        >
          ❚❚
        </button>
      </div>
    </div>
  )
}
