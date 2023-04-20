class CreateRestaurants < ActiveRecord::Migration[7.0]
  def change
    create_table :restaurants do |t|
      t.string :url_id, null: false
      t.string :name, null: false
      t.text :bio, null: false
      t.string :address, null: false
      t.string :phone_number, null: false
      t.integer :price_range, null: false
      t.references :neighborhood, null: false, foreign_key: true
      t.references :cuisine, null: false, foreign_key: true
      t.references :owner, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end
    add_index :restaurants, :url_id, unique: true
    add_index :restaurants, :name
    add_index :restaurants, :price_range
  end
end
