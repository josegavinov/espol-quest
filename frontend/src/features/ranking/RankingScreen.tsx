// Tabla de clasificacion global y por facultad.
// Responsable: Jorge del Campo - RF-06
import { useEffect, useState } from "react"
import { api } from "../../api/client"
import { FACULTADES, type Player, type Ranking } from "../../api/types"

interface Props {
  player: Player
}

export function RankingScreen({ player }: Props) {
  const [ranking, setRanking] = useState<Ranking | null>(null)
  const [facultad, setFacultad] = useState("")
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(false)
    api.ranking({ facultad: facultad || undefined, limit: 20 })
      .then(setRanking)
      .catch(() => setError(true))
  }, [facultad])

  return (
    <section className="mx-auto max-w-3xl">
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Tabla de clasificacion</h2>
          <p className="font-mono text-xs uppercase tracking-widest text-espol-azul">
            {ranking ? `${ranking.alcance} · ${ranking.total_jugadores} jugadores` : "Cargando..."}
          </p>
        </div>

        <label className="text-sm">
          <span className="mr-2">Facultad</span>
          <select
            value={facultad}
            onChange={(e) => setFacultad(e.target.value)}
            className="rounded border border-black/20 bg-white px-2 py-1"
          >
            <option value="">Global</option>
            {FACULTADES.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </label>
      </header>

      {error && <p className="text-sm text-red-700">No se pudo cargar el ranking.</p>}

      {ranking && ranking.tabla.length === 0 && (
        <p className="text-sm text-gray-600">Todavia no hay jugadores en esta facultad.</p>
      )}

      {ranking && ranking.tabla.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-white shadow">
          <table className="w-full text-left text-sm">
            <thead className="bg-espol-azulOscuro font-mono text-[10px] uppercase tracking-widest text-white">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Jugador</th>
                <th className="px-3 py-2">Facultad</th>
                <th className="px-3 py-2 text-right">Puntaje</th>
                <th className="px-3 py-2 text-right">Niveles</th>
                <th className="px-3 py-2 text-right">Insignias</th>
              </tr>
            </thead>
            <tbody>
              {ranking.tabla.map((fila) => {
                const esYo = fila.player_id === player.player_id
                return (
                  <tr
                    key={fila.player_id}
                    className={`border-t border-black/5 ${
                      esYo ? "bg-espol-celeste/30 font-semibold" : ""
                    }`}
                  >
                    <td className="px-3 py-2 font-mono">{fila.posicion}</td>
                    <td className="px-3 py-2">
                      {fila.nickname}
                      {esYo && (
                        <span className="ml-2 rounded bg-espol-azul px-1.5 py-0.5 font-mono text-[9px] uppercase text-white">
                          tu
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2">{fila.facultad}</td>
                    <td className="px-3 py-2 text-right">{fila.puntaje_total}</td>
                    <td className="px-3 py-2 text-right">{fila.niveles_superados}</td>
                    <td className="px-3 py-2 text-right">{fila.insignias}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
