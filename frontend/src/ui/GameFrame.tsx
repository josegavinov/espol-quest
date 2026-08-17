// Marco del juego: 846 x 390 (movil horizontal), centrado y a pantalla
// completa. El HUD y los controles se posicionan respecto de este marco.
import type { ReactNode } from "react"

export const GAME_WIDTH = 846
export const GAME_HEIGHT = 390

export function GameFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[100dvh] w-screen items-center justify-center overflow-hidden bg-black">
      <div
        className="relative h-full w-full"
        style={{
          aspectRatio: `${GAME_WIDTH} / ${GAME_HEIGHT}`,
          maxWidth: `calc(100dvh * ${GAME_WIDTH} / ${GAME_HEIGHT})`,
          maxHeight: `calc(100vw * ${GAME_HEIGHT} / ${GAME_WIDTH})`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
