# Job for Appointment Confirmation
class AppointmentConfirmationJob < ApplicationJob
  queue_as :default

  def perform(appointment)
    # Send confirmation email to client
    ClientMailer.appointment_confirmation(appointment).deliver_now
    
    # Send notification to lawyer
    LawyerMailer.appointment_notification(appointment).deliver_now
    
    # Update appointment status
    appointment.update(status: 'confirmed')
  rescue => e
    Rails.logger.error "Failed to send appointment confirmation for #{appointment.id}: #{e.message}"
  end
end