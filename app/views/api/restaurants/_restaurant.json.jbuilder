json.set! restaurant.url_id do
    json.extract! restaurant, 
        :id, :url_id, :name, :bio, :address, :phone_number, :price_range, 
        :owner_id, :neighborhood_id, :cuisine_id
    
    json.image_url rails_blob_path(restaurant.photo)

    json.available_tables do
        json.array! restaurant.available_tables.map { |available_table| available_table.id }
    end
end
