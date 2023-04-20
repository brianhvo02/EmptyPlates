class Api::NeighborhoodsController < ApplicationController
    def index
        @entries = Neighborhood.all
        render "api/shared/index"
    end
end
