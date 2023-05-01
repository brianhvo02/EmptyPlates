class AvailableTable < ApplicationRecord
    validates :seats, :tables, presence: true
    validates :seats, comparison: { greater_than: 0 }
    validates :tables, comparison: { greater_than: 0 }
    validates :restaurant_id, uniqueness: { scope: [:seats, :tables] }
    
    validate :within_limit

    belongs_to :restaurant
    has_many :reservations,
        dependent: :destroy

    def within_limit
        errors.add(:reservations, "no more tables") if reservations.size >= tables
    end
end