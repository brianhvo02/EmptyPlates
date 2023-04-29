json.cuisines do
    @cuisines.each do |cuisine|
        json.partial! "api/cuisines/cuisine", cuisine: cuisine
    end
end