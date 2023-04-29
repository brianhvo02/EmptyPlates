json.session do
    json.current_user_id @user.id
end
json.partial! "api/users/users", users: [ @user ]