json.set! user.id do
    json.extract! user, 
        :id, :email, :phone_number, 
        :display_name, :first_name, :last_name, 
        :is_owner, :neighborhood_id, :created_at
        
    json.restaurants do
        json.array! user.restaurants.map { |restaurant| restaurant.url_id }
    end

    json.reservations do
        json.array! user.reservations.map { |reservation| reservation.id }
    end
end