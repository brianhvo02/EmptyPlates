class Api::ReviewsController < ApplicationController
    def create
        @review = Review.new(**review_params, reservation_id: params[:reservation_id])
    
        if @review.save
            @id = @review.id
            render :show
        else
            @errors = @review.errors.full_messages
            render "api/shared/error", status: :unprocessable_entity
        end
    end

    def update
        @review = Review.find_by(id: params[:id])
    
        if @review
            if @review.update(review_params)
                @id = @review.id
                render :show
            else
                @errors = @review.errors.full_messages
                render "api/shared/error", status: :unprocessable_entity
            end
            
        else
            @errors = ['Review not fount']
            render "api/shared/error", status: :not_found
        end
    end

    def destroy
        @review = Review.find_by(id: params[:id])

        if @review
            if @review.destroy
                render :show
            else
                @errors = @review.errors.full_messages
                render "api/shared/error", status: :unprocessable_entity
            end
        else
            @errors = ['Review not found']
            render "api/shared/error", status: :not_found
        end
    end

    private

    def review_params
        params.require(:review).permit(:id, :overall, :food, :service, :ambience, :review, :reservation_id)
    end
end
