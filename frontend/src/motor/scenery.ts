// Todo lo que se dibuja en un nivel: el estudiante, el interior del bloque, las
// plataformas y los puntos de interes.
import Phaser from "phaser"
import type { Checkpoint, LevelScene } from "../api/types"
import type { Theme } from "./themes"

type Plataforma = LevelScene["platforms"][number]

// Altura del estudiante; el decorado se dimensiona contra ella.
export const STUDENT_HEIGHT = 44

// Cada tipo de punto de interes tiene su color: informativo, mision y meta.
const COLOR_CHECKPOINT: Record<Checkpoint["kind"], number> = {
  info: 0xf4c430,
  mission: 0xe8833a,
  goal: 0x35c46f,
}

// Puerta flotante con el nombre del punto de interes.
export function drawCheckpoint(escena: Phaser.Scene, checkpoint: Checkpoint) {
  const color = COLOR_CHECKPOINT[checkpoint.kind]
  const marca = escena.add.container(checkpoint.position.x, checkpoint.position.y).setDepth(3)

  marca.add(escena.add.rectangle(0, 0, 34, 48, 0x0e2a42))
  marca.add(escena.add.rectangle(0, 0, 26, 40, color))
  marca.add(escena.add.rectangle(0, -24, 38, 6, color))
  marca.add(
    escena.add.text(0, -40, checkpoint.name, {
      fontFamily: "monospace", fontSize: "12px", color: "#ffffff",
      backgroundColor: "#0a2540", padding: { x: 4, y: 2 },
    }).setOrigin(0.5),
  )

  escena.tweens.add({
    targets: marca, y: checkpoint.position.y - 5,
    duration: 1400, yoyo: true, repeat: -1, ease: "Sine.easeInOut",
  })

  return marca
}

// Estudiante con mochila, en tres cuadros: quieto y dos pasos.
export function createStudent(escena: Phaser.Scene) {
  const A = STUDENT_HEIGHT

  for (let cuadro = 0; cuadro < 3; cuadro++) {
    const g = escena.add.graphics()
    const paso = cuadro === 0 ? 0 : cuadro === 1 ? 3 : -3

    g.fillStyle(0x8a4b2a).fillRoundedRect(2, A * 0.34, 8, A * 0.34, 3)          // mochila
    g.fillStyle(0x24384d).fillRect(9, A * 0.66, 6, A * 0.3 + paso)              // pierna atras
    g.fillStyle(0x2f4a66).fillRect(16, A * 0.66, 6, A * 0.3 - paso)             // pierna frente
    g.fillStyle(0x1b2b3d).fillRect(8, A - 4 + paso, 8, 4)                       // zapato atras
    g.fillStyle(0x1b2b3d).fillRect(15, A - 4 - paso, 8, 4)                      // zapato frente
    g.fillStyle(0x2f7fc4).fillRoundedRect(7, A * 0.32, 16, A * 0.36, 4)         // camiseta
    g.fillStyle(0x4fa3d9).fillRect(13, A * 0.34, 4, A * 0.3)                    // franja
    g.fillStyle(0xe8b58c).fillRect(9, A * 0.6, 5, 6)                            // mano
    g.fillStyle(0xf0c9a0).fillCircle(15, A * 0.2, 8)                            // cabeza
    g.fillStyle(0x2c2016).fillRoundedRect(7, A * 0.06, 16, 8, 3)                // cabello
    g.fillStyle(0x1b2b3d).fillRect(17, A * 0.19, 2, 2)                          // ojo

    g.generateTexture(`estudiante-${cuadro}`, 28, A)
    g.destroy()
  }

  escena.anims.create({
    key: "caminar",
    frames: [{ key: "estudiante-1" }, { key: "estudiante-0" }, { key: "estudiante-2" }],
    frameRate: 9,
    repeat: -1,
  })
}

