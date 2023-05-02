json.set! available_table.id do
    json.extract! available_table, :id, :seats, :tables
    json.restaurant_id Restaurant.find(available_table.restaurant_id).url_id

    json.reservations do
        json.array! available_table.reservations.map { |reservation| reservation.id }
    end
end