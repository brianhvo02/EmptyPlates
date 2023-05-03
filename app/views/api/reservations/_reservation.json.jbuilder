json.set! reservation.id do
    json.extract! reservation, :id, :datetime, :available_table_id
end