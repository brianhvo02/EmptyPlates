class CreateAvailableTables < ActiveRecord::Migration[7.0]
  def change
    create_table :available_tables do |t|
      t.integer :seats, null: false
      t.integer :tables, null: false
      t.references :restaurant, null: false, foreign_key: true

      t.index [:seats, :tables, :restaurant_id], unique: true

      t.timestamps
    end
  end
end
