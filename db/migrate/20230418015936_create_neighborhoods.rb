class CreateNeighborhoods < ActiveRecord::Migration[7.0]
  def change
    create_table :neighborhoods do |t|
      t.string :name

      t.timestamps
    end
    add_index :neighborhoods, :name, unique: true
  end
end
