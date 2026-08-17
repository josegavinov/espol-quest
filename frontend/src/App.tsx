// Recorrido de la aplicacion:
// login -> menu -> mapa del campus -> partida
//               -> perfil | ranking | admin
import { useState } from "react"
import { AdminScreen } from "./features/admin/AdminScreen"
import { GameScreen } from "./features/game/GameScreen"
import { LevelMap } from "./features/levels/LevelMap"
import { LoginScreen } from "./features/login/LoginScreen"
import { MainMenu } from "./features/menu/MainMenu"
import { ProfileScreen } from "./features/profile/ProfileScreen"
import { RankingScreen } from "./features/ranking/RankingScreen"
import type { Screen } from "./navigation"
import { usePlayer } from "./session"
import { RotateNotice } from "./ui/RotateNotice"

export default function App() {
  const { player, setPlayer, logout } = usePlayer()
  const [pantalla, setScreen] = useState<Screen>("menu")
  const [levelCode, setLevelCode] = useState<string | null>(null)

  if (!player) {
    return (
      <>
        <RotateNotice />
        <LoginScreen onLogin={setPlayer} />
      </>
    )
  }

  if (pantalla === "menu") {
    return <MainMenu player={player} onNavigate={setScreen} onLogout={logout} />
  }

  // La partida ocupa la pantalla completa: no lleva la cabecera de navegacion.
  if (pantalla === "juego" && levelCode) {
    return (
      <>
        <RotateNotice />
        <GameScreen
          player={player}
          levelCode={levelCode}
          onSalir={() => setScreen("mapa")}
        />
      </>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-espol-arena text-espol-azulOscuro">
      <header className="flex items-center gap-4 bg-espol-azulOscuro px-4 py-3 text-white">
        <button
          type="button"
          onClick={() => setScreen("menu")}
          className="font-mono text-xs uppercase tracking-widest hover:text-espol-celeste"
        >
          ◀ Volver al menu
        </button>
        <p className="ml-auto text-sm">
          <span className="font-medium">{player.nickname}</span>
          <span className="ml-2 text-espol-celeste">
            {player.facultad} · {player.puntaje_total} pts
          </span>
        </p>
      </header>

      <main className="flex-1 p-4">
        {pantalla === "mapa" && (
          <LevelMap
            player={player}
            onPlay={(code: string) => {
              setLevelCode(code)
              setScreen("juego")
            }}
          />
        )}
        {pantalla === "perfil" && <ProfileScreen player={player} />}
        {pantalla === "ranking" && <RankingScreen player={player} />}
        {pantalla === "admin" && <AdminScreen />}
      </main>
    </div>
  )
}
