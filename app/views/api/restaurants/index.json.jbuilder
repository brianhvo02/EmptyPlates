json.restaurants do
    @restaurants.each do |restaurant|
        json.set! restaurant.url_id do
            @restaurant = restaurant
            json.partial! 'api/restaurants/restaurant'
        end
    end
end