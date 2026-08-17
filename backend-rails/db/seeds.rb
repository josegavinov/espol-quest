# Datos de demostracion de ESPOL Quest.
# Uso: bin/rails db:seed  (es idempotente, se puede correr varias veces)

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

PLAYERS = [
  { nickname: "kevin_g",  email: "kagalvez@espol.edu.ec",  facultad: "FIEC" },
  { nickname: "jose_g",   email: "jgavino@espol.edu.ec",   facultad: "FIEC" },
  { nickname: "jorge_dc", email: "jdelcampo@espol.edu.ec", facultad: "FCNM" },
  { nickname: "novato01", email: "novato01@espol.edu.ec",  facultad: "FIMCP" }
].freeze

LEVELS = [
  {
    code: "FIEC-01", badge_key: "insignia_novato",
    name: "Bloque FIEC: Laboratorios", zone: "FIEC",
    world: "Zona Norte", order_index: 1, difficulty: "facil", required_score: 0,
    description: "Recorre los laboratorios de la Facultad de Ingeniería en " \
                 "Electricidad y Computación y ubica sus servicios.",
    width: 2400, height: 720, gravity_y: 900,
    spawn_x: 64, spawn_y: 520, background_key: "fiec_day",
    # Los checkpoints estan sobre plataformas, con vanos y obstaculos.
    platforms: [
      { x: 0, y: 660, width: 700, height: 40, kind: "solid" },
      { x: 880, y: 660, width: 520, height: 40, kind: "solid" },
      { x: 1560, y: 660, width: 840, height: 40, kind: "solid" },
      { x: 1180, y: 648, width: 90, height: 12, kind: "hazard", texture_key: "tile_agua" },
      { x: 480, y: 540, width: 160, height: 24, kind: "solid", texture_key: "tile_metal" },
      { x: 1080, y: 540, width: 200, height: 24, kind: "solid", texture_key: "tile_metal" },
      { x: 1900, y: 540, width: 180, height: 24, kind: "solid" },
      { x: 2100, y: 430, width: 200, height: 24, kind: "moving", texture_key: "tile_metal" }
    ],
    checkpoints: [
      { code: "FIEC-01-CP1", name: "Entrada del Bloque A", x: 260, y: 620,
        kind: "info", order_index: 1,
        info_text: "El Bloque A concentra las aulas de primer año de FIEC." },
      { code: "FIEC-01-CP2", name: "Laboratorio de Redes", x: 1180, y: 500,
        kind: "mission", order_index: 2,
        info_text: "Aquí se dictan las prácticas de Redes de Datos." },
      { code: "FIEC-01-CP3", name: "Secretaría FIEC", x: 2200, y: 390,
        kind: "goal", order_index: 3,
        info_text: "Trámites académicos: registro, cambios de paralelo y retiros." }
    ]
  },
  {
    code: "BIB-01", badge_key: "insignia_lector",
    name: "Biblioteca Central", zone: "Biblioteca",
    world: "Zona Central", order_index: 2, difficulty: "media", required_score: 30,
    description: "Explora la Biblioteca Central, sus salas de estudio y el " \
                 "servicio de préstamo de libros.",
    width: 2000, height: 720, gravity_y: 900,
    spawn_x: 80, spawn_y: 540, background_key: "biblioteca_day",
    platforms: [
      { x: 0, y: 660, width: 600, height: 40, kind: "solid" },
      { x: 760, y: 660, width: 540, height: 40, kind: "solid" },
      { x: 1460, y: 660, width: 540, height: 40, kind: "solid" },
      { x: 1080, y: 648, width: 90, height: 12, kind: "hazard" },
      { x: 380, y: 540, width: 200, height: 24, kind: "solid" },
      { x: 820, y: 540, width: 180, height: 24, kind: "solid" },
      { x: 1000, y: 430, width: 180, height: 24, kind: "moving" },
      { x: 1560, y: 520, width: 200, height: 24, kind: "solid" }
    ],
    checkpoints: [
      { code: "BIB-01-CP1", name: "Counter de préstamos", x: 460, y: 500,
        kind: "mission", order_index: 1,
        info_text: "Se prestan hasta 3 libros por estudiante durante 7 días." },
      { code: "BIB-01-CP2", name: "Sala de estudio grupal", x: 1660, y: 480,
        kind: "goal", order_index: 2,
        info_text: "Las salas grupales se reservan en línea desde el sistema." }
    ]
  },
  {
    code: "BE-01", badge_key: "insignia_bienestar",
    name: "Bienestar Estudiantil", zone: "Bienestar Estudiantil",
    world: "Zona Central", order_index: 3, difficulty: "media", required_score: 60,
    description: "Ubica las oficinas de Bienestar Estudiantil y conoce los " \
                 "servicios de becas y apoyo psicológico.",
    width: 1800, height: 720, gravity_y: 900,
    spawn_x: 64, spawn_y: 540, background_key: "bienestar_day",
    platforms: [
      { x: 0, y: 660, width: 700, height: 40, kind: "solid" },
      { x: 880, y: 660, width: 920, height: 40, kind: "solid" },
      { x: 1300, y: 648, width: 90, height: 12, kind: "hazard" },
      { x: 420, y: 530, width: 180, height: 24, kind: "solid" },
      { x: 700, y: 420, width: 160, height: 24, kind: "moving" },
      { x: 980, y: 540, width: 180, height: 24, kind: "solid" },
      { x: 1500, y: 520, width: 200, height: 24, kind: "solid" }
    ],
    checkpoints: [
      { code: "BE-01-CP1", name: "Oficina de Becas", x: 1060, y: 500,
        kind: "mission", order_index: 1,
        info_text: "Las becas socioeconómicas se solicitan al inicio de cada término." },
      { code: "BE-01-CP2", name: "Consejería estudiantil", x: 1600, y: 480,
        kind: "goal", order_index: 2,
        info_text: "Atención psicológica gratuita con cita previa." }
    ]
  }
].freeze

