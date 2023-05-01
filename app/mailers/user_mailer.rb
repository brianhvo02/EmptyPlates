class UserMailer < ApplicationMailer
    def welcome_email
        @user = params[:user]
        @url = (ENV["RAILS_ENV"] == "production" ? "https://" : "http://")+ ActionMailer::Base.default_url_options[:host]
        mail(to: @user.email, subject: "Welcome to EmptyPlates!")
    end
end
