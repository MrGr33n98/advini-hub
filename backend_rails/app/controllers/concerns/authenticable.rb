# Authentication Concern
module Authenticable
  extend ActiveSupport::Concern

  def encode_token(payload)
    payload[:exp] = 24.hours.from_now.to_i
    JWT.encode(payload, Rails.application.secret_key_base)
  end

  def decode_token(token)
    decoded = JWT.decode(token, Rails.application.secret_key_base, true, algorithm: 'HS256')
    HashWithIndifferentAccess.new(decoded[0])
  rescue JWT::DecodeError
    nil
  end

  def current_user
    return @current_user if defined?(@current_user)

    token = request.headers['Authorization']&.split(' ')&.last
    return nil unless token

    decoded_token = decode_token(token)
    return nil unless decoded_token

    @current_user = User.find_by(id: decoded_token['user_id'])
  end

  def authenticate_user!
    unless current_user
      render json: { error: 'Authentication required' }, status: :unauthorized
    end
  end
end