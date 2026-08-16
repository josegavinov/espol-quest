# Datos de demostracion de ESPOL Quest.
# Uso: bin/rails db:seed  (es idempotente, se puede correr varias veces)
#
# Fuente unica de insignias, jugadores, niveles y misiones: antes cada servicio
# tenia su propia copia y las claves se repetian escritas a mano.

BADGES = [
  { key: "insignia_fiec",      name: "Explorador FIEC",
    description: "Completaste la trivia del Bloque FIEC.", icon: "chip" },
  { key: "insignia_lector",    name: "Lector Politecnico",
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
    code: "FIEC-01", name: "Bloque FIEC: Laboratorios", zone: "FIEC",
    world: "Zona Norte", order_index: 1, difficulty: "facil", required_score: 0,
    description: "Recorre los laboratorios de la Facultad de Ingenieria en " \
                 "Electricidad y Computacion y ubica sus servicios.",
    width: 2400, height: 720, gravity_y: 900,
    spawn_x: 64, spawn_y: 520, background_key: "fiec_day",
    platforms: [
      { x: 0, y: 660, width: 900, height: 40, kind: "solid" },
      { x: 980, y: 660, width: 700, height: 40, kind: "solid" },
      { x: 1760, y: 660, width: 640, height: 40, kind: "solid" },
      { x: 420, y: 520, width: 180, height: 24, kind: "solid", texture_key: "tile_metal" },
      { x: 760, y: 430, width: 160, height: 24, kind: "moving", texture_key: "tile_metal" },
      { x: 1320, y: 500, width: 200, height: 24, kind: "solid" },
      { x: 900, y: 690, width: 80, height: 10, kind: "hazard", texture_key: "tile_agua" }
    ],
    checkpoints: [
      { code: "FIEC-01-CP1", name: "Entrada del Bloque A", x: 260, y: 600,
        kind: "info", order_index: 1,
        info_text: "El Bloque A concentra las aulas de primer ano de FIEC." },
      { code: "FIEC-01-CP2", name: "Laboratorio de Redes", x: 1180, y: 600,
        kind: "mission", order_index: 2,
        info_text: "Aqui se dictan las practicas de Redes de Datos." },
      { code: "FIEC-01-CP3", name: "Secretaria FIEC", x: 2080, y: 600,
        kind: "goal", order_index: 3,
        info_text: "Tramites academicos: registro, cambios de paralelo y retiros." }
    ]
  },
  {
    code: "BIB-01", name: "Biblioteca Central", zone: "Biblioteca",
    world: "Zona Central", order_index: 2, difficulty: "media", required_score: 30,
    description: "Explora la Biblioteca Central, sus salas de estudio y el " \
                 "servicio de prestamo de libros.",
    width: 2000, height: 720, gravity_y: 900,
    spawn_x: 80, spawn_y: 540, background_key: "biblioteca_day",
    platforms: [
      { x: 0, y: 660, width: 1200, height: 40, kind: "solid" },
      { x: 1300, y: 660, width: 700, height: 40, kind: "solid" },
      { x: 380, y: 540, width: 220, height: 24, kind: "solid" },
      { x: 820, y: 440, width: 200, height: 24, kind: "solid" },
      { x: 1200, y: 690, width: 100, height: 10, kind: "hazard" }
    ],
    checkpoints: [
      { code: "BIB-01-CP1", name: "Counter de prestamos", x: 300, y: 600,
        kind: "mission", order_index: 1,
        info_text: "Se prestan hasta 3 libros por estudiante durante 7 dias." },
      { code: "BIB-01-CP2", name: "Sala de estudio grupal", x: 1520, y: 600,
        kind: "goal", order_index: 2,
        info_text: "Las salas grupales se reservan en linea desde el sistema." }
    ]
  },
  {
    code: "BE-01", name: "Bienestar Estudiantil", zone: "Bienestar Estudiantil",
    world: "Zona Central", order_index: 3, difficulty: "media", required_score: 60,
    description: "Ubica las oficinas de Bienestar Estudiantil y conoce los " \
                 "servicios de becas y apoyo psicologico.",
    width: 1800, height: 720, gravity_y: 900,
    spawn_x: 64, spawn_y: 540, background_key: "bienestar_day",
    platforms: [
      { x: 0, y: 660, width: 1800, height: 40, kind: "solid" },
      { x: 500, y: 520, width: 200, height: 24, kind: "solid" },
      { x: 1000, y: 430, width: 180, height: 24, kind: "moving" }
    ],
    checkpoints: [
      { code: "BE-01-CP1", name: "Oficina de Becas", x: 640, y: 600,
        kind: "mission", order_index: 1,
        info_text: "Las becas socioeconomicas se solicitan al inicio de cada termino." },
      { code: "BE-01-CP2", name: "Consejeria estudiantil", x: 1450, y: 600,
        kind: "goal", order_index: 2,
        info_text: "Atencion psicologica gratuita con cita previa." }
    ]
  }
].freeze

