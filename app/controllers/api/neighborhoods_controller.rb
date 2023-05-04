class Api::NeighborhoodsController < ApplicationController
    def index
        @neighborhoods = Neighborhood.all
        if params[:shallow]
            render :index_shallow
        else
            render :index
        end
    end

    def show
        @neighborhood = Neighborhood.find_by(id: params[:id])
        
        if @neighborhood
            if params[:shallow]
                render :show_shallow
            else
                render :show
            end
        else
            render json: ['Neighborhood not found!'], status: :not_found
        end
    end
end
