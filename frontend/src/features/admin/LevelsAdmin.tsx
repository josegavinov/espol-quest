// CMS: administracion de niveles y puntos de interes del campus.
// Responsable: Kevin Galvez
import { useEffect, useState } from "react"
import { api } from "../../api/client"
import type { AdminCheckpoint, AdminLevel, CheckpointKind } from "../../api/types"

const TIPOS: CheckpointKind[] = ["info", "mission", "goal"]

export function LevelsAdmin() {
  const [levels, setLevels] = useState<AdminLevel[]>([])
  const [seleccionado, setSeleccionado] = useState<string | null>(null)
  const [checkpoints, setCheckpoints] = useState<AdminCheckpoint[]>([])
  const [aviso, setAviso] = useState<string | null>(null)

  const recargar = () => api.admin.levels().then((r) => setLevels(r.levels))

  useEffect(() => { recargar().catch(() => setAviso("No se pudieron cargar los niveles.")) }, [])

  useEffect(() => {
    if (!seleccionado) return setCheckpoints([])
    api.admin.checkpoints(seleccionado).then((r) => setCheckpoints(r.checkpoints))
  }, [seleccionado])

  return (
    <div className="space-y-4">
      <NuevoNivel onCreado={async () => { await recargar(); setAviso("Nivel creado.") }} />

      {aviso && <p className="rounded bg-espol-celeste/30 px-3 py-2 text-sm">{aviso}</p>}

      <ul className="space-y-2">
        {levels.map((level) => (
          <li key={level.code} className="rounded-lg border border-black/10 bg-white p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium">{level.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-wide text-gray-500">
                  {level.code} · {level.zone} · requiere {level.required_score} pts ·
                  {` ${level.checkpoints_count} puntos de interes`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs">
                  Requiere
                  <input
                    type="number"
                    defaultValue={level.required_score}
                    onBlur={async (e) => {
                      const valor = Number(e.target.value)
                      if (valor === level.required_score) return
                      await api.admin.updateLevel(level.code, { required_score: valor })
                      await recargar()
                      setAviso(`${level.code} actualizado.`)
                    }}
                    className="ml-1 w-20 rounded border border-black/20 px-2 py-1"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setSeleccionado(seleccionado === level.code ? null : level.code)}
                  className="rounded border border-espol-azul px-2 py-1 text-xs text-espol-azul hover:bg-espol-azul/10"
                >
                  {seleccionado === level.code ? "Ocultar" : "Puntos de interes"}
                </button>
              </div>
            </div>

            {seleccionado === level.code && (
              <PuntosDeInteres
                levelCode={level.code}
                checkpoints={checkpoints}
                onCambio={async () => {
                  setCheckpoints((await api.admin.checkpoints(level.code)).checkpoints)
                  await recargar()
                }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function NuevoNivel({ onCreado }: { onCreado: () => void }) {
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [zone, setZone] = useState("")
  const [world, setWorld] = useState("Zona Central")
  const [error, setError] = useState<string | null>(null)

  async function crear(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await api.admin.createLevel({ code, name, zone, world })
      setCode(""); setName(""); setZone("")
      onCreado()
    } catch {
      setError("No se pudo crear. El codigo debe ser unico.")
    }
  }

  return (
    <form onSubmit={crear} className="rounded-lg border border-black/10 bg-white p-3">
      <h4 className="mb-2 font-semibold">Nuevo nivel</h4>
      <div className="grid gap-2 sm:grid-cols-4">
        <input value={code} onChange={(e) => setCode(e.target.value)} required
               placeholder="Codigo (FCNM-01)" className="rounded border border-black/20 px-2 py-1 text-sm" />
        <input value={name} onChange={(e) => setName(e.target.value)} required
               placeholder="Nombre" className="rounded border border-black/20 px-2 py-1 text-sm" />
        <input value={zone} onChange={(e) => setZone(e.target.value)} required
               placeholder="Zona (FCNM)" className="rounded border border-black/20 px-2 py-1 text-sm" />
        <input value={world} onChange={(e) => setWorld(e.target.value)} required
               placeholder="Mundo" className="rounded border border-black/20 px-2 py-1 text-sm" />
      </div>
      <button type="submit" className="mt-2 rounded bg-espol-azul px-3 py-1 text-sm font-semibold text-white">
        Crear
      </button>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </form>
  )
}

function PuntosDeInteres({
  levelCode, checkpoints, onCambio,
}: {
  levelCode: string
  checkpoints: AdminCheckpoint[]
  onCambio: () => void
}) {
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [x, setX] = useState(300)
  const [y, setY] = useState(600)
  const [kind, setKind] = useState<CheckpointKind>("info")
  const [infoText, setInfoText] = useState("")
  const [error, setError] = useState<string | null>(null)

  async function crear(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await api.admin.createCheckpoint(levelCode, {
        code, name, x, y, kind, info_text: infoText,
        order_index: checkpoints.length + 1,
      })
      setCode(""); setName(""); setInfoText("")
      onCambio()
    } catch {
      setError("No se pudo crear. El codigo del punto debe ser unico.")
    }
  }

  return (
    <div className="mt-3 border-t border-black/10 pt-3">
      <ul className="mb-3 space-y-1">
        {checkpoints.map((checkpoint) => (
          <li key={checkpoint.code} className="flex items-start justify-between gap-2 rounded bg-espol-arena p-2 text-sm">
            <div>
              <p className="font-medium">
                {checkpoint.name}
                <span className="ml-2 font-mono text-[10px] uppercase text-gray-500">
                  {checkpoint.kind} · ({checkpoint.x}, {checkpoint.y})
                </span>
              </p>
              {checkpoint.info_text && <p className="text-xs text-gray-600">{checkpoint.info_text}</p>}
            </div>
            <button
              type="button"
              onClick={async () => { await api.admin.deleteCheckpoint(checkpoint.code); onCambio() }}
              className="shrink-0 text-xs text-red-700 underline"
            >
              borrar
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={crear} className="space-y-2">
        <div className="grid gap-2 sm:grid-cols-2">
          <input value={code} onChange={(e) => setCode(e.target.value)} required
                 placeholder="Codigo (FIEC-01-CP4)" className="rounded border border-black/20 px-2 py-1 text-sm" />
          <input value={name} onChange={(e) => setName(e.target.value)} required
                 placeholder="Nombre del edificio o servicio" className="rounded border border-black/20 px-2 py-1 text-sm" />
        </div>
        <input value={infoText} onChange={(e) => setInfoText(e.target.value)}
               placeholder="Ficha informativa" className="w-full rounded border border-black/20 px-2 py-1 text-sm" />
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <label>X <input type="number" value={x} onChange={(e) => setX(Number(e.target.value))}
                          className="ml-1 w-20 rounded border border-black/20 px-2 py-1" /></label>
          <label>Y <input type="number" value={y} onChange={(e) => setY(Number(e.target.value))}
                          className="ml-1 w-20 rounded border border-black/20 px-2 py-1" /></label>
          <label>
            Tipo
            <select value={kind} onChange={(e) => setKind(e.target.value as CheckpointKind)}
                    className="ml-1 rounded border border-black/20 px-2 py-1">
              {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <button type="submit" className="rounded bg-espol-azul px-3 py-1 font-semibold text-white">
            Agregar punto
          </button>
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
      </form>
    </div>
  )
}
