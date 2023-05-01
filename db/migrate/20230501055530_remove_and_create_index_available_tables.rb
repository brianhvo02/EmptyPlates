class RemoveAndCreateIndexAvailableTables < ActiveRecord::Migration[7.0]
  def change
    remove_index :available_tables, name: "index_available_tables_on_seats_and_tables_and_restaurant_id"
    add_index :available_tables, :seats
  end
end
