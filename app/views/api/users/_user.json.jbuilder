json.set! user.id do
    json.extract! user, 
        :id, :email, :phone_number, 
        :display_name, :first_name, :last_name, 
        :is_owner, :neighborhood_id, :created_at
        
    json.restaurants user.restaurants.pluck :url_id
    json.reservations user.reservations.pluck :id
    json.reviews user.reviews.pluck :id
end