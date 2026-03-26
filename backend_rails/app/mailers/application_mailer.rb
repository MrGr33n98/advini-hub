# Application Mailer Base Class
class ApplicationMailer < ActionMailer::Base
  default from: 'noreply@advocaciahub.com.br'
  layout 'mailer'
end