# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2026_08_17_093412) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "badges", force: :cascade do |t|
    t.string "key", null: false
    t.string "name", null: false
    t.string "description", default: "", null: false
    t.string "icon", default: "medalla", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["key"], name: "index_badges_on_key", unique: true
  end

  create_table "checkpoints", force: :cascade do |t|
    t.bigint "level_id", null: false
    t.string "code", null: false
    t.string "name", null: false
    t.integer "x", null: false
    t.integer "y", null: false
    t.string "kind", default: "info", null: false
    t.text "info_text", default: "", null: false
    t.integer "order_index", default: 1, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_checkpoints_on_code", unique: true
    t.index ["level_id"], name: "index_checkpoints_on_level_id"
  end

  create_table "level_progresses", force: :cascade do |t|
    t.bigint "player_id", null: false
    t.integer "score", default: 0, null: false
    t.boolean "completed", default: false, null: false
    t.integer "missions_completed", default: 0, null: false
    t.datetime "completed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "level_id", null: false
    t.integer "avatar_x", default: 0, null: false
    t.integer "avatar_y", default: 0, null: false
    t.integer "lives", default: 3, null: false
    t.integer "elapsed_seconds", default: 0, null: false
    t.json "checkpoints_reached", default: [], null: false
    t.integer "mission_score", default: 0, null: false
    t.index ["level_id"], name: "index_level_progresses_on_level_id"
    t.index ["player_id", "level_id"], name: "index_level_progresses_on_player_id_and_level_id", unique: true
    t.index ["player_id"], name: "index_level_progresses_on_player_id"
  end

  create_table "levels", force: :cascade do |t|
    t.string "code", null: false
    t.string "name", null: false
    t.string "zone", null: false
    t.string "world", null: false
    t.integer "order_index", default: 1, null: false
    t.text "description", default: "", null: false
    t.string "difficulty", default: "facil", null: false
    t.integer "required_score", default: 0, null: false
    t.boolean "active", default: true, null: false
    t.integer "width", default: 2400, null: false
    t.integer "height", default: 720, null: false
    t.integer "gravity_y", default: 900, null: false
    t.integer "spawn_x", default: 64, null: false
    t.integer "spawn_y", default: 520, null: false
    t.string "background_key", default: "campus_day", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "badge_id"
    t.index ["badge_id"], name: "index_levels_on_badge_id"
    t.index ["code"], name: "index_levels_on_code", unique: true
  end

  create_table "mission_answers", force: :cascade do |t|
    t.bigint "player_id", null: false
    t.bigint "mission_id", null: false
    t.bigint "question_id", null: false
    t.integer "selected_option", null: false
    t.boolean "correct", default: false, null: false
    t.integer "points_awarded", default: 0, null: false
    t.integer "attempt", default: 1, null: false
    t.datetime "answered_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["mission_id"], name: "index_mission_answers_on_mission_id"
    t.index ["player_id", "question_id"], name: "index_mission_answers_on_player_id_and_question_id"
    t.index ["player_id"], name: "index_mission_answers_on_player_id"
    t.index ["question_id"], name: "index_mission_answers_on_question_id"
  end

  create_table "missions", force: :cascade do |t|
    t.string "code", null: false
    t.bigint "level_id", null: false
    t.bigint "checkpoint_id"
    t.bigint "badge_id"
    t.string "title", null: false
    t.text "description", default: "", null: false
    t.string "kind", default: "trivia", null: false
    t.integer "order_index", default: 1, null: false
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["badge_id"], name: "index_missions_on_badge_id"
    t.index ["checkpoint_id"], name: "index_missions_on_checkpoint_id"
    t.index ["code"], name: "index_missions_on_code", unique: true
    t.index ["level_id"], name: "index_missions_on_level_id"
  end

  create_table "platforms", force: :cascade do |t|
    t.bigint "level_id", null: false
    t.integer "x", null: false
    t.integer "y", null: false
    t.integer "width", null: false
    t.integer "height", default: 32, null: false
    t.string "kind", default: "solid", null: false
    t.string "texture_key", default: "tile_concreto", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["level_id"], name: "index_platforms_on_level_id"
  end

  create_table "player_badges", force: :cascade do |t|
    t.bigint "player_id", null: false
    t.bigint "badge_id", null: false
    t.datetime "awarded_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["badge_id"], name: "index_player_badges_on_badge_id"
    t.index ["player_id", "badge_id"], name: "index_player_badges_on_player_id_and_badge_id", unique: true
    t.index ["player_id"], name: "index_player_badges_on_player_id"
  end

  create_table "players", force: :cascade do |t|
    t.string "nickname", null: false
    t.string "facultad", null: false
    t.integer "total_score", default: 0, null: false
    t.integer "levels_completed", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "email"
    t.integer "badges_count", default: 0, null: false
    t.index ["email"], name: "index_players_on_email", unique: true
    t.index ["facultad"], name: "index_players_on_facultad"
    t.index ["nickname"], name: "index_players_on_nickname", unique: true
  end

  create_table "questions", force: :cascade do |t|
    t.bigint "mission_id", null: false
    t.text "statement", null: false
    t.json "options", default: [], null: false
    t.integer "correct_option", null: false
    t.integer "points", default: 10, null: false
    t.text "feedback_ok", default: "¡Correcto!", null: false
    t.text "feedback_fail", default: "Respuesta incorrecta.", null: false
    t.integer "order_index", default: 1, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["mission_id"], name: "index_questions_on_mission_id"
  end

  add_foreign_key "checkpoints", "levels"
  add_foreign_key "level_progresses", "levels"
  add_foreign_key "level_progresses", "players"
  add_foreign_key "levels", "badges"
  add_foreign_key "mission_answers", "missions"
  add_foreign_key "mission_answers", "players"
  add_foreign_key "mission_answers", "questions"
  add_foreign_key "missions", "badges"
  add_foreign_key "missions", "checkpoints"
  add_foreign_key "missions", "levels"
  add_foreign_key "platforms", "levels"
  add_foreign_key "player_badges", "badges"
  add_foreign_key "player_badges", "players"
  add_foreign_key "questions", "missions"
end