MISSIONS = [
  {
    code: "M-FIEC-01", level_code: "FIEC-01", checkpoint_code: "FIEC-01-CP2",
    title: "¿Qué se estudia en FIEC?",
    description: "Responde la trivia del Laboratorio de Redes para avanzar.",
    kind: "trivia", badge_key: "insignia_fiec", order_index: 1,
    questions: [
      { statement: "¿Qué significan las siglas FIEC?",
        options: ["Facultad de Ingeniería en Electricidad y Computación",
                  "Facultad de Investigación en Energía y Ciencias",
                  "Facultad de Ingeniería Electrónica y Civil",
                  "Facultad de Informática, Electricidad y Comunicación"],
        correct_option: 0, points: 10, order_index: 1,
        feedback_ok: "¡Correcto! FIEC agrupa las carreras de electricidad, " \
                     "electrónica, telemática y computación.",
        feedback_fail: "Incorrecto. FIEC es la Facultad de Ingeniería en " \
                       "Electricidad y Computación." },
      { statement: "¿En qué zona del campus Gustavo Galindo se ubica FIEC?",
        options: ["Zona Sur", "Zona Norte", "Fuera del campus", "Zona Peñas"],
        correct_option: 1, points: 10, order_index: 2,
        feedback_ok: "¡Bien! FIEC está en la zona norte del campus Prosperina.",
        feedback_fail: "No es correcto. FIEC se ubica en la zona norte." }
    ]
  },
  {
    code: "M-BIB-01", level_code: "BIB-01", checkpoint_code: "BIB-01-CP1",
    title: "Normativa de la Biblioteca Central",
    description: "Demuestra que conoces las reglas de préstamo de libros.",
    kind: "trivia", badge_key: "insignia_lector", order_index: 1,
    questions: [
      { statement: "¿Cuántos libros puede prestarse un estudiante a la vez?",
        options: %w[1 3 5 Ilimitados],
        correct_option: 1, points: 15, order_index: 1,
        feedback_ok: "¡Correcto! Son hasta 3 libros por estudiante.",
        feedback_fail: "Incorrecto. El límite es de 3 libros por estudiante." },
      { statement: "¿Cómo se reserva una sala de estudio grupal?",
        options: ["Presencialmente en el counter", "Por correo al decano",
                  "En línea desde el sistema de la biblioteca", "No se pueden reservar"],
        correct_option: 2, points: 15, order_index: 2,
        feedback_ok: "¡Exacto! La reserva es en línea.",
        feedback_fail: "Incorrecto. Las salas se reservan en línea." }
    ]
  },
  {
    code: "M-BE-01", level_code: "BE-01", checkpoint_code: "BE-01-CP1",
    title: "Servicios de Bienestar Estudiantil",
    description: "Identifica los apoyos que ofrece Bienestar Estudiantil.",
    kind: "trivia", badge_key: "insignia_bienestar", order_index: 1,
    questions: [
      { statement: "¿Qué servicio NO ofrece Bienestar Estudiantil?",
        options: ["Becas socioeconómicas", "Atención psicológica",
                  "Venta de libros de texto", "Consejería estudiantil"],
        correct_option: 2, points: 20, order_index: 1,
        feedback_ok: "¡Correcto! La venta de libros no es un servicio de Bienestar.",
        feedback_fail: "Incorrecto. Bienestar sí ofrece becas, atención " \
                       "psicológica y consejería." }
    ]
  }
].freeze

