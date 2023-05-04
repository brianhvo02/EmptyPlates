json.set! reservation.id do
    json.extract! reservation, :id, :datetime, :available_table_id, :diner_id
    json.review_id reservation.review ? reservation.review.id : nil
end