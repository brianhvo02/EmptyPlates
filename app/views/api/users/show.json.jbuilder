json.extract! @user, 
    :id, :email, :phone_number, 
    :display_name, :first_name, :last_name, 
    :is_owner
json.neighborhood @user.neighborhood.name