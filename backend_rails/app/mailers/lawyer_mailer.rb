# Lawyer Mailer for sending notifications
class LawyerMailer < ApplicationMailer
  default from: 'noreply@advocaciahub.com.br'

  def contact_notification(contact_message)
    @contact_message = contact_message
    @lawyer = contact_message.lawyer
    
    mail(
      to: @lawyer.email.presence || find_lawyer_email(@lawyer),
      subject: "Nova mensagem de #{@contact_message.client_name} - AdvocaciaHub"
    )
  end

  private

  def find_lawyer_email(lawyer)
    # Try to find email from associated user or office
    if lawyer.user&.email
      lawyer.user.email
    elsif lawyer.office&.email
      lawyer.office.email
    else
      'contato@escritorio.com.br' # fallback
    end
  end
end