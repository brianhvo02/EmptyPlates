class Reservation < ApplicationRecord
    validates :datetime, presence: true
    validates :datetime, comparison: { greater_than: DateTime.now }
    validate :reservation_limit

    belongs_to :diner,
       class_name: :User

    belongs_to :available_table

    delegate :restaurant, to: :available_table

    has_many :reviews

    def reservation_limit
        errors.add(:available_table, " no longer available") if available_table.reservations
            .where(datetime: Time.at(datetime - 1.hour) ... Time.at(datetime + 1.hour))
            .count >= available_table.tables
    end
end
