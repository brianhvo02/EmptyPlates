json.neighborhoods do
    @neighborhoods.each do |neighborhood|
        json.partial! "api/neighborhoods/neighborhood", neighborhood: neighborhood
    end
end