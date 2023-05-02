json.set! reservation.id do
    json.extract! reservation, :id, :available_table_id
    json.datetime reservation.datetime.to_i
end