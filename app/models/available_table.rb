class AvailableTable < ApplicationRecord
    validates :seats, :tables, presence: true
    validates :seats, comparison: { greater_than: 0 }
    validates :tables, comparison: { greater_than: 0 }
    validates :restaurant_id, uniqueness: { scope: :seats }

    belongs_to :restaurant
    has_many :reservations,
        dependent: :destroy
end