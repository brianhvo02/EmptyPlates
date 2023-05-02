users.each do |user|
    json.users do
        json.partial! "api/users/user", user: user
    end

    json.neighborhoods do
        json.partial! "api/neighborhoods/neighborhood", neighborhood: user.neighborhood
    end

    json.partial! "api/restaurants/restaurants", restaurants: user.restaurants
    json.partial! "api/restaurants/restaurants", restaurants: user.restaurants_reserved
end