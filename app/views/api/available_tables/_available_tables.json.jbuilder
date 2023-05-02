available_tables.each do |available_table|
    json.available_tables do
        json.partial! "api/available_tables/available_table", available_table: available_table
    end

    json.partial! "api/reservations/reservations", reservations: available_table.reservations
end