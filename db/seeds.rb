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

def fetch_base(url, **options)
    uri = URI(url)

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(uri)
    options.each { |option, value| request[option] = value }

    http.request(request)
end

def fetch(url)
    response = fetch_base url, accept: 'application/json', Authorization: "Bearer " + ENV["YELP_API_KEY"]
    JSON.parse response.body, symbolize_names: true
end

def fetch_image(url)
    uri = URI(url)

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(uri)
    request["accept"] = 'application/json'
    request["Authorization"] = "Bearer " + ENV["YELP_API_KEY"]

    response = http.request(request)
    JSON.parse response.body, symbolize_names: true
end

def generate_user(neighborhood_id, is_owner = false)
    user = User.new({
        email: Faker::Internet.unique.email,
        phone_number: Faker::PhoneNumber.unique.cell_phone_in_e164[2...12],
        display_name: Faker::Internet.unique.username,
        first_name: Faker::Name.unique.first_name,
        last_name: Faker::Name.unique.last_name,
        password: Faker::Internet.unique.password,
        is_owner: is_owner,
        neighborhood_id: neighborhood_id
    })
    user.save!
    user
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

    # users = []
    # 1000.times { users << generate_user(i + 1) }
    
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

        cuisines = Cuisine.where(
            name: restaurant_raw[:categories].map { |category| category[:title] }
        )
        next if cuisines.empty?
        restaurant_raw[:cuisine_id] = cuisines.sample.index
        
        owner = generate_user(i + 1, true)
        
        puts "Generating owner #{user_raw[:first_name]} #{user_raw[:last_name]} from #{neighborhood}"
        
        restaurant_raw[:owner_id] = owner.id

        restaurant = restaurant_raw.select do |k| 
            [ :url_id, 
                :name, :bio, :address, :phone_number, :price_range, 
                :neighborhood_id, :cuisine_id, :owner_id 
            ].include?(k)
        end
        
        puts "Generating restaurant #{restaurant[:name]} in #{neighborhood}"
        
        restaurantModel = Restaurant.new(restaurant)
        downloaded_image = URI.parse(restaurant_raw[:image_url]).open
        restaurantModel.photo.attach(
            io: downloaded_image, 
            filename: "#{restaurantModel.url_id}.jpg"
        )
        restaurantModel.save!

        # unique_users = users.clone

        # rand(50 ... 1000).times do
        #     user = unique_users.shuffle!.pop
        #     if rand(0 .. 1) === 0
        #         Review.new
        #     end
        # end
    end
end
