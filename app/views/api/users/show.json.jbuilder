json.extract! @user, 
    :id, :email, :phone_number, 
    :display_name, :first_name, :last_name, 
    :is_owner
json.neighborhood do
    json.extract! @user.neighborhood, :id, :name, :latitude, :longitude
end
json.restaurants do
    @user.restaurants.each do |restaurant|
        json.set! restaurant.url_id do
            @restaurant = restaurant
            json.partial! 'api/restaurants/restaurant'
        end
    end
end