class ApplicationController < ActionController::API
    include ActionController::Helpers
    include ActionController::RequestForgeryProtection
    protect_from_forgery with: :exception
    before_action :snake_case_params, :attach_authenticity_token

    def current_user
        return nil if session[:session_token].nil?
        @current_user ||= User.find_by(session_token: session[:session_token])
    end

    def require_logged_in
        render json: { errors: ["not logged in"]} if logged_in?
    end

    def require_logged_out
        render json: { errors: ["not logged out"]} unless logged_in?
    end

    def logged_in?
        !!current_user
    end

    def login!(user)
        @current_user = user
        session[:session_token] = user.reset_session_token!
    end

    def logout!
        current_user.try(:reset_session_token!)
        session[:session_token] = nil
    end

    private
    def snake_case_params
        params.deep_transform_keys!(&:underscore)
    end

    def attach_authenticity_token
        headers['X-CSRF-Token'] = masked_authenticity_token(session)
    end
end
