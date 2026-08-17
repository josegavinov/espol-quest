// CMS: administracion de misiones, preguntas y opciones de respuesta.
// Responsable: Jose Gavino
import { useEffect, useState } from "react"
import { api } from "../../api/client"
import type { AdminMission, AdminQuestion } from "../../api/types"

export function MissionsAdmin() {
  const [missions, setMissions] = useState<AdminMission[]>([])
  const [seleccionada, setSeleccionada] = useState<string | null>(null)
  const [questions, setQuestions] = useState<AdminQuestion[]>([])
  const [aviso, setAviso] = useState<string | null>(null)

  const recargar = () => api.admin.missions().then((r) => setMissions(r.missions))

  useEffect(() => { recargar().catch(() => setAviso("No se pudieron cargar las misiones.")) }, [])

  useEffect(() => {
    if (!seleccionada) return setQuestions([])
    api.admin.questions(seleccionada).then((r) => setQuestions(r.questions))
  }, [seleccionada])

  async function eliminar(code: string) {
    if (!confirm(`Eliminar la mision ${code} y sus preguntas?`)) return
    await api.admin.deleteMission(code)
    setSeleccionada(null)
    await recargar()
    setAviso(`Mision ${code} eliminada.`)
  }

  return (
    <div className="space-y-4">
      <NuevaMision onCreada={async () => { await recargar(); setAviso("Mision creada.") }} />

      {aviso && <p className="rounded bg-espol-celeste/30 px-3 py-2 text-sm">{aviso}</p>}

      <ul className="space-y-2">
        {missions.map((mission) => (
          <li key={mission.code} className="rounded-lg border border-black/10 bg-white p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium">{mission.title}</p>
                <p className="font-mono text-[10px] uppercase tracking-wide text-gray-500">
                  {mission.code} · {mission.level_code}
                  {mission.checkpoint_code && ` · ${mission.checkpoint_code}`}
                  {mission.badge_key && ` · ${mission.badge_key}`}
                  {` · ${mission.questions_count} preguntas`}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSeleccionada(seleccionada === mission.code ? null : mission.code)}
                  className="rounded border border-espol-azul px-2 py-1 text-xs text-espol-azul hover:bg-espol-azul/10"
                >
                  {seleccionada === mission.code ? "Ocultar" : "Preguntas"}
                </button>
                <button
                  type="button"
                  onClick={() => eliminar(mission.code)}
                  className="rounded border border-red-600 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                >
                  Eliminar
                </button>
              </div>
            </div>

            {seleccionada === mission.code && (
              <Preguntas
                missionCode={mission.code}
                questions={questions}
                onCambio={async () => {
                  setQuestions((await api.admin.questions(mission.code)).questions)
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

function NuevaMision({ onCreada }: { onCreada: () => void }) {
  const [code, setCode] = useState("")
  const [levelCode, setLevelCode] = useState("")
  const [title, setTitle] = useState("")
  const [error, setError] = useState<string | null>(null)

  async function crear(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await api.admin.createMission({ code, level_code: levelCode, title })
      setCode(""); setLevelCode(""); setTitle("")
      onCreada()
    } catch {
      setError("No se pudo crear. Revisa que el codigo sea unico y el nivel exista.")
    }
  }

  return (
    <form onSubmit={crear} className="rounded-lg border border-black/10 bg-white p-3">
      <h4 className="mb-2 font-semibold">Nueva mision</h4>
      <div className="grid gap-2 sm:grid-cols-3">
        <input value={code} onChange={(e) => setCode(e.target.value)} required
               placeholder="Codigo (M-FIEC-02)" className="rounded border border-black/20 px-2 py-1 text-sm" />
        <input value={levelCode} onChange={(e) => setLevelCode(e.target.value)} required
               placeholder="Nivel (FIEC-01)" className="rounded border border-black/20 px-2 py-1 text-sm" />
        <input value={title} onChange={(e) => setTitle(e.target.value)} required
               placeholder="Titulo" className="rounded border border-black/20 px-2 py-1 text-sm" />
      </div>
      <button type="submit" className="mt-2 rounded bg-espol-azul px-3 py-1 text-sm font-semibold text-white">
        Crear
      </button>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </form>
  )
}

function Preguntas({
  missionCode, questions, onCambio,
}: {
  missionCode: string
  questions: AdminQuestion[]
  onCambio: () => void
}) {
  const [statement, setStatement] = useState("")
  const [opciones, setOpciones] = useState("")
  const [correcta, setCorrecta] = useState(0)
  const [puntos, setPuntos] = useState(10)
  const [error, setError] = useState<string | null>(null)

  async function crear(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const options = opciones.split("|").map((o) => o.trim()).filter(Boolean)
    try {
      await api.admin.createQuestion(missionCode, {
        statement, options, correct_option: correcta, points: puntos,
      })
      setStatement(""); setOpciones(""); setCorrecta(0)
      onCambio()
    } catch {
      setError("Revisa que la opcion correcta exista entre las opciones.")
    }
  }

  return (
    <div className="mt-3 border-t border-black/10 pt-3">
      <ol className="mb-3 space-y-2">
        {questions.map((q, i) => (
          <li key={q.id} className="rounded bg-espol-arena p-2 text-sm">
            <div className="flex items-start justify-between gap-2">
              <p><span className="font-mono text-xs">{i + 1}.</span> {q.statement}</p>
              <button
                type="button"
                onClick={async () => { await api.admin.deleteQuestion(q.id); onCambio() }}
                className="shrink-0 text-xs text-red-700 underline"
              >
                borrar
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-600">
              {q.options.map((o, j) => (
                <span key={o} className={j === q.correct_option ? "font-semibold text-green-800" : ""}>
                  {j > 0 && " · "}{o}
                </span>
              ))}
              {` · ${q.points} pts`}
            </p>
          </li>
        ))}
      </ol>

      <form onSubmit={crear} className="space-y-2">
        <input value={statement} onChange={(e) => setStatement(e.target.value)} required
               placeholder="Enunciado de la pregunta"
               className="w-full rounded border border-black/20 px-2 py-1 text-sm" />
        <input value={opciones} onChange={(e) => setOpciones(e.target.value)} required
               placeholder="Opciones separadas por |"
               className="w-full rounded border border-black/20 px-2 py-1 text-sm" />
        <div className="flex gap-2">
          <label className="text-xs">
            Correcta (indice)
            <input type="number" min={0} value={correcta}
                   onChange={(e) => setCorrecta(Number(e.target.value))}
                   className="ml-1 w-16 rounded border border-black/20 px-2 py-1 text-sm" />
          </label>
          <label className="text-xs">
            Puntos
            <input type="number" min={0} value={puntos}
                   onChange={(e) => setPuntos(Number(e.target.value))}
                   className="ml-1 w-20 rounded border border-black/20 px-2 py-1 text-sm" />
          </label>
          <button type="submit" className="rounded bg-espol-azul px-3 py-1 text-sm font-semibold text-white">
            Agregar pregunta
          </button>
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
      </form>
    </div>
  )
}