MISSIONS = [
  {
    code: "M-FIEC-01", level_code: "FIEC-01", checkpoint_code: "FIEC-01-CP2",
    title: "Que se estudia en FIEC?",
    description: "Responde la trivia del Laboratorio de Redes para avanzar.",
    kind: "trivia", badge_key: "insignia_fiec", order_index: 1,
    questions: [
      { statement: "Que significan las siglas FIEC?",
        options: ["Facultad de Ingenieria en Electricidad y Computacion",
                  "Facultad de Investigacion en Energia y Ciencias",
                  "Facultad de Ingenieria Electronica y Civil",
                  "Facultad de Informatica, Electricidad y Comunicacion"],
        correct_option: 0, points: 10, order_index: 1,
        feedback_ok: "Correcto! FIEC agrupa las carreras de electricidad, " \
                     "electronica, telematica y computacion.",
        feedback_fail: "Incorrecto. FIEC es la Facultad de Ingenieria en " \
                       "Electricidad y Computacion." },
      { statement: "En que zona del campus Gustavo Galindo se ubica FIEC?",
        options: ["Zona Sur", "Zona Norte", "Fuera del campus", "Zona Penas"],
        correct_option: 1, points: 10, order_index: 2,
        feedback_ok: "Bien! FIEC esta en la zona norte del campus Prosperina.",
        feedback_fail: "No es correcto. FIEC se ubica en la zona norte." }
    ]
  },
  {
    code: "M-BIB-01", level_code: "BIB-01", checkpoint_code: "BIB-01-CP1",
    title: "Normativa de la Biblioteca Central",
    description: "Demuestra que conoces las reglas de prestamo de libros.",
    kind: "trivia", badge_key: "insignia_lector", order_index: 1,
    questions: [
      { statement: "Cuantos libros puede prestarse un estudiante a la vez?",
        options: %w[1 3 5 Ilimitados],
        correct_option: 1, points: 15, order_index: 1,
        feedback_ok: "Correcto! Son hasta 3 libros por estudiante.",
        feedback_fail: "Incorrecto. El limite es de 3 libros por estudiante." },
      { statement: "Como se reserva una sala de estudio grupal?",
        options: ["Presencialmente en el counter", "Por correo al decano",
                  "En linea desde el sistema de la biblioteca", "No se pueden reservar"],
        correct_option: 2, points: 15, order_index: 2,
        feedback_ok: "Exacto! La reserva es en linea.",
        feedback_fail: "Incorrecto. Las salas se reservan en linea." }
    ]
  },
  {
    code: "M-BE-01", level_code: "BE-01", checkpoint_code: "BE-01-CP1",
    title: "Servicios de Bienestar Estudiantil",
    description: "Identifica los apoyos que ofrece Bienestar Estudiantil.",
    kind: "trivia", badge_key: "insignia_bienestar", order_index: 1,
    questions: [
      { statement: "Que servicio NO ofrece Bienestar Estudiantil?",
        options: ["Becas socioeconomicas", "Atencion psicologica",
                  "Venta de libros de texto", "Consejeria estudiantil"],
        correct_option: 2, points: 20, order_index: 1,
        feedback_ok: "Correcto! La venta de libros no es un servicio de Bienestar.",
        feedback_fail: "Incorrecto. Bienestar si ofrece becas, atencion " \
                       "psicologica y consejeria." }
    ]
  }
].freeze

# Partidas de demostracion para que el ranking tenga datos visibles.
DEMO_PROGRESS = [
  { nickname: "kevin_g", level_code: "FIEC-01", score: 20, missions_completed: 1,
    completed: true, checkpoints: %w[FIEC-01-CP1 FIEC-01-CP2 FIEC-01-CP3],
    badges: %w[insignia_fiec insignia_novato] },
  { nickname: "jorge_dc", level_code: "FIEC-01", score: 10, missions_completed: 0,
    completed: false, checkpoints: %w[FIEC-01-CP1 FIEC-01-CP2],
    badges: %w[insignia_novato] },
  { nickname: "novato01", level_code: "FIEC-01", score: 20, missions_completed: 1,
    completed: true, checkpoints: %w[FIEC-01-CP1 FIEC-01-CP2 FIEC-01-CP3],
    badges: %w[insignia_fiec insignia_novato] },
  { nickname: "novato01", level_code: "BIB-01", score: 30, missions_completed: 1,
    completed: true, checkpoints: %w[BIB-01-CP1 BIB-01-CP2],
    badges: %w[insignia_lector] }
].freeze

BADGES.each { |attrs| Badge.find_or_initialize_by(key: attrs[:key]).update!(attrs) }

PLAYERS.each do |attrs|
  Player.find_or_initialize_by(nickname: attrs[:nickname]).update!(attrs)
end

LEVELS.each do |raw|
  attrs = raw.except(:platforms, :checkpoints)
  level = Level.find_or_initialize_by(code: attrs[:code])
  level.update!(attrs)

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
    level: level, score: raw[:score], missions_completed: raw[:missions_completed],
    completed: raw[:completed], badge_keys: raw[:badges]
  )

  progress = player.level_progresses.find_by!(level: level)
  progress.reach(raw[:checkpoints])
  progress.save!
end

puts "Insignias: #{Badge.count} | Jugadores: #{Player.count} | Niveles: #{Level.count} | " \
     "Misiones: #{Mission.count} | Preguntas: #{Question.count} | " \
     "Progresos: #{LevelProgress.count}"
