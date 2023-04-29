class Restaurant < ApplicationRecord
  validates :url_id, :name, :bio, :address, :phone_number, :price_range, 
    presence: true
  validates :price_range, comparison: { greater_than: 0, less_than: 5 }
  validates :url_id, uniqueness: true
  validates :photo, attached: true

  belongs_to :neighborhood
  belongs_to :cuisine
  belongs_to :owner,
    class_name: :User

  has_one_attached :photo
end
