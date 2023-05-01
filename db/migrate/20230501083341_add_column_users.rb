class AddColumnUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :is_guest, :boolean, null: false
  end
end
