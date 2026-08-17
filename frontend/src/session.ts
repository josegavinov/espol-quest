// Quien esta jugando. Se guarda en localStorage para no repetir el registro.
import { useEffect, useState } from "react"
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

  return { player, setPlayer, logout: () => setPlayer(null) }
}
