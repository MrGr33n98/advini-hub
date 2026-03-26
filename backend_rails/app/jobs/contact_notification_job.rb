# Background Job for Sending Notifications
class ContactNotificationJob < ApplicationJob
  queue_as :default

  def perform(contact_message)
    # Send email notification to lawyer
    LawyerMailer.contact_notification(contact_message).deliver_now
    
    # Optionally send SMS notification
    # SmsService.send_notification(contact_message.lawyer.phone, "Nova mensagem de #{contact_message.client_name}")
    
    # Update message status
    contact_message.update(status: 'sent')
  rescue => e
    Rails.logger.error "Failed to send notification for message #{contact_message.id}: #{e.message}"
    # Optionally log to error tracking service
  end
end