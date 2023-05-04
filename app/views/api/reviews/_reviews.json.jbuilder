reviews.each do |review|
    json.reviews do
        json.partial! "api/reviews/review", review: review
    end

    json.reservations do
        json.partial! "api/reservations/reservation", reservation: review.reservation
    end
end