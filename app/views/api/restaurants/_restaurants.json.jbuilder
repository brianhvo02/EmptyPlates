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

    json.users do
        json.partial! "api/users/user", user: restaurant.owner
    end

    json.partial! "api/available_tables/available_tables", available_tables: restaurant.available_tables
    
    json.partial! "api/reservations/reservations", reservations: restaurant.reservations

    json.partial! "api/reviews/reviews", reviews: restaurant.reviews
end