// Pantalla de inicio y registro del jugador.
// Un jugador existente entra con su nickname; uno nuevo se registra.
import { useEffect, useState } from "react"
import { api, ApiError } from "../../api/client"
import { FACULTADES, type Player } from "../../api/types"

interface Props {
  onLogin: (player: Player) => void
}

export function LoginScreen({ onLogin }: Props) {
  const [players, setPlayers] = useState<Player[]>([])
  const [nickname, setNickname] = useState("")
  const [email, setEmail] = useState("")
  const [facultad, setFacultad] = useState<string>(FACULTADES[0])
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    api.players()
      .then((r) => setPlayers(r.players))
      .catch(() => setError("No se pudo conectar con el servidor. Esta levantado en el puerto 3000?"))
  }, [])

  async function registrar(evento: React.FormEvent) {
    evento.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      const { player } = await api.registerPlayer({ nickname, email: email || undefined, facultad })
      onLogin(player)
    } catch (e) {
      setError(mensajeDeError(e))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="min-h-screen bg-espol-azulOscuro text-white flex flex-col items-center justify-center p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">ESPOL Quest</h1>
        <p className="text-espol-celeste mt-2">
          Explora el campus Gustavo Galindo, resuelve trivias y sube en la tabla.
        </p>
      </header>

      <div className="w-full max-w-sm space-y-6">
        {players.length > 0 && (
          <section className="bg-white/10 rounded-xl p-4">
            <h2 className="font-semibold mb-3">Ya juegas aqui</h2>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {players.map((p) => (
                <li key={p.player_id}>
                  <button
                    type="button"
                    onClick={() => onLogin(p)}
                    className="w-full text-left px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <span className="font-medium">{p.nickname}</span>
                    <span className="text-espol-celeste text-sm ml-2">
                      {p.facultad} · {p.puntaje_total} pts
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <form onSubmit={registrar} className="bg-white/10 rounded-xl p-4 space-y-3">
          <h2 className="font-semibold">Soy nuevo</h2>

          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Nickname"
            required
            className="w-full px-3 py-2 rounded-lg bg-white text-espol-azulOscuro placeholder:text-gray-500"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Correo (opcional)"
            className="w-full px-3 py-2 rounded-lg bg-white text-espol-azulOscuro placeholder:text-gray-500"
          />
          <select
            value={facultad}
            onChange={(e) => setFacultad(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white text-espol-azulOscuro"
          >
            {FACULTADES.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>

          <button
            type="submit"
            disabled={enviando}
            className="w-full py-2 rounded-lg bg-espol-celeste text-espol-azulOscuro font-semibold hover:brightness-110 disabled:opacity-50"
          >
            {enviando ? "Registrando..." : "Empezar a jugar"}
          </button>
        </form>

        {error && (
          <p role="alert" className="text-center text-red-200 bg-red-900/40 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
      </div>
    </main>
  )
}

function mensajeDeError(e: unknown): string {
  if (!(e instanceof ApiError)) return "Ocurrio un error inesperado."

  switch (e.code) {
    case "sin_conexion":    return "No se pudo conectar con el servidor."
    case "campos_requeridos": return "Falta completar el nickname o la facultad."
    case "datos_invalidos": return Array.isArray(e.detail) ? e.detail.join(". ") : "Datos invalidos."
    default:                return "No se pudo registrar el jugador."
  }
}
