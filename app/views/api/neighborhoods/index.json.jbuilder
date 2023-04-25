json.neighborhoods do
    @neighborhoods.each do |neighborhood|
        json.set! neighborhood.id do
            json.extract! neighborhood, :id, :name, :latitude, :longitude
        end
    end
end