json.session do
    json.current_user_id (@user ? @user.id : 0)
end
json.partial! "api/users/users", users: (@user ? [ @user ] : [])