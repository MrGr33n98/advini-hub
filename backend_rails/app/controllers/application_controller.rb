# Add the concerns to the application controller
class ApplicationController < ActionController::Base
  include Authenticable
  include Cacheable
  
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception, unless: -> { request.format.json? }
  
  # Handle API errors
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :record_invalid
  rescue_from StandardError, with: :internal_server_error

  private

  def record_not_found
    render json: { error: 'Record not found' }, status: :not_found
  end

  def record_invalid(exception)
    render json: { 
      error: 'Validation failed', 
      messages: exception.record.errors.full_messages 
    }, status: :unprocessable_entity
  end
  
  def internal_server_error(exception)
    Rails.logger.error exception.backtrace.join("\n")
    render json: { error: 'Internal server error' }, status: :internal_server_error
  end
end