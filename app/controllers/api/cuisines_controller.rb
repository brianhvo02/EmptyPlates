class Api::CuisinesController < ApplicationController
    def index
        @cuisines = Cuisine.all
        render :index
    end
end
