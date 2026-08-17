// Mapa del campus: sendero de niveles con su estado de desbloqueo.
// Responsable: Kevin Galvez - RF-02

import { useEffect, useState } from "react"
import { api } from "../../api/client"
import type { LevelProgress, LevelSummary, Player } from "../../api/types"
import { MissionList } from "../missions/MissionList"

interface Props {
  player: Player
  onPlay: (levelCode: string) => void
}

export function LevelMap({ player, onPlay }: Props) {
  const [levels, setLevels] = useState<LevelSummary[]>([])
  const [avance, setAvance] = useState<Record<string, LevelProgress>>({})
  const [error, setError] = useState(false)
  const [seleccionado, setSeleccionado] = useState<LevelSummary | null>(null)

  useEffect(() => {
    Promise.all([
      api.levels({ player_id: player.player_id }),
      api.profile(player.player_id),
    ]).then(([catalogo, perfil]) => {
      setLevels(catalogo.levels)
      setAvance(Object.fromEntries(perfil.niveles.map((n) => [n.level_code, n])))
    }).catch(() => setError(true))
  }, [player.player_id])

  const completados = levels.filter((l) => avance[l.code]?.completado).length
  const progresoCampus = levels.length ? Math.round((completados / levels.length) * 100) : 0

  return (
    <section className="mx-auto max-w-5xl space-y-4">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold">Mapa del Campus</h2>
          <p className="font-mono text-xs uppercase tracking-widest text-espol-azul">
            Selecciona una facultad para jugar
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-widest text-espol-azul">
            Progreso del campus
          </p>
          <p className="text-xl font-bold">{progresoCampus}%</p>
          <p className="text-xs text-gray-600">
            ✓ {completados}/{levels.length} facultades · ◆ {player.insignias} insignias
          </p>
        </div>
      </header>

      {error && <p className="text-sm text-red-700">No se pudieron cargar los niveles.</p>}

      <div className="overflow-x-auto pb-4">
        <ol className="flex min-w-max items-end gap-0">
          {levels.map((level, i) => (
            <li key={level.code} className="flex items-end">
              {i > 0 && (
                <span
                  aria-hidden
                  className={`mb-14 h-1 w-16 ${
                    level.desbloqueado ? "bg-espol-azul" : "bg-gray-300"
                  }`}
                />
              )}
              <NodoNivel
                level={level}
                numero={i + 1}
                progreso={avance[level.code]}
                activo={seleccionado?.code === level.code}
                onSeleccionar={() => setSeleccionado(level)}
              />
            </li>
          ))}
        </ol>
      </div>

      {seleccionado && (
        <article className="rounded-xl bg-white p-4 shadow">
          <header className="mb-3 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold">{seleccionado.name}</h3>
              <p className="text-sm text-gray-600">{seleccionado.description}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-gray-500">
                {seleccionado.zone} · {seleccionado.difficulty} ·
                {` ${seleccionado.checkpoints_count} puntos de interes`}
                {seleccionado.insignia && ` · otorga ${seleccionado.insignia}`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onPlay(seleccionado.code)}
              disabled={!seleccionado.desbloqueado}
              className="rounded-lg bg-espol-azul px-4 py-2 font-semibold uppercase tracking-wide text-white hover:brightness-110 disabled:bg-gray-400"
            >
              {seleccionado.desbloqueado
                ? "Jugar"
                : `Requiere ${seleccionado.required_score} pts`}
            </button>
          </header>

          <MissionList levelCode={seleccionado.code} playerId={player.player_id} />
        </article>
      )}
    </section>
  )
}

function NodoNivel({
  level, numero, progreso, activo, onSeleccionar,
}: {
  level: LevelSummary
  numero: number
  progreso?: LevelProgress
  activo: boolean
  onSeleccionar: () => void
}) {
  const completado = progreso?.completado ?? false
  const enCurso = !!progreso && !completado
  const estrellas = Math.round(((progreso?.exploracion_pct ?? 0) / 100) * 3)

  return (
    <div className="w-40 text-center">
      <button
        type="button"
        onClick={onSeleccionar}
        disabled={!level.desbloqueado}
        aria-label={`${level.name}${level.desbloqueado ? "" : " (bloqueado)"}`}
        className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 text-2xl font-bold transition ${
          activo ? "ring-4 ring-espol-celeste " : ""
        }${
          !level.desbloqueado
            ? "cursor-not-allowed border-gray-300 bg-gray-200 text-gray-400"
            : completado
              ? "border-espol-azulOscuro bg-espol-azul text-white hover:brightness-110"
              : enCurso
                ? "animate-pulse border-dashed border-espol-azul bg-white text-espol-azul"
                : "border-espol-azul bg-white text-espol-azul hover:bg-espol-celeste/20"
        }`}
      >
        {level.desbloqueado ? numero : "🔒"}
      </button>

      <p className="mt-2 font-semibold leading-tight">{level.zone}</p>
      <p className="text-xs text-gray-600">{level.name}</p>

      {level.desbloqueado ? (
        <p className="mt-1 text-sm text-espol-azul" aria-label={`${estrellas} de 3 estrellas`}>
          {"★".repeat(estrellas)}{"☆".repeat(3 - estrellas)}
        </p>
      ) : (
        <p className="mt-1 font-mono text-[10px] uppercase text-gray-500">
          Requiere {level.required_score} pts
        </p>
      )}

      {enCurso && (
        <p className="font-mono text-[10px] uppercase tracking-widest text-espol-azul">▶ En curso</p>
      )}
    </div>
  )
}
