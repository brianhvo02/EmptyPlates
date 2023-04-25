json.restaurants do
    @restaurants.each do |restaurant|
        json.set! restaurant.url_id do
            json.extract! restaurant, :id, :url_id, 
                :name, :bio, :address, :phone_number, :price_range, :owner_id
            
            json.neighborhood restaurant.neighborhood.name
            json.cuisine restaurant.cuisine.name
            json.image_url rails_blob_path(restaurant.photo)
        end
    end
end