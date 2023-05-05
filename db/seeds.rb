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

def generate_user(neighborhood_id, is_owner = false, is_guest = false)
    user = User.new({
        email: Faker::Internet.unique.email,
        phone_number: Faker::PhoneNumber.unique.cell_phone_in_e164[2...12],
        display_name: rand(0..1) == 1 ? Faker::Internet.unique.username : nil,
        first_name: Faker::Name.first_name,
        last_name: Faker::Name.last_name,
        password: Faker::Internet.password,
        is_owner: is_owner,
        is_guest: is_guest,
        neighborhood_id: neighborhood_id,
        created_at: Time.now - 1.year
    })
    user.save!
    user
end

def rand_date(future = true)
    rand_date = rand(1 ... 12).months + rand(1 ... 31).days + rand(1 ... 24).hours + rand(1..4) * 15.minutes
    Time.at(((Time.now).to_f / 15.minutes).round * 15.minutes) + (rand_date * (future ? 1 : -1))
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

neighborhoods.each_with_index do |(neighborhood, coordinates), i|
    puts "Generating #{neighborhood}"
    Neighborhood.new(name: neighborhood, latitude: coordinates[0], longitude: coordinates[1]).save!
end

puts "Generating 500 users"
users = []
500.times { users << generate_user(rand(1..neighborhoods.count)) }

puts "Generating neighborhood restaurants"

neighborhoods.each_with_index do |(neighborhood, coordinates), i|
    now = Time.now
    timestamp = Time.new(now.year, now.month, now.day, 19).strftime('%s')
    
    res = fetch(<<~HEREDOC.gsub(/\s+/, ""))[:businesses]
        https://api.yelp.com/v3/businesses/search?latitude=#{coordinates[0]}
        &longitude=#{coordinates[1]}&categories=#{categories.join(',')}
        &locale=en_US&open_at=#{timestamp}&attributes=reservation&sort_by=distance&limit=20
    HEREDOC
    
    restaurants = res.map do |restaurant_raw|
        restaurant_raw[:url_id] = restaurant_raw[:alias]
        restaurant_raw[:address] = restaurant_raw[:location][:display_address].join(", ") + ', USA'
        restaurant_raw[:phone_number] = restaurant_raw[:phone].empty? ? 
            Faker::PhoneNumber.cell_phone_in_e164[2...12] : 
            restaurant_raw[:phone][2...12]
        restaurant_raw[:price_range] = restaurant_raw[:price].nil? ? 
            rand(1..4) : 
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
        
        restaurant_model = Restaurant.new(restaurant)
        downloaded_image = URI.parse(restaurant_raw[:image_url]).open
        restaurant_model.photo.attach(
            io: downloaded_image, 
            filename: "#{restaurant_model.url_id}.jpg"
        )

        restaurant_model
    end.compact

    restaurant_list = restaurants.map do |restaurant| 
        "Generate a detailed paragraph description about #{restaurant.name}"
    end.join('\n')

    puts "Generating restaurant bios for #{neighborhood}"
    completions = openai_client.completions(parameters: { model: "text-davinci-003", prompt: restaurant_list, max_tokens: 3000 })
    # p completions
    restaurant_bios = completions["choices"].map { |c| c["text"] }[0].split(/\n+/).reject { |str| str.empty? || str.include?("\\n") }
    p restaurant_bios

    restaurant_bios.each_with_index do |bio, i| 
        begin
            restaurants[i].bio = bio
        rescue => exception
            puts "Failed at restaurant #{i}"
        end
    end

    puts "Saving restaurant bios for #{neighborhood}"
    Restaurant.transaction do
        restaurants.each do |restaurant| 
            restaurant.save!
        end
    end

    restaurants.pluck(:id, :name).each do |id, name|
        pool = users.clone
        AvailableTable.transaction do
            puts "Generating tables for restaurant #{name}"
            AvailableTable.new(seats: 2, tables: 5, restaurant_id: id).save!
            AvailableTable.new(seats: 4, tables: 5, restaurant_id: id).save!
            AvailableTable.new(seats: 8, tables: 5, restaurant_id: id).save!
        end

        Review.transaction do
            puts "Generating reservations and reviews for restaurant #{name}"
            rand(0 ... 150).times do
                if rand(0 .. 1) === 1
                    user = pool.shuffle!.pop

                    p users if user.nil?

                    food = rand(1 .. 5)
                    service = rand(1 .. 5)
                    ambience = rand(1 .. 5)
                    overall = ((food + service + ambience) / 3).round
                    review = (rand(0 .. 2) === 2) ? Faker::Restaurant.review : ""

                    reservation = Reservation.new(
                        datetime: rand_date(false),
                        diner: user,
                        available_table: AvailableTable.where(restaurant_id: id).sample
                    )
                    reservation.save!(validate: false)

                    Review.new(
                        overall: overall, 
                        food: food, 
                        service: service, 
                        ambience: ambience, 
                        review: review,
                        reservation: reservation
                    ).save!
                end
            end
        end
    end
end

puts "Generating demo user"
demo_user = User.new(
    email: "demo@emptyplates.com",
    phone_number: "1234567890",
    display_name: "DemoUser",
    first_name: "Demo",
    last_name: "User",
    password: "Password123",
    is_owner: true,
    is_guest: false,
    neighborhood_id: 1,
    created_at: Time.now - 1.year
)
demo_user.save!

puts "Generating demo restaurant"
demo_cuisine = Cuisine.new(name: "Pizza Parlor")
demo_restaurant = Restaurant.new(
    url_id: "pizza-village-5133254576",
    name: "Pizza Village",
    bio: <<-HEREDOC,
    There's nothing cookie-cutter about Pizza Village. Not our pizzas. Not our people. And 
    definitely not the way we live life. Around here, we don't settle for anything less than food 
    we're proud to serve. And we don't just clock in. Not when we can also become our best, make 
    friends, and have fun while we're at it. We're the pizza company that lives life unboxed.
    HEREDOC
    address: "180 Geary St, San Francisco, CA 94108",
    phone_number: "5133254576",
    price_range: 1,
    neighborhood_id: 1,
    cuisine: demo_cuisine,
    owner: demo_user,
    created_at: Time.at(Time.now - 1.year)
)

demo_image = File.open('db/pizza.jpg')
demo_restaurant.photo.attach(
    io: demo_image, 
    filename: "#{demo_restaurant.url_id}.jpg"
)

demo_restaurant.save!

puts "Generating demo available tables"
AvailableTable.new(seats: 2, tables: 5, restaurant: demo_restaurant).save!
AvailableTable.new(seats: 4, tables: 5, restaurant: demo_restaurant).save!
AvailableTable.new(seats: 8, tables: 5, restaurant: demo_restaurant).save!

puts "Generating demo reservations"
3.times do
    demo_reservation = Reservation.new(
        datetime: rand_date(false),
        diner: demo_user,
        available_table: AvailableTable.where.not(restaurant: Restaurant.last).sample
    )
    demo_reservation.save!(validate: false)

    food = rand(1 .. 5)
    service = rand(1 .. 5)
    ambience = rand(1 .. 5)
    overall = ((food + service + ambience) / 3).round
    review = (rand(0 .. 2) === 2) ? Faker::Restaurant.review : ""

    Review.new(
        overall: overall, 
        food: food, 
        service: service, 
        ambience: ambience, 
        review: review,
        reservation: demo_reservation
    ).save!
end

3.times do
    Reservation.new(
        datetime: rand_date,
        diner: demo_user,
        available_table: AvailableTable.where.not(restaurant: Restaurant.last).sample
    ).save!
end
