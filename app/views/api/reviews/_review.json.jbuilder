unless review.nil?
    json.set! review.id do
        json.extract! review, :id, :overall, :food, :service, :ambience, :review, :reservation_id
    end
end    