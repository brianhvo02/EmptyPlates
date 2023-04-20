class Api::CuisinesController < ApplicationController
    def index
        @entries = Cuisine.all
        render "api/shared/index"
    end
end
