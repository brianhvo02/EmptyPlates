class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :email, null: false
      t.string :phone_number, null: false
      t.string :display_name
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :password_digest
      t.string :session_token, null: false
      t.boolean :is_owner, null: false
      t.references :neighborhood, null: false, foreign_key: true

      t.timestamps
    end
    add_index :users, :email, unique: true
    add_index :users, :phone_number, unique: true
    add_index :users, :session_token, unique: true
  end
end
