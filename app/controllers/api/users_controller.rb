class Api::UsersController < ApplicationController
    def create
        @user = User.new(user_params)
    
        if @user.save
            login!(@user)
            render :user
        else
            @errors = @user.errors.full_messages
            render "api/shared/error", status: :unprocessable_entity
        end
    end

    def show
        @user = User.find_by(id: params[:id])

        if @user
            render :user
        else
            render json: {}
        end
    end

    private

    def user_params
        params.require(:user).permit(
            :email, :phone_number, 
            :first_name, :last_name, 
            :is_owner, 
            :neighborhood_id, 
            :password
        )
    end
end
