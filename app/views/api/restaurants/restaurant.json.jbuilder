json.extract! @restaurant, 
    :id, :url_id, 
    :name, :bio, :address, :phone_number, :owner_id

price_range = []
@restaurant.price_range.times { price_range << "$" }
json.price_range price_range.join("");

json.neighborhood @restaurant.neighborhood.name
json.cuisine @restaurant.cuisine.name
json.image_url rails_blob_path(@restaurant.photo)