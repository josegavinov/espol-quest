// Tipos de las respuestas de la API.

export const FACULTADES = [
  "FIEC", "FCNM", "FICT", "FIMCP", "FCSH", "FADCOM", "FIMCBOR", "FCV",
] as const

export type Facultad = (typeof FACULTADES)[number]

export interface Player {
  player_id: number
  nickname: string
  facultad: Facultad
  puntaje_total: number
  niveles_superados: number
  insignias: number
}

export interface Badge {
  key: string
  nombre: string
  descripcion: string
  icono: string
  obtenida_el?: string
}

export interface LevelProgress {
  level_code: string
  puntaje: number
  puntaje_misiones: number
  puntaje_nivel: number
  exploracion_pct: number
  checkpoints_alcanzados: string[]
  misiones_completadas: number
  avatar: { x: number; y: number }
  vidas: number
  segundos_jugados: number
  completado: boolean
  completado_el: string | null
}

export interface PlayerProfile {
  player_id: number
  nickname: string
  email: string | null
  facultad: Facultad
  puntaje_total: number
  niveles_superados: number
  exploracion_promedio_pct: number
  niveles: LevelProgress[]
  insignias: Badge[]
}

export interface RankingRow extends Player {
  posicion: number
}

export interface Ranking {
  alcance: string
  total_jugadores: number
  mostrados: number
  tabla: RankingRow[]
}

export interface LevelSummary {
  code: string
  name: string
  zone: string
  world: string
  order: number
  difficulty: string
  required_score: number
  insignia: string | null
  desbloqueado: boolean
  description: string
  checkpoints_count: number
}

export type PlatformKind = "solid" | "moving" | "hazard"
export type CheckpointKind = "info" | "mission" | "goal"

export interface Platform {
  id: number
  x: number
  y: number
  width: number
  height: number
  kind: PlatformKind
  texture_key: string
}

export interface Checkpoint {
  code: string
  name: string
  position: { x: number; y: number }
  kind: CheckpointKind
  info_text: string
  order: number
}

export interface LevelScene {
  code: string
  name: string
  zone: string
  world: string
  difficulty: string
  bounds: { width: number; height: number }
  physics: { gravity_y: number }
  spawn: { x: number; y: number }
  background_key: string
  platforms: Platform[]
  checkpoints: Checkpoint[]
}

export interface MissionSummary {
  code: string
  title: string
  description: string
  kind: string
  checkpoint_code: string | null
  questions_count: number
  max_points: number
  insignia: string | null
  order: number
  estado: "pendiente" | "resuelta" | "desconocido"
}

export interface Question {
  id: number
  statement: string
  options: string[]
  points: number
  order: number
}

export interface MissionDetail extends MissionSummary {
  level_code: string
  questions: Question[]
}

export interface MissionResult {
  mission_code: string
  puntaje_obtenido: number
  puntaje_maximo: number
  preguntas_correctas: number
  preguntas_totales: number
  completada: boolean
  insignia: string | null
}

export interface MissionAnswerRow {
  id: number
  player_id: number
  mission_code: string
  question_id: number
  selected_option: number
  correcta: boolean
  puntaje_otorgado: number
  intento: number
  respondida_el: string
}

export interface AnswerResponse {
  message: string
  answer: MissionAnswerRow
  feedback: string
  insignias_otorgadas: string[]
  resumen_mision: MissionResult
}

// --- CMS ---------------------------------------------------------------

export interface AdminMission {
  code: string
  level_code: string
  checkpoint_code: string | null
  badge_key: string | null
  title: string
  description: string
  kind: string
  order_index: number
  active: boolean
  questions_count: number
}

// Aqui si viaja la respuesta correcta, que es lo que se edita.
export interface AdminQuestion {
  id: number
  statement: string
  options: string[]
  correct_option: number
  points: number
  feedback_ok: string
  feedback_fail: string
  order_index: number
}

export interface AdminLevel {
  code: string
  name: string
  zone: string
  world: string
  order_index: number
  description: string
  difficulty: string
  required_score: number
  active: boolean
  width: number
  height: number
  gravity_y: number
  spawn_x: number
  spawn_y: number
  background_key: string
  badge_key: string | null
  checkpoints_count: number
}

export interface AdminCheckpoint {
  code: string
  level_code: string
  name: string
  x: number
  y: number
  kind: CheckpointKind
  info_text: string
  order_index: number
}
