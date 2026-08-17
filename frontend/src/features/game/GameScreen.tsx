// Partida: arma la pantalla y monta el canvas de Phaser.
// Responsable: Kevin Galvez - RF-01
// Las reglas viven en useGameSession; aqui va el armado de la pantalla.
import Phaser from "phaser"
import { useEffect, useRef } from "react"
import type { Player } from "../../api/types"
import { CampusScene } from "../../motor/CampusScene"
import { Hud } from "./Hud"
import { TouchControls } from "./TouchControls"
import { GameFrame, GAME_HEIGHT, GAME_WIDTH } from "../../ui/GameFrame"
import { Overlay } from "../../ui/Overlay"
import { TriviaOverlay } from "../missions/TriviaOverlay"
import { formatTime } from "../../format"
import { useGameSession } from "./useGameSession"

interface Props {
  player: Player
  levelCode: string
  onSalir: () => void
}

export function GameScreen({ player, levelCode, onSalir }: Props) {
  const contenedor = useRef<HTMLDivElement>(null)
  const juego = useRef<Phaser.Game | null>(null)
  const sesion = useGameSession(player, levelCode)
  const { level } = sesion

  // Monta Phaser una sola vez, cuando el nivel ya esta cargado.
  useEffect(() => {
    if (!level || !contenedor.current || juego.current) return

    const instancia = new Phaser.Game({
      type: Phaser.AUTO,
      parent: contenedor.current,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      transparent: true,
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      physics: { default: "arcade", arcade: { gravity: { x: 0, y: level.physics.gravity_y } } },
    })

    instancia.scene.add("campus", CampusScene, false)
    instancia.scene.start("campus", {
      escena: level,
      alcanzados: sesion.reached,
      eventos: sesion.events,
    })

    juego.current = instancia

    return () => {
      instancia.destroy(true)
      juego.current = null
      sesion.releaseScene()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level])

  return (
    <GameFrame>
      <div ref={contenedor} className="absolute inset-0" />

      <Hud
        nickname={player.nickname}
        levelName={level?.name ?? levelCode}
        score={sesion.score}
        badges={sesion.badges}
        lives={sesion.lives}
        explorationPct={sesion.explorationPct}
        seconds={sesion.seconds}
        onPause={sesion.pause}
        onExit={onSalir}
      />

      {sesion.nearby && !sesion.infoCard && !sesion.missionCode && !sesion.finished && (
        <p className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 rounded bg-black/70 px-3 py-1 font-mono text-xs text-white">
          [Presiona E — {sesion.nearby.kind === "mission"
            ? "Iniciar Mision/Trivia"
            : "Ver informacion"}]
        </p>
      )}

      <TouchControls
        canInteract={!!sesion.nearby}
        onLeft={(activo) => sesion.press("left", activo)}
        onRight={(activo) => sesion.press("right", activo)}
        onJump={(activo) => sesion.press("jump", activo)}
        onInteract={sesion.interact}
      />

      {sesion.infoCard && (
        <Overlay
          title={sesion.infoCard.name}
          subtitle="Punto de interes"
          onClose={sesion.closeInfoCard}
        >
          <p className="text-sm leading-relaxed">{sesion.infoCard.info_text}</p>
        </Overlay>
      )}

      {sesion.missionCode && (
        <TriviaOverlay
          missionCode={sesion.missionCode}
          playerId={player.player_id}
          onClose={sesion.closeMission}
        />
      )}

      {sesion.paused && !sesion.defeated && !sesion.finished && (
        <Overlay
          title="Partida en pausa"
          onClose={sesion.resume}
          footer={
            <div className="flex gap-2">
              <BotonPrincipal onClick={sesion.resume}>Continuar</BotonPrincipal>
              <BotonSecundario onClick={onSalir}>Salir al mapa</BotonSecundario>
            </div>
          }
        >
          <p className="text-sm">
            Llevas {sesion.explorationPct}% de exploracion y {formatTime(sesion.seconds)} de juego.
          </p>
        </Overlay>
      )}

      {sesion.defeated && (
        <Overlay
          title="Te quedaste sin vidas"
          subtitle={level?.name}
          footer={
            <div className="flex gap-2">
              <BotonPrincipal onClick={sesion.retry}>Reintentar</BotonPrincipal>
              <BotonSecundario onClick={onSalir}>Salir al mapa</BotonSecundario>
            </div>
          }
        >
          <p className="text-sm">
            Tu progreso quedo guardado: los {sesion.reached.length} puntos de interes
            que alcanzaste y los puntos de las trivias se conservan.
          </p>
        </Overlay>
      )}

      {sesion.finished && (
        <Overlay
          title="Nivel completado"
          onClose={onSalir}
          footer={<BotonPrincipal onClick={onSalir}>Volver al mapa</BotonPrincipal>}
        >
          <p className="text-sm">
            Exploraste el {sesion.explorationPct}% de {level?.name} en{" "}
            {formatTime(sesion.seconds)}. Puntaje total: {sesion.score} pts.
          </p>
        </Overlay>
      )}

      {sesion.error && (
        <p className="absolute inset-x-0 bottom-20 z-30 mx-auto w-max rounded bg-red-700 px-3 py-1 text-sm text-white">
          {sesion.error}
        </p>
      )}
    </GameFrame>
  )
}

function BotonPrincipal({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 rounded bg-espol-azul py-2 font-semibold uppercase tracking-wide text-white hover:brightness-110"
    >
      {children}
    </button>
  )
}

function BotonSecundario({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded border border-espol-azul px-4 py-2 font-semibold uppercase tracking-wide text-espol-azul hover:bg-espol-azul/10"
    >
      {children}
    </button>
  )
}
