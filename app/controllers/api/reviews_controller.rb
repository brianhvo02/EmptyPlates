class Api::ReviewsController < ApplicationController
    def create
        @review = Review.new(**review_params, reservation_id: params[:reservation_id])
    
        if @review.save
            @user = @review.reservation.diner
            @id = @review.id
            render "/api/users/show"
        else
            @errors = @review.errors.full_messages
            render "api/shared/error", status: :unprocessable_entity
        end
    end

    private

    def review_params
        params.require(:user).permit(:id, :overall, :food, :service, :ambience, :text, :reservation_id)
    end
end
