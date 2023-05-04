class Review < ApplicationRecord
    validates :overall, :food, :service, :ambience, presence: true, numericality: {
        only_integer: true,
        greater_than: 0,
        less_than_or_equal_to: 5
    }
  
    belongs_to :reservation
end
