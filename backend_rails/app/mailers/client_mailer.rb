# Client Mailer
class ClientMailer < ApplicationMailer
  default from: 'noreply@advocaciahub.com.br'

  def appointment_confirmation(appointment)
    @appointment = appointment
    @client = appointment.client || find_client_by_email(appointment.client_email)
    
    mail(
      to: appointment.client_email,
      subject: "Confirmação de Agendamento - AdvocaciaHub"
    )
  end

  def appointment_cancelled(appointment)
    @appointment = appointment
    
    mail(
      to: appointment.client_email,
      subject: "Agendamento Cancelado - AdvocaciaHub"
    )
  end

  def appointment_completed(appointment)
    @appointment = appointment
    
    mail(
      to: appointment.client_email,
      subject: "Agendamento Concluído - AdvocaciaHub"
    )
  end

  def appointment_missed(appointment)
    @appointment = appointment
    
    mail(
      to: appointment.client_email,
      subject: "Lembrete: Consulta Não Comparecida - AdvocaciaHub"
    )
  end

  private

  def find_client_by_email(email)
    User.find_by(email: email)
  end
end