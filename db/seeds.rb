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
require 'openai'

puts 'Destroying all restaurants'
Restaurant.destroy_all

puts 'Destroying all users'
User.destroy_all

puts 'Destroying all cuisines'
Cuisine.destroy_all

puts 'Destroying all neighborhoods'
Neighborhood.destroy_all

puts 'Destroying all ActiveStorage attachments'
ActiveStorage::Attachment.all.each { |attachment| attachment.purge }

ActiveRecord::Base.connection.tables.each do |t|
    ActiveRecord::Base.connection.reset_pk_sequence!(t)
end

openai_client = OpenAI::Client.new(access_token: Rails.application.credentials.dig(:openai_api_key))

def fetch_base(url, **options)
    uri = URI(url)

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.read_timeout = 180

    request = Net::HTTP::Get.new(uri)
    options.except(:method).each { |option, value| request[option] = value }
    response = http.request(request)
end

def fetch(url)
    response = fetch_base url, accept: 'application/json', Authorization: "Bearer " + Rails.application.credentials.dig(:yelp_api_key)
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
    "Santana Row" => [37.320278, -121.947778],
    "Central District" => [37.551891010412604, -121.9778321537643]
}

puts "Generating neighborhood restaurants"

neighborhoods.each_with_index do |(neighborhood, coordinates), i|
    puts "Generating #{neighborhood}"
    Neighborhood.new(name: neighborhood, latitude: coordinates[0], longitude: coordinates[1]).save!
    # users = []
    # 1000.times { users << generate_user(i + 1) }

    now = DateTime.now
    timestamp = DateTime.new(now.year, now.month, now.day, 19).strftime('%s')
    
    res = fetch(<<~HEREDOC.gsub(/\s+/, ""))[:businesses]
        https://api.yelp.com/v3/businesses/search?latitude=#{coordinates[0]}
        &longitude=#{coordinates[1]}&categories=#{categories.join(',')}
        &locale=en_US&open_at=#{timestamp}&attributes=reservation&sort_by=distance&limit=20
    HEREDOC
    
    restaurants = res.map do |restaurant_raw|
        restaurant_raw[:url_id] = restaurant_raw[:alias]
        # restaurant_raw[:bio] = Faker::Restaurant.description
        restaurant_raw[:address] = restaurant_raw[:location][:display_address].join(", ") + ', USA'
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
        restaurant_raw[:cuisine_id] = cuisines.sample.id
        
        owner = generate_user(i + 1, true)
        
        puts "Generating owner #{owner.first_name} #{owner.last_name} from #{neighborhood}"
        
        restaurant_raw[:owner_id] = owner.id

        restaurant = restaurant_raw.select do |k| 
            [ :name, :address, :phone_number, :price_range, 
                :url_id,:neighborhood_id, :cuisine_id, :owner_id 
            ].include?(k)
        end
        
        puts "Generating restaurant #{restaurant[:name]} in #{neighborhood}"
        
        restaurantModel = Restaurant.new(restaurant)
        downloaded_image = URI.parse(restaurant_raw[:image_url]).open
        restaurantModel.photo.attach(
            io: downloaded_image, 
            filename: "#{restaurantModel.url_id}.jpg"
        )

        restaurantModel
        # restaurantModel.save!

        # unique_users = users.clone

        # rand(50 ... 1000).times do
        #     user = unique_users.shuffle!.pop
        #     if rand(0 .. 1) === 0
        #         Review.new
        #     end
        # end
    end.compact

    restaurant_list = restaurants.map do |restaurant| 
        "Generate a detailed paragraph description about #{restaurant.name}"
    end.join('\n')

    puts "Generating restaurant bios for #{neighborhood}"
    completions = openai_client.completions(parameters: { model: "text-davinci-003", prompt: restaurant_list, max_tokens: 3000 })
    p completions
    restaurant_bios = completions["choices"].map { |c| c["text"] }[0].split(/\n+/).reject { |str| str.empty? }

    restaurant_bios.each_with_index do |bio, i| 
        begin
            restaurants[i].bio = bio
        rescue => exception
            puts "Failed at restaurant #{i}"
        end
    end

    puts "Saving restaurant bios for #{neighborhood}"
    Restaurant.transaction do
        restaurants.each {|restaurant| restaurant.save }
    end
end

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


