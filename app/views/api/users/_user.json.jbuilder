json.set! user.id do
    json.extract! user, 
        :id, :email, :phone_number, 
        :display_name, :first_name, :last_name, 
        :is_owner, :neighborhood_id
        
    json.restaurants do
        json.array! user.restaurants.map { |restaurant| restaurant.url_id }
    end
end