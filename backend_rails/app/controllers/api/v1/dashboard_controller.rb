# Dashboard API Controller - Base
class Api::V1::DashboardController < ApplicationController
  before_action :authenticate_user!

  # GET /api/v1/dashboard/metrics
  def metrics
    render json: dashboard_metrics
  end

  # GET /api/v1/dashboard/leads
  def leads
    @leads = current_user.assigned_leads
                          .order(created_at: :desc)
                          .page(params[:page])
                          .per(params[:per_page] || 20)
    
    render json: {
      data: @leads.map { |lead| lead_json(lead) },
      meta: pagination_json(@leads)
    }
  end

  # GET /api/v1/dashboard/appointments
  def appointments
    @appointments = current_user.lawyer_appointments
                                .where('appointment_date >= ?', Time.current.beginning_of_day)
                                .order(appointment_date: :asc)
                                .page(params[:page])
                                .per(params[:per_page] || 20)
    
    render json: {
      data: @appointments.map { |apt| appointment_json(apt) },
      meta: pagination_json(@appointments)
    }
  end

  # GET /api/v1/dashboard/messages
  def messages
    @messages = current_user.lawyer_contact_messages
                            .order(created_at: :desc)
                            .page(params[:page])
                            .per(params[:per_page] || 20)
    
    render json: {
      data: @messages.map { |msg | message_json(msg) },
      meta: pagination_json(@messages)
    }
  end

  private

  def dashboard_metrics
    return {} unless current_user.lawyer_profile
    
    lawyer = current_user.lawyer_profile
    
    {
      leads: {
        total: lawyer.assigned_leads.count,
        new_this_week: lawyer.assigned_leads.where('created_at >= ?', 1.week.ago).count,
        converted: lawyer.assigned_leads.where(status: :converted).count,
        conversion_rate: calculate_conversion_rate(lawyer)
      },
      appointments: {
        total: lawyer.appointments.count,
        upcoming: lawyer.appointments.where('appointment_date >= ?', Time.current).count,
        this_week: lawyer.appointments.where('appointment_date >= ? AND appointment_date <= ?', 
                          Time.current.beginning_of_week, 
                          Time.current.end_of_week).count,
        completed_this_month: lawyer.appointments.where('appointment_date >= ? AND status = ?', 
                                     1.month.ago.beginning_of_month, 'completed').count
      },
      messages: {
        total: lawyer.contact_messages.count,
        unread: lawyer.contact_messages.where(status: [:pending, :sent]).count,
        this_week: lawyer.contact_messages.where('created_at >= ?', 1.week.ago).count
      },
      profile: {
        views: calculate_profile_views(lawyer),
        contacts_this_month: calculate_contacts_this_month(lawyer),
        avg_rating: lawyer.avg_rating || 0,
        total_reviews: lawyer.total_reviews || 0
      },
      revenue: {
        estimated_this_month: calculate_estimated_revenue(lawyer),
        estimated_total: calculate_total_revenue(lawyer)
      }
    }
  end

  def calculate_conversion_rate(lawyer)
    total = lawyer.assigned_leads.count
    return 0 if total == 0
    converted = lawyer.assigned_leads.where(status: :converted).count
    ((converted.to_f / total) * 100).round(2)
  end

  def calculate_profile_views(lawyer)
    # Placeholder - would integrate with analytics service
    0
  end

  def calculate_contacts_this_month(lawyer)
    lawyer.contact_messages.where('created_at >= ?', 1.month.ago.beginning_of_month).count
  end

  def calculate_estimated_revenue(lawyer)
    lawyer.appointments
          .where('appointment_date >= ?', 1.month.ago.beginning_of_month)
          .where.not(fee_amount: nil)
          .sum('fee_amount')
  end

  def calculate_total_revenue(lawyer)
    lawyer.appointments
          .where.not(fee_amount: nil)
          .sum('fee_amount')
  end

  def lead_json(lead)
    {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      job_title: lead.job_title,
      source: lead.source,
      status: lead.status,
      score: lead.score,
      specialty_interest: lead.specialty_interest,
      estimated_case_value: lead.estimated_case_value,
      engagement_level: lead.engagement_level,
      created_at: lead.created_at.iso8601,
      last_contacted_at: lead.last_contacted_at&.iso8601
    }
  end

  def appointment_json(appointment)
    {
      id: appointment.id,
      client_name: appointment.client_name,
      client_email: appointment.client_email,
      client_phone: appointment.client_phone,
      appointment_date: appointment.appointment_date.iso8601,
      appointment_type: appointment.appointment_type,
      status: appointment.status,
      fee_amount: appointment.fee_amount,
      notes: appointment.notes,
      meeting_link: appointment.meeting_link
    }
  end

  def message_json(message)
    {
      id: message.id,
      client_name: message.client_name,
      client_email: message.client_email,
      client_phone: message.client_phone,
      message: message.message,
      case_type: message.case_type,
      status: message.status,
      created_at: message.created_at.iso8601
    }
  end

  def pagination_json(collection)
    {
      current_page: collection.current_page,
      total_pages: collection.total_pages,
      total_count: collection.total_count,
      per_page: collection.limit_value
    }
  end
end
