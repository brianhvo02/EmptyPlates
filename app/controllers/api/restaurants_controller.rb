class Api::RestaurantsController < ApplicationController
    def index
        @restaurants = Restaurant.limit(20);
        render :index
    end

    def create
        @restaurant = Restaurant.new(restaurant_params);
        url_id = "#{restaurant_params[:name].parameterize()}-#{restaurant_params[:phone_number]}"
        @restaurant.url_id = url_id
        @restaurant.photo.attach(restaurant_params[:photo])
        if @restaurant.save
            p @restaurant
            render :show
        else
            @errors = @restaurant.errors.full_messages
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
        
    end

    def destroy
        
    end

    def restaurant_params
        params.require(:restaurant).permit(:name, :bio, :address, :phone_number, :price_range, :photo, :neighborhood_id, :cuisine_id, :owner_id)
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
