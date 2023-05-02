reservations.each do |reservation|
    json.reservations do
        json.partial! "api/reservations/reservation", reservation: reservation
    end
end