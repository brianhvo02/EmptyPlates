class Api::NeighborhoodsController < ApplicationController
    def index
        @neighborhoods = Neighborhood.all
        render :index
    end

    def show
        @neighborhood = Neighborhood.find_by(id: params[:id])
        
        if @neighborhood
            render :show
        else
            render json: ['Neighborhood not found!'], status: :not_found
        end
    end
end
