class Api::RestaurantsController < ApplicationController
    def index
        @restaurants = Restaurant.limit(20);
        render :index
    end

    def create
        p restaurant_params.except(:photo)
        @restaurant = Restaurant.new(restaurant_params.except(:photo));
        url_id = "#{restaurant_params[:name].parameterize()}-#{restaurant_params[:phone_number]}"
        @restaurant.url_id = url_id
        @errors = []

        begin
            @restaurant.photo.attach(restaurant_params[:photo])
        rescue => exception
            puts "Error: #{exception.message}"
        end
        
        if @restaurant.save
            render :show
        else
            @errors.append(*@restaurant.errors.full_messages)
            render "api/shared/error", status: :unprocessable_entity
        end
    end

    def show
        @restaurant = Restaurant.find_by(url_id: params[:id])

        if @restaurant
            render :show
        else
            render json: ['Restaurant not found!'], status: :not_found
        end
    end

    def update
        @restaurant = Restaurant.find_by(id: params[:id])

        if @restaurant
            photo = restaurant_params[:photo]
            restaurant_params.delete :photo
            if @restaurant.update(restaurant_params)
                @restaurant.photo.attach photo if photo
                render :show
            else
                @errors = @restaurant.errors.full_messages
                render "api/shared/error", status: :unprocessable_entity
            end
        else
            @errors = ['Restaurant not found']
            render "api/shared/error", status: :not_found
        end
    end

    def destroy
        @restaurant = Restaurant.find_by(id: params[:id])

        if @restaurant
            restaurant_id = @restaurant.url_id
            if @restaurant.destroy
                render json: { id: restaurant_id }
            else
                @errors = @restaurant.errors.full_messages
                render "api/shared/error", status: :not_found
            end
        else
            @errors = ['Restaurant not found']
            render "api/shared/error", status: :not_found
        end
    end

    def restaurant_params
        params.require(:restaurant).permit(:id, :url_id, :name, :bio, :address, :phone_number, :price_range, :photo, :neighborhood_id, :cuisine_id, :owner_id)
    end

    def photo_decode(url_id)
        decoded_data = Base64.decode64(restaurant_params[:photo].split(',')[1])
        {
          io:           StringIO.new(decoded_data),
          content_type: 'image/jpeg',
          filename:     "#{url_id}.jpg"
        }
    end
end
