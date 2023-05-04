class CreateReviews < ActiveRecord::Migration[7.0]
  def change
    create_table :reviews do |t|
      t.integer :overall, null: false
      t.integer :food, null: false
      t.integer :service, null: false
      t.integer :ambience, null: false
      t.text :review
      t.references :reservation, null: false, foreign_key: true

      t.timestamps
    end
  end
end
