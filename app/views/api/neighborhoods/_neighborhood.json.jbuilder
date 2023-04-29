json.set! neighborhood.id do
    json.extract! neighborhood, :id, :name, :latitude, :longitude
end