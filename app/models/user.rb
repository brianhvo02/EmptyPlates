class User < ApplicationRecord
    has_secure_password

    validates :email, :phone_number, :first_name, :last_name, :session_token, 
        presence: true
    validates :email, :phone_number, :session_token, uniqueness: true
    validates :is_owner, inclusion: { 
        in: [true, false], 
        message: " is not a boolean" 
    }
    validates :is_guest, inclusion: { 
        in: [true, false], 
        message: " is not a boolean" 
    }
    validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
    validates :phone_number, format: { with: /^\d{10}$/, multiline: true }
    validates :password, allow_nil: true, format: { 
        with: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 
        multiline: true,
        message: "password must be minimum 8 characters, 
            at least one uppercase letter, one lowercase letter, and one number" 
    }

    before_validation :ensure_session_token

    def errors
        super.tap { |errors| errors.delete(:password, :blank) if is_guest }
    end

    def self.find_by_credentials(email, password)
        @user = User.find_by(email: email)
        @user&.authenticate(password) ? @user : nil
    end

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
        foreign_key: :owner_id,
        dependent: :destroy

    has_many :reservations,
        foreign_key: :diner_id,
        dependent: :destroy

    has_many :tables_reserved,
        through: :reservations,
        source: :available_table

    has_many :restaurants_reserved,
        through: :tables_reserved,
        source: :restaurant

    has_many :reviews,
        through: :reservations
end
