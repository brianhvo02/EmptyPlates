json.set! user.id do
    json.extract! user, 
        :id, :email, :phone_number, 
        :display_name, :first_name, :last_name, 
        :is_owner, :neighborhood_id
        
    json.restaurants do
        json.array! user.restaurants.map { |restaurant| restaurant.url_id }
    end

    json.reservations do
        user.reservations.each do |reservation|
            json.set! reservation.id do
                json.extract! reservation, :available_table_id
                json.datetime reservation.datetime.to_i
            end
        end
    end
end