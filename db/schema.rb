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

ActiveRecord::Schema[7.0].define(version: 2023_04_18_175545) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "cuisines", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "neighborhoods", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_neighborhoods_on_name", unique: true
  end

  create_table "restaurants", force: :cascade do |t|
    t.string "url_id", null: false
    t.string "name", null: false
    t.text "bio", null: false
    t.string "address", null: false
    t.string "phone_number", null: false
    t.integer "price_range", null: false
    t.bigint "neighborhood_id", null: false
    t.bigint "cuisine_id", null: false
    t.bigint "owner_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cuisine_id"], name: "index_restaurants_on_cuisine_id"
    t.index ["name"], name: "index_restaurants_on_name"
    t.index ["neighborhood_id"], name: "index_restaurants_on_neighborhood_id"
    t.index ["owner_id"], name: "index_restaurants_on_owner_id"
    t.index ["price_range"], name: "index_restaurants_on_price_range"
    t.index ["url_id"], name: "index_restaurants_on_url_id", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "phone_number", null: false
    t.string "display_name"
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "password_digest"
    t.string "session_token", null: false
    t.boolean "is_owner", null: false
    t.bigint "neighborhood_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["neighborhood_id"], name: "index_users_on_neighborhood_id"
    t.index ["phone_number"], name: "index_users_on_phone_number", unique: true
    t.index ["session_token"], name: "index_users_on_session_token", unique: true
  end

  add_foreign_key "restaurants", "cuisines"
  add_foreign_key "restaurants", "neighborhoods"
  add_foreign_key "restaurants", "users", column: "owner_id"
  add_foreign_key "users", "neighborhoods"
end
