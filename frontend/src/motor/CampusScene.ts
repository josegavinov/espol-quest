// Escena de plataformas de un nivel del campus.
// Responsable: Kevin Galvez - RF-01
// No habla con el backend: recibe el nivel cargado y avisa con callbacks.
import Phaser from "phaser"
import type { Checkpoint, LevelScene } from "../api/types"
import {
  STUDENT_HEIGHT, createStudent, createMovingPlatform, drawCheckpoint,
  drawInterior, drawPlatform,
} from "./scenery"
import { themeFor, type Theme } from "./themes"

export interface Controls {
  left: boolean
  right: boolean
  jump: boolean
}

export interface CampusSceneEvents {
  onReady: (escena: CampusScene) => void
  onCheckpointNear: (checkpoint: Checkpoint | null) => void
  onCheckpointReached: (checkpoint: Checkpoint) => void
  onLifeLost: (vidas: number) => void
  onPosition: (x: number, y: number) => void
}

const VELOCIDAD = 230
const IMPULSO_SALTO = 540
const DISTANCIA_INTERACCION = 80


export class CampusScene extends Phaser.Scene {
  private escena!: LevelScene
  private eventos!: CampusSceneEvents
  private alcanzados = new Set<string>()

  private avatar!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  private teclas!: Record<string, Phaser.Input.Keyboard.Key>
  private marcas = new Map<string, Phaser.GameObjects.Container>()

  // Los botones en pantalla escriben aqui; el teclado se suma en update().
  readonly controls: Controls = { left: false, right: false, jump: false }

  private tema!: Theme
  private moviles: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = []
  private vidas = 3
  private cercano: Checkpoint | null = null

  constructor() {
    super("campus")
  }

  init(datos: { escena: LevelScene; eventos: CampusSceneEvents; alcanzados: string[] }) {
    this.escena = datos.escena
    this.eventos = datos.eventos
    this.alcanzados = new Set(datos.alcanzados)
  }

  create() {
    const { bounds, physics, spawn } = this.escena

    this.physics.world.gravity.y = physics.gravity_y
    // El mundo fisico sigue mas abajo, para que caer al vacio cueste una vida.
    this.physics.world.setBounds(0, 0, bounds.width, bounds.height + 400)
    this.cameras.main.setBounds(0, 0, bounds.width, bounds.height)

    this.tema = themeFor(this.escena.background_key)
    drawInterior(this, this.escena, this.tema)

    const solidas = this.physics.add.staticGroup()
    const peligros = this.physics.add.staticGroup()
    for (const plataforma of this.escena.platforms) {
      if (plataforma.kind === "moving") {
        this.moviles.push(createMovingPlatform(this, plataforma))
        continue
      }
      const cuerpo = drawPlatform(this, plataforma, this.tema)
      const grupo = plataforma.kind === "hazard" ? peligros : solidas
      grupo.add(cuerpo)
      this.physics.add.existing(cuerpo, true)
    }

    this.drawCheckpoints()

    createStudent(this)

    this.avatar = this.physics.add.sprite(spawn.x, spawn.y, "estudiante-0")
    this.avatar.setDepth(5)
    this.avatar.setCollideWorldBounds(true)
    this.avatar.body.setSize(20, STUDENT_HEIGHT - 2)
    this.physics.add.collider(this.avatar, solidas)
    for (const movil of this.moviles) this.physics.add.collider(this.avatar, movil)
    this.physics.add.overlap(this.avatar, peligros, () => this.perderVida())

    this.cameras.main.startFollow(this.avatar, true, 0.12, 0.12)

    // Flechas o WASD, espacio o W para saltar, E o Enter para interactuar.
    this.teclas = this.input.keyboard!.addKeys(
      "LEFT,RIGHT,UP,SPACE,A,D,W,E,ENTER",
    ) as Record<string, Phaser.Input.Keyboard.Key>

    this.eventos.onReady(this)
  }

