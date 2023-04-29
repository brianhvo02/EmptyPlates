restaurants.each do |restaurant|
    json.restaurants do
        json.partial! "api/restaurants/restaurant", restaurant: restaurant
    end

    json.neighborhoods do
        json.partial! "api/neighborhoods/neighborhood", neighborhood: restaurant.neighborhood
    end

    json.cuisines do
        json.partial! "api/cuisines/cuisine", cuisine: restaurant.cuisine
    end
end