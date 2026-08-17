// Catalogo de misiones de un nivel con su estado por jugador.
// Responsable: Jose Gavino - RF-04
import { useEffect, useState } from "react"
import { api } from "../../api/client"
import type { MissionSummary } from "../../api/types"

interface Props {
  levelCode: string
  playerId: number
}

export function MissionList({ levelCode, playerId }: Props) {
  const [missions, setMissions] = useState<MissionSummary[]>([])
  const [levelName, setLevelName] = useState("")
  const [error, setError] = useState(false)

  useEffect(() => {
    api.missions(levelCode, playerId)
      .then((r) => {
        setMissions(r.missions)
        setLevelName(r.level_name)
      })
      .catch(() => setError(true))
  }, [levelCode, playerId])

  if (error) return <p className="text-sm text-red-700">No se pudieron cargar las misiones.</p>

  return (
    <section>
      <h3 className="font-semibold">Misiones de {levelName || levelCode}</h3>

      {missions.length === 0 && (
        <p className="mt-2 text-sm text-gray-600">Este nivel todavia no tiene misiones.</p>
      )}

      <ul className="mt-3 space-y-2">
        {missions.map((mission) => (
          <li key={mission.code}>
            <article className="rounded-lg border border-black/10 bg-white px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{mission.title}</span>
                <span
                  className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase ${
                    mission.estado === "resuelta"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {mission.estado}
                </span>
              </div>
              <p className="text-sm text-gray-600">{mission.description}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-gray-500">
                {mission.questions_count} preguntas · {mission.max_points} pts
                {mission.insignia && ` · ${mission.insignia}`}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