  update() {
    const izquierda = this.controls.left || this.teclas.LEFT.isDown || this.teclas.A.isDown
    const derecha = this.controls.right || this.teclas.RIGHT.isDown || this.teclas.D.isDown
    const saltar = this.controls.jump || this.teclas.UP.isDown ||
      this.teclas.SPACE.isDown || this.teclas.W.isDown

    this.avatar.setVelocityX(izquierda ? -VELOCIDAD : derecha ? VELOCIDAD : 0)
    if (izquierda || derecha) {
      this.avatar.setFlipX(izquierda)
      this.avatar.anims.play("caminar", true)
    } else {
      this.avatar.anims.stop()
      this.avatar.setTexture("estudiante-0")
    }
    if (saltar && this.avatar.body.blocked.down) this.avatar.setVelocityY(-IMPULSO_SALTO)

    // Caer fuera del escenario cuesta una vida y devuelve al punto de aparicion.
    if (this.avatar.y > this.escena.bounds.height + 40) this.perderVida()

    if (Phaser.Input.Keyboard.JustDown(this.teclas.E) ||
        Phaser.Input.Keyboard.JustDown(this.teclas.ENTER)) {
      this.interact()
    }

    // La fisica arcade no arrastra a quien va parado sobre una plataforma movil.
    for (const movil of this.moviles) {
      const encima = this.avatar.body.blocked.down &&
        Math.abs(this.avatar.y + 20 - (movil.y - 12)) < 10 &&
        Math.abs(this.avatar.x - movil.x) < movil.displayWidth / 2 + 14
      if (encima) this.avatar.x += movil.body.deltaX()
    }

    this.revisarCheckpoints()
    this.eventos.onPosition(Math.round(this.avatar.x), Math.round(this.avatar.y))
  }

  // Reinicia el nivel con las vidas llenas.
  restart() {
    this.vidas = 3
    this.avatar.setData("invulnerable", false)
    this.avatar.setAlpha(1)
    this.avatar.setPosition(this.escena.spawn.x, this.escena.spawn.y)
    this.avatar.setVelocity(0, 0)
    this.eventos.onLifeLost(this.vidas)
  }

  // Lo disparan el boton A y las teclas E / Enter.
  interact() {
    if (!this.cercano) return

    const checkpoint = this.cercano
    this.alcanzados.add(checkpoint.code)
    this.marcarAlcanzado(checkpoint.code)
    this.eventos.onCheckpointReached(checkpoint)
  }

  private revisarCheckpoints() {
    const cerca = this.escena.checkpoints.find((checkpoint) =>
      Phaser.Math.Distance.Between(
        this.avatar.x, this.avatar.y,
        checkpoint.position.x, checkpoint.position.y,
      ) < DISTANCIA_INTERACCION,
    ) ?? null

    if (cerca?.code !== this.cercano?.code) {
      this.cercano = cerca
      this.eventos.onCheckpointNear(cerca)
    }
  }

  private perderVida() {
    if (this.avatar.getData("invulnerable")) return

    this.vidas -= 1
    this.avatar.setData("invulnerable", true)
    this.avatar.setPosition(this.escena.spawn.x, this.escena.spawn.y)
    this.avatar.setVelocity(0, 0)
    this.cameras.main.flash(200, 200, 60, 60)
    this.tweens.add({ targets: this.avatar, alpha: 0.3, yoyo: true, repeat: 3, duration: 100 })
    this.time.delayedCall(800, () => {
      this.avatar.setData("invulnerable", false)
      this.avatar.setAlpha(1)
    })
    this.eventos.onLifeLost(Math.max(this.vidas, 0))
  }

  private drawCheckpoints() {
    for (const checkpoint of this.escena.checkpoints) {
      this.marcas.set(checkpoint.code, drawCheckpoint(this, checkpoint))
      if (this.alcanzados.has(checkpoint.code)) this.marcarAlcanzado(checkpoint.code)
    }
  }

  private marcarAlcanzado(code: string) {
    const marca = this.marcas.get(code)
    if (!marca) return

    marca.setAlpha(0.45)
    this.tweens.killTweensOf(marca)
  }
}
