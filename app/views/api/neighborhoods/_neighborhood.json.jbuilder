json.set! neighborhood.id do
    json.extract! neighborhood, :id, :name, :latitude, :longitude
    json.restaurants neighborhood.restaurants.pluck :url_id
end