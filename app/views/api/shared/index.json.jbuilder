json.neighborhoods do
    @entries.each do |entry|
        json.set! entry.id do
            json.extract! entry, :id, :name
        end
    end
end