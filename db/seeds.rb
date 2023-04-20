# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

require 'uri'
require 'net/http'
require 'openssl'

require 'faker'

def fetch(url)
    uri = URI(url)

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(uri)
    request["accept"] = 'application/json'
    request["Authorization"] = "Bearer " + ENV["YELP_API_KEY"]

    response = http.request(request)
    JSON.parse response.body, symbolize_names: true
end

Faker::Config.locale = "en-US"

puts "Generating cuisine names"
categories = fetch('https://api.yelp.com/v3/categories?locale=en_US')[:categories]
    .select { |category| category[:parent_aliases].include?("restaurants") }
    .map { |category| category[:title] }

categories.each { |category| Cuisine.new(name: category).save! }

neighborhoods = {
    "Union Square" => [37.788056, -122.4075],
    "San Pedro Square" => [37.33681, -121.89415]
}

puts "Generating neighborhood restaurants"

neighborhoods.each_with_index do |(neighborhood, coordinates), i|
    puts "Generating #{neighborhood}"
    Neighborhood.new(name: neighborhood).save!

    if i == 0
        puts "Generating demo user"
        User.new(
            email: "demo@emptyplates.com",
            phone_number: "1234567890",
            display_name: "DemoUser",
            first_name: "Demo",
            last_name: "User",
            password: "Password123",
            is_owner: true,
            neighborhood_id: 1
        ).save!
    end
    
    res = fetch(<<~HEREDOC.gsub(/\s+/, ""))[:businesses]
        https://api.yelp.com/v3/businesses/search?latitude=#{coordinates[0]}
        &longitude=#{coordinates[1]}&categories=#{categories.join(',')}
        &locale=en_US&open_at=1681844400&attributes=reservation&sort_by=distance&limit=20
    HEREDOC
    
    res.each do |restaurant_raw|
        restaurant_raw[:url_id] = restaurant_raw[:alias]
        restaurant_raw[:bio] = Faker::Restaurant.description
        restaurant_raw[:address] = restaurant_raw[:location][:display_address].join(", ")
        restaurant_raw[:phone_number] = restaurant_raw[:phone].empty? ? 
            Faker::PhoneNumber.cell_phone_in_e164[2...12] : 
            restaurant_raw[:phone][2...12]
        restaurant_raw[:price_range] = restaurant_raw[:price].nil? ? 
            rand(1..5) : 
            restaurant_raw[:price].length
        restaurant_raw[:neighborhood_id] = i + 1

        cuisines = Cuisine.where(name: restaurant_raw[:categories].map { |category| category[:title] })
        next if cuisines.empty?
        restaurant_raw[:cuisine_id] = cuisines.sample.id

        user_raw = {
            email: Faker::Internet.email,
            phone_number: Faker::PhoneNumber.cell_phone_in_e164[2...12],
            display_name: Faker::Internet.username,
            first_name: Faker::Name.first_name,
            last_name: Faker::Name.last_name,
            password: Faker::Internet.password,
            is_owner: true,
            neighborhood_id: i + 1
        }

        user = User.new(user_raw)
        user.save!

        puts "Generating owner #{user[:first_name]} #{user[:last_name]} from #{neighborhood}"

        restaurant_raw[:owner_id] = user.id

        restaurant = restaurant_raw.select { |k| [ :url_id, 
            :name, :bio, :address, :phone_number, :price_range, 
            :neighborhood_id, :cuisine_id, :owner_id 
        ].include?(k) }
        
        puts "Generating restaurant #{restaurant[:name]} in #{neighborhood}"
        
        Restaurant.new(restaurant).save!
    end
end
