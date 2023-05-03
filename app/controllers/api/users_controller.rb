class Api::UsersController < ApplicationController
    def create
        @user = User.new(user_params)
    
        if @user.save
            if user_params[:password].empty?
                render :show
            else
                login!(@user) unless user_params[:password].empty?
                UserMailer.with(user: @user).welcome_email.deliver_later
                render "api/sessions/show"
            end
        else
            @errors = @user.errors.full_messages
            render "api/shared/error", status: :unprocessable_entity
        end
    end

    def show
        @user = User.find_by(id: params[:id])

        if @user
            render :show
        else
            @errors = ["No user found"]
            render "api/shared/error", status: :not_found
        end
    end

    private

    def user_params
        params.require(:user).permit(
            :email, :phone_number, 
            :first_name, :last_name, 
            :is_owner, :is_guest,
            :neighborhood_id, 
            :password
        )
    end
end
