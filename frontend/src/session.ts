// Quien esta jugando. Se guarda en localStorage para no repetir el registro.
import { useCallback, useEffect, useState } from "react"
import { api } from "./api/client"
import type { Player } from "./api/types"

const CLAVE = "espol-quest:player"

function leer(): Player | null {
  const guardado = localStorage.getItem(CLAVE)
  if (!guardado) return null

  try {
    return JSON.parse(guardado) as Player
  } catch {
    localStorage.removeItem(CLAVE)
    return null
  }
}

export function usePlayer() {
  const [player, setPlayer] = useState<Player | null>(leer)

  useEffect(() => {
    if (player) localStorage.setItem(CLAVE, JSON.stringify(player))
    else localStorage.removeItem(CLAVE)
  }, [player])

  const refresh = useCallback(async () => {
    const id = player?.player_id
    if (!id) return

    try {
      const perfil = await api.profile(id)
      setPlayer({
        player_id: perfil.player_id,
        nickname: perfil.nickname,
        facultad: perfil.facultad,
        puntaje_total: perfil.puntaje_total,
        niveles_superados: perfil.niveles_superados,
        insignias: perfil.insignias.length,
      })
    } catch {
      return
    }
  }, [player?.player_id])

  return { player, setPlayer, refresh, logout: () => setPlayer(null) }
}