# Partidas de demostracion para que el ranking tenga datos visibles.
DEMO_PROGRESS = [
  { nickname: "kevin_g", level_code: "FIEC-01", score: 20,
    completed: true, checkpoints: %w[FIEC-01-CP1 FIEC-01-CP2 FIEC-01-CP3],
    badges: %w[insignia_fiec insignia_novato] },
  { nickname: "jorge_dc", level_code: "FIEC-01", score: 10,
    completed: false, checkpoints: %w[FIEC-01-CP1 FIEC-01-CP2],
    badges: %w[insignia_novato] },
  { nickname: "novato01", level_code: "FIEC-01", score: 20,
    completed: true, checkpoints: %w[FIEC-01-CP1 FIEC-01-CP2 FIEC-01-CP3],
    badges: %w[insignia_fiec insignia_novato] },
  { nickname: "novato01", level_code: "BIB-01", score: 30,
    completed: true, checkpoints: %w[BIB-01-CP1 BIB-01-CP2],
    badges: %w[insignia_lector] }
].freeze

BADGES.each { |attrs| Badge.find_or_initialize_by(key: attrs[:key]).update!(attrs) }

PLAYERS.each do |attrs|
  Player.find_or_initialize_by(nickname: attrs[:nickname]).update!(attrs)
end

LEVELS.each do |raw|
  attrs = raw.except(:platforms, :checkpoints, :badge_key)
  level = Level.find_or_initialize_by(code: attrs[:code])
  level.update!(attrs.merge(badge: Badge.find_by(key: raw[:badge_key])))

  raw[:platforms].each do |platform|
    level.platforms.find_or_initialize_by(x: platform[:x], y: platform[:y])
         .update!(platform.merge(level: level))
  end

  raw[:checkpoints].each do |checkpoint|
    level.checkpoints.find_or_initialize_by(code: checkpoint[:code])
         .update!(checkpoint.merge(level: level))
  end
end

MISSIONS.each do |raw|
  attrs = raw.except(:level_code, :checkpoint_code, :badge_key, :questions)
  mission = Mission.find_or_initialize_by(code: attrs[:code])
  mission.update!(
    attrs.merge(
      level: Level.find_by!(code: raw[:level_code]),
      checkpoint: Checkpoint.find_by(code: raw[:checkpoint_code]),
      badge: Badge.find_by(key: raw[:badge_key])
    )
  )

  raw[:questions].each do |question|
    mission.questions.find_or_initialize_by(order_index: question[:order_index])
           .update!(question.merge(mission: mission))
  end
end

DEMO_PROGRESS.each do |raw|
  player = Player.find_by!(nickname: raw[:nickname])
  level = Level.find_by!(code: raw[:level_code])

  player.register_level_result(
    level: level, score: raw[:score],
    completed: raw[:completed], badge_keys: raw[:badges]
  )

  progress = player.level_progresses.find_by!(level: level)
  progress.reach(raw[:checkpoints])
  progress.save!
end

puts "Insignias: #{Badge.count} | Jugadores: #{Player.count} | Niveles: #{Level.count} | " \
     "Misiones: #{Mission.count} | Preguntas: #{Question.count} | " \
     "Progresos: #{LevelProgress.count}"
