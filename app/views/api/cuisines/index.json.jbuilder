json.cuisines do
    @cuisines.each do |cuisine|
        json.set! cuisine.id do
            json.extract! cuisine, :id, :name
        end
    end
end