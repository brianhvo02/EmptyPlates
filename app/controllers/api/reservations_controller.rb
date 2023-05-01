class Api::ReservationsController < ApplicationController
    def create
        @reservation = Reservation.new(**reservation_params, datetime: Time.at(reservation_params[:datetime]))
    
        if @reservation.save
            @user = User.find_by(id: params[:user_id])
            render "/api/users/show"
        else
            @errors = @reservation.errors.full_messages
            render "api/shared/error", status: :unprocessable_entity
        end
    end

    def reservation_params
        params.require(:reservation).permit(:id, :datetime, :diner_id, :available_table_id)
    end
end
