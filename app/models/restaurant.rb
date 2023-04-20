class Restaurant < ApplicationRecord
  validates :url_id, :name, :bio, :address, :phone_number, :price_range, 
    presence: true
  validates :url_id, uniqueness: true

  belongs_to :neighborhood
  belongs_to :cuisine
  belongs_to :owner,
    class_name: :User
end
