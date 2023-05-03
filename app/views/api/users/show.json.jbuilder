json.id @id || @user.id
json.partial! "api/users/users", users: [ @user ]