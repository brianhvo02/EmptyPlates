json.extract! @restaurant, 
    :id, :url_id, :name, :bio, :address, :phone_number, :price_range, :owner_id

json.neighborhood do
    json.extract! @restaurant.neighborhood, :id, :name, :latitude, :longitude
end
json.cuisine do
    json.extract! @restaurant.cuisine, :id, :name
end
json.image_url rails_blob_path(@restaurant.photo)