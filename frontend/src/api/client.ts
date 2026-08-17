// Cliente HTTP contra la API.
import type {
  AdminCheckpoint, AdminLevel, AdminMission, AdminQuestion,
  AnswerResponse, Badge, LevelProgress, LevelScene, LevelSummary,
  MissionAnswerRow, MissionDetail, MissionSummary, Player, PlayerProfile, Ranking,
} from "./types"

const BASE = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:3000/api/v1"

// Error devuelto por la API.
export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly detail?: unknown

  constructor(status: number, code: string, detail?: unknown) {
    super(`${status} ${code}`)
    this.status = status
    this.code = code
    this.detail = detail
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...init,
    })
  } catch {
    throw new ApiError(0, "sin_conexion")
  }

  const body = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(response.status, body?.error ?? "error_desconocido", body?.detalle)
  }
  return body as T
}

const query = (params: Record<string, string | number | undefined>) => {
  const pairs = Object.entries(params).filter(([, value]) => value !== undefined && value !== "")
  return pairs.length ? `?${new URLSearchParams(pairs.map(([k, v]) => [k, String(v)]))}` : ""
}

export const api = {
  // Base
  players: () => request<{ count: number; players: Player[] }>("/players"),

  registerPlayer: (data: { nickname: string; email?: string; facultad: string }) =>
    request<{ message: string; player: Player }>("/players", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  badges: () => request<{ count: number; insignias: Badge[] }>("/badges"),

  // RF-01 y RF-02 (Kevin)
  levels: (params: { zona?: string; mundo?: string; player_id?: number } = {}) =>
    request<{ count: number; levels: LevelSummary[] }>(`/levels${query(params)}`),

  scene: (code: string) => request<LevelScene>(`/levels/${code}`),

  saveState: (code: string, data: {
    player_id: number
    avatar?: { x: number; y: number }
    lives?: number
    elapsed_seconds?: number
    checkpoints_reached?: string[]
  }) =>
    request<{ message: string; state: LevelProgress }>(`/levels/${code}/state`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  state: (code: string, playerId: number) =>
    request<LevelProgress>(`/levels/${code}/state${query({ player_id: playerId })}`),

  // RF-03 y RF-04 (Jose)
  missions: (code: string, playerId?: number) =>
    request<{ level_code: string; level_name: string; missions: MissionSummary[] }>(
      `/levels/${code}/missions${query({ player_id: playerId })}`,
    ),

  mission: (code: string) => request<MissionDetail>(`/missions/${code}`),

  answers: (playerId: number) =>
    request<{ player: Player; puntaje_total: number; count: number; answers: MissionAnswerRow[] }>(
      `/players/${playerId}/answers`,
    ),

  answer: (code: string, data: { player_id: number; question_id: number; selected_option: number }) =>
    request<AnswerResponse>(`/missions/${code}/answers`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // RF-05 y RF-06 (Jorge)
  profile: (playerId: number) => request<PlayerProfile>(`/progress/${playerId}`),

  ranking: (params: { facultad?: string; limit?: number } = {}) =>
    request<Ranking>(`/ranking${query(params)}`),

  saveProgress: (data: {
    player_id: number
    level_code: string
    score?: number
    completed?: boolean
    badges?: string[]
  }) =>
    request<{ message: string; insignias_otorgadas: string[]; perfil: PlayerProfile }>("/progress", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // CMS (Jose Gavino: misiones y preguntas · Kevin Galvez: niveles y puntos)
  admin: {
    missions: () => request<{ count: number; missions: AdminMission[] }>("/admin/missions"),

    createMission: (data: Partial<AdminMission> & { code: string; level_code: string; title: string }) =>
      request<{ mission: AdminMission }>("/admin/missions", {
        method: "POST", body: JSON.stringify(data),
      }),

    updateMission: (code: string, data: Partial<AdminMission>) =>
      request<{ mission: AdminMission }>(`/admin/missions/${code}`, {
        method: "PATCH", body: JSON.stringify(data),
      }),

    deleteMission: (code: string) =>
      request<{ message: string }>(`/admin/missions/${code}`, { method: "DELETE" }),

    questions: (missionCode: string) =>
      request<{ count: number; questions: AdminQuestion[] }>(`/admin/missions/${missionCode}/questions`),

    createQuestion: (missionCode: string, data: Partial<AdminQuestion> & { statement: string }) =>
      request<{ question: AdminQuestion }>(`/admin/missions/${missionCode}/questions`, {
        method: "POST", body: JSON.stringify(data),
      }),

    updateQuestion: (id: number, data: Partial<AdminQuestion>) =>
      request<{ question: AdminQuestion }>(`/admin/questions/${id}`, {
        method: "PATCH", body: JSON.stringify(data),
      }),

    deleteQuestion: (id: number) =>
      request<{ message: string }>(`/admin/questions/${id}`, { method: "DELETE" }),

    levels: () => request<{ count: number; levels: AdminLevel[] }>("/admin/levels"),

    createLevel: (data: Partial<AdminLevel> & { code: string; name: string; zone: string; world: string }) =>
      request<{ level: AdminLevel }>("/admin/levels", {
        method: "POST", body: JSON.stringify(data),
      }),

    updateLevel: (code: string, data: Partial<AdminLevel>) =>
      request<{ level: AdminLevel }>(`/admin/levels/${code}`, {
        method: "PATCH", body: JSON.stringify(data),
      }),

    deleteLevel: (code: string) =>
      request<{ message: string }>(`/admin/levels/${code}`, { method: "DELETE" }),

    checkpoints: (levelCode: string) =>
      request<{ count: number; checkpoints: AdminCheckpoint[] }>(`/admin/levels/${levelCode}/checkpoints`),

    createCheckpoint: (levelCode: string, data: Partial<AdminCheckpoint> & { code: string; name: string }) =>
      request<{ checkpoint: AdminCheckpoint }>(`/admin/levels/${levelCode}/checkpoints`, {
        method: "POST", body: JSON.stringify(data),
      }),

    updateCheckpoint: (code: string, data: Partial<AdminCheckpoint>) =>
      request<{ checkpoint: AdminCheckpoint }>(`/admin/checkpoints/${code}`, {
        method: "PATCH", body: JSON.stringify(data),
      }),

    deleteCheckpoint: (code: string) =>
      request<{ message: string }>(`/admin/checkpoints/${code}`, { method: "DELETE" }),
  },
}
