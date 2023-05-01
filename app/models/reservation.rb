class Reservation < ApplicationRecord
    validates :datetime, :seats, :limit, presence: true
    validates :datetime, comparison: { greater_than: DateTime.now }
    validates_associated :available_table, message: "no more tables"

    belongs_to :diner,
       class_name: :User

    belongs_to :available_table

    delegate :restaurant, to: :available_table
end
