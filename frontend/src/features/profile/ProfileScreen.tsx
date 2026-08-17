// Perfil de progreso del jugador.
// Responsable: Jorge del Campo - RF-05
// Exploracion del campus, insignias, nivel actual e historial de trivias.
import { useEffect, useState } from "react"
import { api } from "../../api/client"
import type { MissionAnswerRow, Player, PlayerProfile } from "../../api/types"

interface Props {
  player: Player
}

export function ProfileScreen({ player }: Props) {
  const [perfil, setPerfil] = useState<PlayerProfile | null>(null)
  const [respuestas, setRespuestas] = useState<MissionAnswerRow[]>([])
  const [error, setError] = useState(false)

  useEffect(() => {
    Promise.all([
      api.profile(player.player_id),
      api.answers(player.player_id).catch(() => ({ answers: [] as MissionAnswerRow[] })),
    ]).then(([datosPerfil, historial]) => {
      setPerfil(datosPerfil)
      setRespuestas(historial.answers)
    }).catch(() => setError(true))
  }, [player.player_id])

  if (error) return <Aviso texto="No se pudo cargar el perfil." />
  if (!perfil) return <Aviso texto="Cargando perfil..." />

  // "Nivel actual" es el ultimo nivel en el que el jugador estuvo jugando.
  const nivelActual = perfil.niveles.find((n) => !n.completado) ?? perfil.niveles.at(-1)

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <header className="rounded-xl bg-espol-azulOscuro p-5 text-white">
        <h2 className="text-2xl font-bold">{perfil.nickname}</h2>
        <p className="font-mono text-xs uppercase tracking-widest text-espol-celeste">
          {perfil.facultad}{perfil.email && ` · ${perfil.email}`}
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Dato titulo="Puntaje" valor={`${perfil.puntaje_total}`} />
          <Dato titulo="Niveles superados" valor={`${perfil.niveles_superados}`} />
          <Dato titulo="Exploracion" valor={`${perfil.exploracion_promedio_pct}%`} />
          <Dato titulo="Nivel actual" valor={nivelActual?.level_code ?? "—"} />
        </dl>
      </header>

      <section className="rounded-xl bg-white p-5 shadow">
        <h3 className="font-semibold">Insignias obtenidas</h3>
        {perfil.insignias.length === 0 ? (
          <p className="mt-2 text-sm text-gray-600">Todavia no has desbloqueado ninguna.</p>
        ) : (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {perfil.insignias.map((insignia) => (
              <li key={insignia.key} className="rounded-lg border border-black/10 p-3">
                <p className="font-medium">{insignia.nombre}</p>
                <p className="text-sm text-gray-600">{insignia.descripcion}</p>
                {insignia.obtenida_el && (
                  <p className="mt-1 font-mono text-[10px] uppercase text-gray-500">
                    {new Date(insignia.obtenida_el).toLocaleDateString("es-EC")}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl bg-white p-5 shadow">
        <h3 className="font-semibold">Progreso por nivel</h3>
        <ul className="mt-3 space-y-2">
          {perfil.niveles.map((nivel) => (
            <li key={nivel.level_code} className="rounded-lg border border-black/10 p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{nivel.level_code}</span>
                <span className="font-mono text-xs uppercase text-gray-600">
                  {nivel.completado ? "superado" : "en curso"}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded bg-black/10">
                <div className="h-full bg-espol-azul" style={{ width: `${nivel.exploracion_pct}%` }} />
              </div>
              <p className="mt-1 text-xs text-gray-600">
                {nivel.exploracion_pct}% explorado · {nivel.puntaje} pts
                ({nivel.puntaje_misiones} de trivias) · {nivel.misiones_completadas} misiones
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl bg-white p-5 shadow">
        <h3 className="font-semibold">Historial de trivias</h3>
        {respuestas.length === 0 ? (
          <p className="mt-2 text-sm text-gray-600">Todavia no has respondido ninguna trivia.</p>
        ) : (
          <ul className="mt-3 divide-y divide-black/10">
            {respuestas.map((respuesta) => (
              <li key={respuesta.id} className="flex items-center justify-between py-2 text-sm">
                <span>
                  <span className="font-mono text-xs text-gray-500">{respuesta.mission_code}</span>
                  <span className="ml-2">
                    {respuesta.correcta ? "Correcta" : "Incorrecta"}
                    {respuesta.intento > 1 && ` · intento ${respuesta.intento}`}
                  </span>
                </span>
                <span className={respuesta.correcta ? "text-green-700" : "text-gray-500"}>
                  +{respuesta.puntaje_otorgado} pts
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function Dato({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-widest text-espol-celeste">{titulo}</dt>
      <dd className="text-xl font-bold">{valor}</dd>
    </div>
  )
}

function Aviso({ texto }: { texto: string }) {
  return <p className="mt-8 text-center text-gray-600">{texto}</p>
}
