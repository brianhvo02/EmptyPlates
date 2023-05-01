json.set! restaurant.url_id do
    json.extract! restaurant, 
        :id, :url_id, :name, :bio, :address, :phone_number, :price_range, 
        :owner_id, :neighborhood_id, :cuisine_id
    
    json.image_url rails_blob_path(restaurant.photo)

    json.available_tables do
        restaurant.available_tables.each do |available_table|
            json.set! available_table.seats do
                json.extract! available_table, :id, :seats, :tables
            end
        end
    end

    json.reservations do
        restaurant.reservations.each do |reservation|
            json.set! reservation.id do
                json.extract! reservation, :available_table_id
                json.datetime reservation.datetime.to_i
            end
        end
    end
end
