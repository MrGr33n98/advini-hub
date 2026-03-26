# Job for Appointment Status Change
class AppointmentStatusChangeJob < ApplicationJob
  queue_as :default

  def perform(appointment)
    case appointment.status
    when 'cancelled'
      # Notify both parties about cancellation
      ClientMailer.appointment_cancelled(appointment).deliver_now
      LawyerMailer.appointment_cancelled(appointment).deliver_now
    when 'completed'
      # Send completion notification
      ClientMailer.appointment_completed(appointment).deliver_now
    when 'missed'
      # Send reminder about missed appointment
      ClientMailer.appointment_missed(appointment).deliver_now
    end
  rescue => e
    Rails.logger.error "Failed to send status change notification for #{appointment.id}: #{e.message}"
  end
end