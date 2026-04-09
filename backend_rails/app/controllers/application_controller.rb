# Add the concerns to the application controller
class ApplicationController < ActionController::Base
  include Authenticable
  include Cacheable
  
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception, unless: -> { request.format.json? }
  
  # Handle specific API errors (only for JSON requests)
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :record_invalid

  private

  def record_not_found
    return unless request.format.json?
    render json: { error: 'Record not found' }, status: :not_found
  end

  def record_invalid(exception)
    return unless request.format.json?
    render json: {
      error: 'Validation failed',
      messages: exception.record.errors.full_messages
    }, status: :unprocessable_entity
  end
end