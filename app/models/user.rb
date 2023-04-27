class User < ApplicationRecord
    has_secure_password

    validates :email, :phone_number, :first_name, :last_name, :session_token, 
        presence: true
    validates :email, :phone_number, :session_token, uniqueness: true
    validates :is_owner, inclusion: { 
        in: [true, false], 
        message: "is_owner is not a boolean" 
    }
    validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
    validates :phone_number, format: { with: /^\d{10}$/, multiline: true }
    validates :password, allow_blank: true, format: { 
        with: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 
        multiline: true,
        message: "password must be minimum 8 characters, 
            at least one uppercase letter, one lowercase letter, and one number" 
    }

    before_validation :ensure_session_token

    def self.find_by_credentials(email, password)
        @user = User.find_by(email: email)
        # @user&.is_password?(password) ? @user : nil
        @user&.authenticate(password) ? @user : nil
    end

    # def password=(password)
    #     self.password_digest = BCrypt::Password.create(password)
    #     @password = password
    # end

    # def is_password?(password)
    #     BCrypt::Password.new(password_digest).is_password?(password)
    # end

    def reset_session_token!
        self.session_token = generate_session_token
        self.save!
        self.session_token
    end

    private

    def generate_session_token
        loop do 
            session_token = SecureRandom::urlsafe_base64
            return session_token unless User.exists?(session_token: session_token)
        end
    end

    def ensure_session_token
        self.session_token ||= generate_session_token
    end

    belongs_to :neighborhood 
    has_many :restaurants,
        foreign_key: :owner_id
end
