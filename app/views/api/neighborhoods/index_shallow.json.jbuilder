@neighborhoods.each do |neighborhood|
    json.neighborhoods do
        json.partial! "api/neighborhoods/neighborhood", neighborhood: neighborhood
    end

    neighborhood.restaurants.each do |restaurant|
        json.restaurants do
            json.partial! "api/restaurants/restaurant", restaurant: restaurant
        end

        json.cuisines do
            json.partial! "api/cuisines/cuisine", cuisine: restaurant.cuisine
        end
    end
end