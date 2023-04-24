class CreateNeighborhoods < ActiveRecord::Migration[7.0]
  def change
    create_table :neighborhoods do |t|
      t.string :name, null: false
      t.float :latitude, null: false
      t.float :longitude, null: false

      t.timestamps
    end
    add_index :neighborhoods, :name, unique: true
    add_index :neighborhoods, [:latitude, :longitude], unique: true
  end
end
