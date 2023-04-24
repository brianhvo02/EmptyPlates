class Api::RestaurantsController < ApplicationController
    def index
        @restaurants = Restaurant.limit(20);
        render :restaurants
    end

    def create
        
    end

    def show
        @restaurant = Restaurant.find_by(url_id: params[:id])

        if @restaurant
            render :restaurant
        else
            render json: ['Restaurant not found!'], status: :not_found
        end
    end

    def update
        
    end

    def destroy
        
    end

    def user_params
        params.require(:restaurant).permit(:url_id, :name, :bio, :address, :phone_number, :price_range, :neighborhood_id, :cuisine_id, :owner_id)
    end
end
