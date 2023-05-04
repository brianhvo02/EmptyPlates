json.set! restaurant.url_id do
    json.extract! restaurant, 
        :id, :url_id, :name, :bio, :address, :phone_number, :price_range, 
        :owner_id, :neighborhood_id, :cuisine_id
    
    json.image_url rails_blob_path(restaurant.photo)

    json.available_tables restaurant.available_tables.pluck :id

    json.review_count restaurant.reviews.where.not(review: "").count

    non_review_columns = ["id", "review", "reservation_id", "created_at", "updated_at"]

    review_breakdown = {}
    review_counts = []

    Review.column_names.each do |name|
        next if non_review_columns.include?(name)
        review_breakdown[name] = restaurant.reviews.average(name)
    end

    5.times do |i|
        review_counts[i] = restaurant.reviews.where(overall: i + 1).count / restaurant.reviews.count.to_f
    end

    json.review_breakdown review_breakdown
    json.review_counts review_counts
end
