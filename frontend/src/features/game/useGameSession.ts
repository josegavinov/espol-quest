// Reglas de la partida: carga el nivel, lleva el marcador, decide que pasa al
// alcanzar cada punto de interes y guarda el avance.
import { useCallback, useEffect, useRef, useState } from "react"
import { api } from "../../api/client"
import type { Checkpoint, LevelScene, Player } from "../../api/types"
import type { CampusScene, CampusSceneEvents, Controls } from "../../motor/CampusScene"

export const INITIAL_LIVES = 3

// Estado con referencia al valor actual: la escena recibe sus callbacks una
// sola vez y el estado normal se le quedaria congelado.
function useEstadoVivo<T>(inicial: T) {
  const [valor, setValor] = useState(inicial)
  const ref = useRef(valor)

  const asignar = useCallback((nuevo: T) => {
    ref.current = nuevo
    setValor(nuevo)
  }, [])

  return [valor, asignar, ref] as const
}

export function useGameSession(player: Player, levelCode: string) {
  const escenaPhaser = useRef<CampusScene | null>(null)
  const posicion = useRef({ x: 0, y: 0 })

  const [escena, setEscena] = useState<LevelScene | null>(null)
  const [alcanzados, setAlcanzados, alcanzadosVivos] = useEstadoVivo<string[]>([])
  const [vidas, setVidas, vidasVivas] = useEstadoVivo(INITIAL_LIVES)
  const [segundos, setSegundos, segundosVivos] = useEstadoVivo(0)

  const [cercano, setCercano] = useState<Checkpoint | null>(null)
  const [ficha, setFicha] = useState<Checkpoint | null>(null)
  const [trivia, setTrivia] = useState<string | null>(null)
  const [puntaje, setPuntaje] = useState(player.puntaje_total)
  const [insignias, setInsignias] = useState(player.insignias)
  const [terminado, setTerminado] = useState(false)
  const [pausa, setPausa] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const derrota = vidas <= 0
  const detenido = pausa || derrota || terminado || !!ficha || !!trivia

  const total = escena?.checkpoints.length ?? 0
  const exploracion = total ? Math.round((alcanzados.length / total) * 100) : 0

  // Las vidas no se heredan: cada partida empieza con tres.
  useEffect(() => {
    let vigente = true

    Promise.all([
      api.scene(levelCode),
      api.state(levelCode, player.player_id).catch(() => null),
    ]).then(([datosEscena, estado]) => {
      if (!vigente) return
      setEscena(datosEscena)
      setAlcanzados(estado?.checkpoints_alcanzados ?? [])
      setVidas(INITIAL_LIVES)
      setSegundos(0)
    }).catch(() => vigente && setError("No se pudo cargar el nivel."))

    return () => { vigente = false }
  }, [levelCode, player.player_id, setAlcanzados, setVidas, setSegundos])

  // Cronometro: se detiene con la pausa, la trivia, la derrota y el final.
  useEffect(() => {
    if (detenido) return

    const reloj = setInterval(() => setSegundos(segundosVivos.current + 1), 1000)
    return () => clearInterval(reloj)
  }, [detenido, setSegundos, segundosVivos])

  // La escena se congela junto con la interfaz.
  useEffect(() => {
    if (!escenaPhaser.current) return

    if (detenido) escenaPhaser.current.scene.pause()
    else escenaPhaser.current.scene.resume()
  }, [detenido])

  async function guardarEstado(checkpoints: string[]) {
    try {
      await api.saveState(levelCode, {
        player_id: player.player_id,
        avatar: posicion.current,
        lives: vidasVivas.current,
        elapsed_seconds: segundosVivos.current,
        checkpoints_reached: checkpoints,
      })
    } catch {
      // Se reintenta en el siguiente punto de interes.
    }
  }

  async function abrirMision(checkpoint: Checkpoint) {
    try {
      const { missions } = await api.missions(levelCode, player.player_id)
      const mision = missions.find((m) => m.checkpoint_code === checkpoint.code)
      if (mision) setTrivia(mision.code)
      else setFicha(checkpoint)
    } catch {
      setError("No se pudieron cargar las misiones del nivel.")
    }
  }

  async function terminarNivel(checkpoints: string[]) {
    try {
      // La insignia del nivel la otorga el backend: aqui no se conoce su clave.
      const resultado = await api.saveProgress({
        player_id: player.player_id,
        level_code: levelCode,
        completed: checkpoints.length === total,
      })
      setPuntaje(resultado.perfil.puntaje_total)
      setInsignias(resultado.perfil.insignias.length)
      setTerminado(true)
    } catch {
      setError("No se pudo registrar el fin del nivel.")
    }
  }

  async function refrescarMarcador() {
    try {
      const perfil = await api.profile(player.player_id)
      setPuntaje(perfil.puntaje_total)
      setInsignias(perfil.insignias.length)
    } catch {
    }
  }

  // Lee los checkpoints de la referencia, no del estado.
  async function alcanzar(checkpoint: Checkpoint) {
    const previos = alcanzadosVivos.current
    const checkpoints = previos.includes(checkpoint.code)
      ? previos
      : [...previos, checkpoint.code]
    setAlcanzados(checkpoints)

    await guardarEstado(checkpoints)

    if (checkpoint.kind === "info") setFicha(checkpoint)
    if (checkpoint.kind === "mission") await abrirMision(checkpoint)
    if (checkpoint.kind === "goal") await terminarNivel(checkpoints)
  }

  const eventos: CampusSceneEvents = {
    onReady: (scene) => { escenaPhaser.current = scene },
    onCheckpointNear: setCercano,
    onCheckpointReached: alcanzar,
    onLifeLost: setVidas,
    onPosition: (x, y) => { posicion.current = { x, y } },
  }

  return {
    level: escena,
    reached: alcanzados,
    nearby: cercano,
    infoCard: ficha,
    missionCode: trivia,
    lives: vidas,
    score: puntaje,
    badges: insignias,
    seconds: segundos,
    explorationPct: exploracion,
    finished: terminado,
    paused: pausa,
    defeated: derrota,
    error,
    events: eventos,
    pause: () => setPausa(true),
    resume: () => setPausa(false),
    closeInfoCard: () => setFicha(null),
    closeMission: () => {
      setTrivia(null)
      void refrescarMarcador()
    },
    // Los controles en pantalla escriben en la escena.
    press: (accion: keyof Controls, activo: boolean) => {
      if (escenaPhaser.current) escenaPhaser.current.controls[accion] = activo
    },
    interact: () => escenaPhaser.current?.interact(),
    retry: () => {
      escenaPhaser.current?.restart()
      setVidas(INITIAL_LIVES)
    },
    releaseScene: () => { escenaPhaser.current = null },
  }
}
