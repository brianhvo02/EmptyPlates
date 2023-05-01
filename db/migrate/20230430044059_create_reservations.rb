class CreateReservations < ActiveRecord::Migration[7.0]
  def change
    create_table :reservations do |t|
      t.datetime :datetime, null: false
      t.references :diner, null: false, foreign_key: { to_table: :users }
      t.references :available_table, null: false, foreign_key: true

      t.timestamps
    end
  end
end
