class Api::NeighborhoodsController < ApplicationController
    def index
        @neighborhoods = Neighborhood.all
        render :index
    end
end
