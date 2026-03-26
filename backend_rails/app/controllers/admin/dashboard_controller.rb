# Add a dashboard controller for admin analytics
class Admin::DashboardController < Admin::ApplicationController
  def index
    @stats = {
      total_lawyers: Lawyer.count,
      total_offices: Office.count,
      total_appointments: Appointment.count,
      total_messages: ContactMessage.count,
      pending_reviews: Review.pending.count,
      today_appointments: Appointment.where(appointment_date: Date.current.all_day).count,
      weekly_appointments: Appointment.where(appointment_date: 1.week.ago..Time.current).count
    }
    
    @recent_activity = [
      {
        type: 'appointment',
        title: 'Novo agendamento',
        description: 'Consulta agendada para amanhã',
        time: Appointment.last&.created_at&.strftime('%H:%M'),
        count: Appointment.today.count
      },
      {
        type: 'message',
        title: 'Nova mensagem',
        description: 'Mensagem recebida de cliente',
        time: ContactMessage.last&.created_at&.strftime('%H:%M'),
        count: ContactMessage.unread.count
      },
      {
        type: 'lawyer',
        title: 'Novo advogado',
        description: 'Registro de novo profissional',
        time: Lawyer.last&.created_at&.strftime('%H:%M'),
        count: Lawyer.this_week.count
      }
    ].compact
    
    # Prepare chart data
    @appointments_chart_data = generate_appointments_chart_data
  end
  
  private
  
  def generate_appointments_chart_data
    # Last 7 days of appointments
    dates = []
    counts = []
    
    6.downto(0) do |i|
      date = i.days.ago.to_date
      dates << date.strftime('%d/%m')
      counts << Appointment.where(appointment_date: date.all_day).count
    end
    
    {
      labels: dates,
      datasets: [{
        label: 'Agendamentos',
        data: counts,
        backgroundColor: 'rgba(30, 64, 175, 0.5)',
        borderColor: 'rgba(30, 64, 175, 1)'
      }]
    }
  end
end