# Datos de demostración del Servicio de Administración y Ranking.
# Responsable: Jorge del Campo
# Uso: bin/rails db:seed

BADGES = [
  { key: "insignia_fiec",      name: "Explorador FIEC",
    description: "Completaste la trivia del Bloque FIEC.", icon: "chip" },
  { key: "insignia_lector",    name: "Lector Politécnico",
    description: "Dominas la normativa de la Biblioteca Central.", icon: "libro" },
  { key: "insignia_bienestar", name: "Aliado del Bienestar",
    description: "Conoces los servicios de Bienestar Estudiantil.", icon: "corazon" },
  { key: "insignia_novato",    name: "Novato Orientado",
    description: "Superaste tu primer nivel del campus.", icon: "brujula" }
].freeze

BADGES.each do |attrs|
  Badge.find_or_initialize_by(key: attrs[:key]).update!(attrs)
end

# Perfiles de ejemplo para que la tabla de clasificación tenga datos visibles.
DEMO = [
  { external_player_id: 1, nickname: "kevin_g",  facultad: "FIEC",
    levels: [{ level_code: "FIEC-01", score: 20, exploration_pct: 100, completed: true,
               missions_completed: 1 }],
    badges: %w[insignia_fiec insignia_novato] },
  { external_player_id: 3, nickname: "jorge_dc", facultad: "FCNM",
    levels: [{ level_code: "FIEC-01", score: 10, exploration_pct: 66.67, completed: false,
               missions_completed: 0 }],
    badges: %w[insignia_novato] },
  { external_player_id: 4, nickname: "novato01", facultad: "FIMCP",
    levels: [{ level_code: "FIEC-01", score: 20, exploration_pct: 100, completed: true,
               missions_completed: 1 },
             { level_code: "BIB-01", score: 30, exploration_pct: 100, completed: true,
               missions_completed: 1 }],
    badges: %w[insignia_fiec insignia_lector insignia_novato] }
].freeze

DEMO.each do |data|
  profile = Profile.find_or_initialize_by(external_player_id: data[:external_player_id])
  profile.update!(nickname: data[:nickname], facultad: data[:facultad])

  data[:levels].each do |lv|
    progress = profile.level_progresses.find_or_initialize_by(level_code: lv[:level_code])
    progress.update!(lv.merge(completed_at: lv[:completed] ? Time.current : nil))
  end

  data[:badges].each do |key|
    badge = Badge.find_by(key: key)
    next if badge.nil? || profile.profile_badges.exists?(badge_id: badge.id)

    profile.profile_badges.create!(badge: badge, awarded_at: Time.current)
  end

  profile.recalculate_totals!
end

puts "Insignias: #{Badge.count} | Perfiles: #{Profile.count} | Progresos: #{LevelProgress.count}"
