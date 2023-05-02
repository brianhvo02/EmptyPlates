class Api::RestaurantsController < ApplicationController
    before_action :require_logged_in, only: [:create, :update, :destroy]

    def index
        limit = params[:limit] || 20
        @restaurants = Restaurant.limit(limit);
        render :index
    end

    def create
        @restaurant = Restaurant.new(restaurant_params.except(:photo));
        url_id = "#{restaurant_params[:name].parameterize()}-#{restaurant_params[:phone_number]}"
        @restaurant.url_id = url_id
        @errors = []

        begin
            @restaurant.photo.attach(restaurant_params[:photo])
        rescue => exception
            @errors << "Error: #{exception.message}"
        end

        @errors << "Current logged in user is NOT an owner" unless current_user.is_owner
        
        if @errors.length == 0 && @restaurant.save
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
        @restaurant = Restaurant.find_by(url_id: params[:id])

        if @restaurant
            if @restaurant.update(restaurant_params.except :photo)
                @restaurant.photo.attach restaurant_params[:photo] if restaurant_params[:photo] != "undefined"
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
        @restaurant = Restaurant.find_by(id: params[:id], owner: current_user)

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
end
