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

ActiveRecord::Schema[7.1].define(version: 2026_08_11_120300) do
  create_table "badges", force: :cascade do |t|
    t.string "key", null: false
    t.string "name", null: false
    t.string "description", default: "", null: false
    t.string "icon", default: "medalla", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["key"], name: "index_badges_on_key", unique: true
  end

  create_table "level_progresses", force: :cascade do |t|
    t.integer "profile_id", null: false
    t.string "level_code", null: false
    t.integer "score", default: 0, null: false
    t.decimal "exploration_pct", precision: 5, scale: 2, default: "0.0", null: false
    t.boolean "completed", default: false, null: false
    t.integer "missions_completed", default: 0, null: false
    t.datetime "completed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["profile_id", "level_code"], name: "index_level_progresses_on_profile_id_and_level_code", unique: true
    t.index ["profile_id"], name: "index_level_progresses_on_profile_id"
  end

  create_table "profile_badges", force: :cascade do |t|
    t.integer "profile_id", null: false
    t.integer "badge_id", null: false
    t.datetime "awarded_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["badge_id"], name: "index_profile_badges_on_badge_id"
    t.index ["profile_id", "badge_id"], name: "index_profile_badges_on_profile_id_and_badge_id", unique: true
    t.index ["profile_id"], name: "index_profile_badges_on_profile_id"
  end

  create_table "profiles", force: :cascade do |t|
    t.integer "external_player_id", null: false
    t.string "nickname", null: false
    t.string "facultad", null: false
    t.integer "total_score", default: 0, null: false
    t.integer "levels_completed", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["external_player_id"], name: "index_profiles_on_external_player_id", unique: true
    t.index ["facultad"], name: "index_profiles_on_facultad"
  end

  add_foreign_key "level_progresses", "profiles"
  add_foreign_key "profile_badges", "badges"
  add_foreign_key "profile_badges", "profiles"
end
