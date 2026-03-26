# Contact Messages Controller
class Api::V1::ContactMessagesController < ApplicationController
  before_action :authenticate_user!, except: [:create]
  
  def index
    if current_user.admin?
      @messages = ContactMessage.all
    elsif current_user.lawyer?
      # Find the lawyer profile for this user
      lawyer = Lawyer.find_by(user_id: current_user.id)
      @messages = ContactMessage.by_lawyer(lawyer.id) if lawyer
    else
      @messages = ContactMessage.where(sender: current_user)
    end
    
    @messages = @messages.order(created_at: :desc)
    
    render json: {
      data: @messages.map { |msg| contact_message_json(msg) },
      total: @messages.count
    }
  end

  def create
    @message = ContactMessage.new(contact_message_params)
    
    # If user is authenticated, associate with user
    if current_user
      @message.sender = current_user
    end
    
    if @message.save
      # Here we could trigger a background job to send notification
      # ContactNotificationJob.perform_later(@message)
      
      render json: contact_message_json(@message), status: :created
    else
      render json: { 
        error: 'Failed to send message', 
        messages: @message.errors.full_messages 
      }, status: :unprocessable_entity
    end
  end

  def show
    @message = ContactMessage.find(params[:id])
    
    # Check authorization
    unless authorized_for_message?(@message)
      return render json: { error: 'Unauthorized' }, status: :forbidden
    end
    
    # Mark as read
    @message.update(status: 'read') if @message.pending?
    
    render json: contact_message_json(@message)
  end

  private

  def contact_message_params
    params.require(:contact_message).permit(
      :lawyer_id, :client_name, :client_email, :client_phone, 
      :message, :case_type
    )
  end

  def contact_message_json(message)
    {
      id: message.id,
      lawyer_id: message.lawyer_id,
      client_name: message.client_name,
      client_email: message.client_email,
      client_phone: message.client_phone,
      message: message.message,
      case_type: message.case_type,
      status: message.status,
      created_at: message.created_at,
      updated_at: message.updated_at
    }
  end
  
  def authorized_for_message?(message)
    current_user.admin? || 
    (current_user.lawyer? && message.lawyer.user_id == current_user.id) ||
    (current_user.client? && message.sender == current_user)
  end
end