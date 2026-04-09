# Update the User model to include appointments
class User < ApplicationRecord
  has_secure_password

  has_many :appointments, foreign_key: 'client_id', dependent: :destroy
  has_one :lawyer_profile, class_name: 'Lawyer', foreign_key: 'user_id', dependent: :nullify

  validates :email, presence: true, uniqueness: true
  validates :password, length: { minimum: 6 }, if: :password_required?

  enum role: { client: 0, lawyer: 1, admin: 2 }

  def password_required?
    new_record? || password.present?
  end

  def jwt_token
    encode_token({ user_id: id })
  end

  def self.ransackable_attributes(auth_object = nil)
    %w[id email role created_at updated_at]
  end

  def self.ransackable_associations(auth_object = nil)
    %w[appointments lawyer_profile]
  end

  private

  def encode_token(payload)
    payload[:exp] = 24.hours.from_now.to_i
    JWT.encode(payload, Rails.application.secret_key_base)
  end
end