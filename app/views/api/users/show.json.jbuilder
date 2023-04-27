json.extract! @user, 
    :id, :email, :phone_number, 
    :display_name, :first_name, :last_name, 
    :is_owner
json.neighborhood @user.neighborhood.name
json.restaurants do
    @user.restaurants.each do |restaurant|
        json.set! restaurant.url_id do
            json.extract! restaurant, :id, :url_id, 
                :name, :bio, :address, :phone_number, :price_range, :owner_id
        end
    end
end