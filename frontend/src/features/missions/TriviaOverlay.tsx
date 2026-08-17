// Trivia de una mision, abierta encima de la partida.
// Responsable: Jose Gavino - RF-03
// El boton de confirmar solo se habilita con una opcion elegida.
import { useEffect, useState } from "react"
import { api } from "../../api/client"
import type { AnswerResponse, MissionDetail } from "../../api/types"
import { Overlay } from "../../ui/Overlay"

const LETRAS = ["A", "B", "C", "D", "E", "F"]

interface Props {
  missionCode: string
  playerId: number
  onClose: (resultado: AnswerResponse["resumen_mision"] | null) => void
}

export function TriviaOverlay({ missionCode, playerId, onClose }: Props) {
  const [mission, setMission] = useState<MissionDetail | null>(null)
  const [indice, setIndice] = useState(0)
  const [elegida, setElegida] = useState<number | null>(null)
  const [respuesta, setRespuesta] = useState<AnswerResponse | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.mission(missionCode)
      .then(setMission)
      .catch(() => setError("No se pudo cargar la mision."))
  }, [missionCode])

  if (error) {
    return (
      <Overlay title="Mision" onClose={() => onClose(null)}>
        <p className="text-red-700">{error}</p>
      </Overlay>
    )
  }

  if (!mission) {
    return (
      <Overlay title="Cargando mision...">
        <p className="text-gray-600">Un momento.</p>
      </Overlay>
    )
  }

  const pregunta = mission.questions[indice]
  const total = mission.questions.length
  const completada = respuesta?.resumen_mision.completada ?? false
  const ultima = indice === total - 1

  async function confirmar() {
    if (elegida === null || !mission) return

    setEnviando(true)
    setError(null)
    try {
      const resultado = await api.answer(mission.code, {
        player_id: playerId,
        question_id: pregunta.id,
        selected_option: elegida,
      })
      setRespuesta(resultado)
    } catch {
      setError("No se pudo registrar la respuesta.")
    } finally {
      setEnviando(false)
    }
  }

  function siguiente() {
    if (ultima) return onClose(respuesta?.resumen_mision ?? null)

    setIndice(indice + 1)
    setElegida(null)
    setRespuesta(null)
  }

  return (
    <Overlay
      title={mission.title}
      subtitle={mission.description}
      onClose={() => onClose(respuesta?.resumen_mision ?? null)}
      footer={
        respuesta ? (
          <button
            type="button"
            onClick={siguiente}
            className="w-full rounded bg-espol-azul py-2 font-semibold uppercase tracking-wide text-white hover:brightness-110"
          >
            {ultima ? "Terminar mision" : "Siguiente pregunta"}
          </button>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-gray-600">Selecciona una opcion para continuar</p>
            <button
              type="button"
              onClick={confirmar}
              disabled={elegida === null || enviando}
              className="rounded bg-espol-azul px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white hover:brightness-110 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {enviando ? "Enviando..." : "Confirmar respuesta"}
            </button>
          </div>
        )
      }
    >
      <header className="mb-3 flex items-center justify-between font-mono text-xs uppercase tracking-widest text-espol-azul">
        <span>Pregunta {indice + 1} de {total}</span>
        <span>{Math.round(((indice + (respuesta ? 1 : 0)) / total) * 100)}% completado</span>
      </header>

      <div className="mb-4 flex gap-1">
        {mission.questions.map((q, i) => (
          <span
            key={q.id}
            className={`h-1.5 flex-1 rounded ${
              i < indice || (i === indice && respuesta) ? "bg-espol-azul" : "bg-black/15"
            }`}
          />
        ))}
      </div>

      <p className="mb-4 border-l-4 border-espol-celeste pl-3 text-sm leading-relaxed">
        {pregunta.statement}
      </p>

      <div className="grid gap-2 sm:grid-cols-2">
        {pregunta.options.map((opcion, i) => (
          <button
            type="button"
            key={opcion}
            onClick={() => !respuesta && setElegida(i)}
            disabled={!!respuesta}
            className={`flex items-start gap-2 rounded border px-3 py-2 text-left text-sm transition ${
              estiloOpcion(i, elegida, respuesta)
            }`}
          >
            <span className="mt-0.5 rounded border border-current px-1.5 font-mono text-[10px]">
              {LETRAS[i]}
            </span>
            <span>{opcion}</span>
          </button>
        ))}
      </div>

      {respuesta && (
        <div
          className={`mt-4 rounded p-3 text-sm ${
            respuesta.answer.correcta ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"
          }`}
        >
          <p className="font-semibold">
            {respuesta.answer.correcta ? "Correcto" : "Incorrecto"}
            {respuesta.answer.puntaje_otorgado > 0 && ` · +${respuesta.answer.puntaje_otorgado} pts`}
          </p>
          <p className="mt-1">{respuesta.feedback}</p>

          {respuesta.insignias_otorgadas.length > 0 && (
            <p className="mt-2 rounded bg-yellow-100 p-2 text-yellow-900">
              Insignia desbloqueada: {respuesta.insignias_otorgadas.join(", ")}
            </p>
          )}

          {completada && (
            <p className="mt-2">
              Mision completada · {respuesta.resumen_mision.puntaje_obtenido} de{" "}
              {respuesta.resumen_mision.puntaje_maximo} puntos
            </p>
          )}
        </div>
      )}
    </Overlay>
  )
}

function estiloOpcion(
  i: number,
  elegida: number | null,
  respuesta: AnswerResponse | null,
): string {
  if (!respuesta) {
    return i === elegida
      ? "border-espol-azul bg-espol-azul/10 font-medium"
      : "border-black/20 hover:bg-black/5"
  }
  // Ya respondida: solo se resalta la que eligio el jugador.
  if (i === respuesta.answer.selected_option) {
    return respuesta.answer.correcta
      ? "border-green-600 bg-green-50"
      : "border-red-600 bg-red-50"
  }
  return "border-black/10 opacity-60"
}
