// Menu principal: entrada al mapa del campus y a las pantallas de progreso.
import type { Player } from "../../api/types"
import type { Screen } from "../../navigation"

interface Props {
  player: Player
  onNavigate: (pantalla: Screen) => void
  onLogout: () => void
}

const OPCIONES: { pantalla: Screen; etiqueta: string; detalle: string }[] = [
  { pantalla: "mapa",    etiqueta: "Jugar",   detalle: "Mapa del campus y seleccion de facultad" },
  { pantalla: "perfil",  etiqueta: "Perfil",  detalle: "Progreso, insignias y trivias resueltas" },
  { pantalla: "ranking", etiqueta: "Ranking", detalle: "Tabla de lideres global y por facultad" },
  { pantalla: "admin",   etiqueta: "Admin",   detalle: "Administracion de misiones y puntos de interes" },
]

export function MainMenu({ player, onNavigate, onLogout }: Props) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-espol-azulOscuro p-6 text-white">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">ESPOL Quest</h1>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-espol-celeste">
          Campus Gustavo Galindo
        </p>
      </header>

      <p className="mb-6 text-center">
        <span className="font-semibold">{player.nickname}</span>
        <span className="ml-2 text-espol-celeste">
          {player.facultad} · {player.puntaje_total} pts · {player.insignias} insignias
        </span>
      </p>

      <nav className="w-full max-w-sm space-y-3">
        {OPCIONES.map((opcion) => (
          <button
            type="button"
            key={opcion.pantalla}
            onClick={() => onNavigate(opcion.pantalla)}
            className="w-full rounded-xl bg-white/10 px-4 py-3 text-left transition hover:bg-white/20"
          >
            <span className="block font-semibold">{opcion.etiqueta}</span>
            <span className="block text-sm text-espol-celeste">{opcion.detalle}</span>
          </button>
        ))}

        <button
          type="button"
          onClick={onLogout}
          className="w-full rounded-xl px-4 py-2 text-sm text-white/60 underline hover:text-white"
        >
          Cambiar de jugador
        </button>
      </nav>
    </main>
  )
}
