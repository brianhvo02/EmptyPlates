reservations.each do |reservation|
    json.reservations do
        json.partial! "api/reservations/reservation", reservation: reservation
    end

    json.reviews do
        json.partial! "api/reviews/review", review: reservation.review
    end

    json.users do
        json.partial! "api/users/user", user: reservation.diner
    end

    json.available_tables do
        json.partial! "api/available_tables/available_table", 
            available_table: reservation.available_table
    end
end