# Add the concerns to the application controller
class ApplicationController < ActionController::Base
  include Authenticable
  include Cacheable
  
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception, unless: -> { request.format.json? }
  
  # Handle specific API errors (only for JSON requests)
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found, if: -> { request.format.json? }
  rescue_from ActiveRecord::RecordInvalid, with: :record_invalid, if: -> { request.format.json? }

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
end