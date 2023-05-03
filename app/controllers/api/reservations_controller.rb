class Api::ReservationsController < ApplicationController
    def create
        @reservation = Reservation.new(**reservation_params, datetime: Time.iso8601(reservation_params[:datetime]))
    
        if @reservation.save
            @user = User.find_by(id: params[:user_id])
            @id = @reservation.id
            render "/api/users/show"
        else
            @errors = @reservation.errors.full_messages
            render "api/shared/error", status: :unprocessable_entity
        end
    end

    def update
        @reservation = Reservation.find_by(id: params[:id])
    
        if @reservation
            if @reservation.update(**reservation_params, datetime: Time.iso8601(reservation_params[:datetime]))
                @user = User.find_by(id: params[:user_id])
                @id = @reservation.id
                render "/api/users/show"
            else
                @errors = @reservation.errors.full_messages
                render "api/shared/error", status: :unprocessable_entity
            end
            
        else
            @errors = ['Reservation not fount']
            render "api/shared/error", status: :not_found
        end
    end

    def destroy
        @reservation = Reservation.find_by(id: params[:id], diner: current_user)

        if @reservation
            if @reservation.destroy
                render :show
            else
                @errors = @reservation.errors.full_messages
                render "api/shared/error", status: :unprocessable_entity
            end
        else
            @errors = ['Reservation not fount']
            render "api/shared/error", status: :not_found
        end
    end

    def reservation_params
        params.require(:reservation).permit(:id, :datetime, :diner_id, :available_table_id)
    end
end