// Interior del bloque: pared, techo, ventanales y puertas de aulas.
export function drawInterior(escena: Phaser.Scene, nivel: LevelScene, tema: Theme) {
  const { bounds } = nivel
      const piso = 660                    // altura del suelo del nivel
  const altoPuerta = STUDENT_HEIGHT * 1.4
  const anchoPuerta = STUDENT_HEIGHT * 0.62

  escena.add.rectangle(bounds.width / 2, bounds.height / 2, bounds.width, bounds.height, tema.pared)
    .setDepth(-40)

  const techo = piso - STUDENT_HEIGHT * 5
  escena.add.rectangle(bounds.width / 2, techo - 10, bounds.width, 20, tema.techo).setDepth(-39)
  escena.add.rectangle(bounds.width / 2, techo, bounds.width, 3, tema.paredZocalo, 0.6).setDepth(-39)
  for (let x = 90; x < bounds.width; x += 260) {
    escena.add.rectangle(x, techo + 10, 2, 20, tema.paredZocalo, 0.7).setDepth(-38)
    escena.add.rectangle(x, techo + 24, 64, 10, 0xfff6d0).setDepth(-38)
    escena.add.rectangle(x, techo + 52, 90, 46, 0xfff6d0, 0.10).setDepth(-38)
  }

  for (let x = 150; x < bounds.width; x += 300) {
    const vy = piso - STUDENT_HEIGHT * 3.4
    const vw = STUDENT_HEIGHT * 2, vh = STUDENT_HEIGHT * 1.5
    escena.add.rectangle(x, vy, vw + 10, vh + 10, tema.paredZocalo).setDepth(-37)
    escena.add.rectangle(x, vy, vw, vh, tema.cielo).setDepth(-36)
    escena.add.ellipse(x - 14, vy + vh / 2 - 10, vw * 0.8, vh * 0.5, tema.colinaLejana).setDepth(-35)
    escena.add.ellipse(x + 20, vy + vh / 2 - 4, vw * 0.7, vh * 0.4, tema.colina).setDepth(-35)
    escena.add.rectangle(x, vy, 4, vh, tema.paredZocalo).setDepth(-34)
    escena.add.rectangle(x, vy, vw, 4, tema.paredZocalo).setDepth(-34)
  }

  for (let i = 0; i * 300 < bounds.width; i++) {
    const x = 300 + i * 300
    escena.add.rectangle(x, piso - altoPuerta / 2, anchoPuerta + 8, altoPuerta + 8, tema.paredZocalo)
      .setDepth(-33)
    escena.add.rectangle(x, piso - altoPuerta / 2, anchoPuerta, altoPuerta, tema.puerta).setDepth(-32)
    escena.add.circle(x + anchoPuerta / 2 - 6, piso - altoPuerta / 2, 2, tema.paredZocalo).setDepth(-31)
    escena.add.rectangle(x, piso - altoPuerta - 14, anchoPuerta + 20, 16, tema.paredZocalo).setDepth(-31)
    escena.add.text(x, piso - altoPuerta - 14, `${tema.letreroPuerta} ${101 + i}`, {
      fontFamily: "monospace", fontSize: "10px", color: "#ffffff",
    }).setOrigin(0.5).setDepth(-30)
  }

  escena.add.rectangle(bounds.width / 2, piso - 6, bounds.width, 12, tema.paredZocalo, 0.55)
    .setDepth(-29)
}

// Plataforma que va y viene entre dos puntos, para alcanzar los checkpoints
// que estan en alto.
export function createMovingPlatform(escena: Phaser.Scene, plataforma: Plataforma) {
  const g = escena.add.graphics()
  g.fillStyle(0x6b5aa6).fillRect(0, 0, plataforma.width, plataforma.height)
  g.fillStyle(0xa892e0).fillRect(0, 0, plataforma.width, 5)
  g.fillStyle(0x4a3d75).fillRect(0, plataforma.height - 4, plataforma.width, 4)
  g.generateTexture(`movil-${plataforma.id}`, plataforma.width, plataforma.height)
  g.destroy()

  const sprite = escena.physics.add.sprite(
    plataforma.x + plataforma.width / 2,
    plataforma.y + plataforma.height / 2,
    `movil-${plataforma.id}`,
  ).setDepth(1)
  sprite.body.setAllowGravity(false)
  sprite.body.setImmovable(true)

  escena.tweens.add({
    targets: sprite,
    x: sprite.x + 170,
    duration: 2200,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut",
  })

  return sprite
}

export function drawPlatform(escena: Phaser.Scene, plataforma: Plataforma, tema: Theme) {
  const cx = plataforma.x + plataforma.width / 2
  const cy = plataforma.y + plataforma.height / 2

  if (plataforma.kind === "hazard") {
    escena.add.rectangle(cx, cy, plataforma.width, plataforma.height, 0x8e2f2a).setDepth(1)
    for (let x = plataforma.x + 6; x < plataforma.x + plataforma.width; x += 14) {
      escena.add.triangle(x, plataforma.y, 0, 8, 7, -8, 14, 8, 0xe74c3c).setDepth(1)
    }
    return escena.add.rectangle(cx, cy, plataforma.width, plataforma.height)
  }

  // Losa con canto claro arriba, sombra abajo y juntas cada 40 px: se lee
  // como piso de edificio y no como un rectangulo de color.
  escena.add.rectangle(cx, cy, plataforma.width, plataforma.height, tema.plataforma).setDepth(1)
  escena.add.rectangle(cx, plataforma.y + 2, plataforma.width, 5, tema.plataformaBorde).setDepth(1)
  escena.add.rectangle(cx, plataforma.y + plataforma.height - 2, plataforma.width, 4,
                     tema.paredZocalo, 0.5).setDepth(1)
  for (let x = plataforma.x + 40; x < plataforma.x + plataforma.width; x += 40) {
    escena.add.rectangle(x, cy + 2, 2, plataforma.height - 6, tema.paredZocalo, 0.25).setDepth(1)
  }

  return escena.add.rectangle(cx, cy, plataforma.width, plataforma.height)
}
