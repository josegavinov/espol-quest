// El juego es apaisado: en un celular en vertical se pide girar el telefono.
import { useEffect, useState } from "react"

export function RotateNotice() {
  const [vertical, setVertical] = useState(esVertical)

  useEffect(() => {
    const revisar = () => setVertical(esVertical())
    window.addEventListener("resize", revisar)
    window.addEventListener("orientationchange", revisar)
    return () => {
      window.removeEventListener("resize", revisar)
      window.removeEventListener("orientationchange", revisar)
    }
  }, [])

  if (!vertical) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-espol-azulOscuro p-8 text-center text-white">
      <span className="animate-pulse text-6xl" aria-hidden>📱</span>
      <h2 className="text-xl font-bold">Gira tu telefono</h2>
      <p className="max-w-xs text-espol-celeste">
        ESPOL Quest se juega en horizontal, como un mando: los controles quedan a
        los lados de la pantalla.
      </p>
    </div>
  )
}

// Solo aplica a pantallas chicas.
function esVertical() {
  return window.innerHeight > window.innerWidth && window.innerWidth < 900
}
