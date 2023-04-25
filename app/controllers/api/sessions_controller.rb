class Api::SessionsController < ApplicationController
    def create
        @user = User.find_by_credentials(params[:user][:email], params[:user][:password])
    
        if @user
            login!(@user)
            render "api/users/show"
        else
            @errors = ["Invalid email/password"]
            render "api/shared/error", status: :unprocessable_entity
        end
    end

    def show
        @user = current_user
        if @user
            render "api/users/show"
        else
            render json: {}
        end
    end

    def destroy
        logout!
        render json: {}
    end
end
