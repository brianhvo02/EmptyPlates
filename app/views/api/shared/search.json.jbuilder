@restaurants.each do |restaurant|
    json.restaurants do
        json.partial! "api/restaurants/restaurant", restaurant: restaurant
    end
end

@neighborhoods.each do |neighborhood|
    json.neighborhoods do
        json.partial! "api/neighborhoods/neighborhood", neighborhood: neighborhood
    end
end

@cuisines.each do |cuisine|
    json.cuisines do
        json.partial! "api/cuisines/cuisine", cuisine: cuisine
    end
end