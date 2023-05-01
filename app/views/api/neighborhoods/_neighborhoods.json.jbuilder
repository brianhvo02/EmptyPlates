neighborhoods.each do |neighborhood|
    json.neighborhoods do
        json.partial! "api/neighborhoods/neighborhood", neighborhood: neighborhood
    end

    json.partial! "api/restaurants/restaurants", restaurants: neighborhood.restaurants
end