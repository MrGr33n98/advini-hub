# Client Dashboard API Controller
class Api::V1::ClientDashboardController < ApplicationController
  before_action :authenticate_user!
  before_action :require_client_role

  # GET /api/v1/client/dashboard/metrics
  def metrics
    render json: client_metrics
  end

  # GET /api/v1/client/appointments
  def appointments
    @appointments = current_user.appointments
                                .order(appointment_date: :desc)
                                .page(params[:page])
                                .per(params[:per_page] || 20)
    
    render json: {
      data: @appointments.map { |apt| appointment_json(apt) },
      meta: pagination_json(@appointments)
    }
  end

  # GET /api/v1/client/messages
  def messages
    # Get messages where client sent to lawyers
    @messages = ContactMessage.where(sender_type: 'User', sender_id: current_user.id)
                              .order(created_at: :desc)
                              .page(params[:page])
                              .per(params[:per_page] || 20)
    
    render json: {
      data: @messages.map { |msg | message_json(msg) },
      meta: pagination_json(@messages)
    }
  end

  # GET /api/v1/client/favorites
  def favorites
    # Assuming favorites are stored elsewhere or need to be implemented
    render json: {
      data: [],
      meta: { total: 0 }
    }
  end

  # GET /api/v1/client/subscription
  def subscription
    @subscription = current_user.subscription
    
    if @subscription
      render json: subscription_json(@subscription)
    else
      render json: { subscription: nil }
    end
  end

  private

  def require_client_role
    unless current_user.role == 'client' || current_user.role == 'admin'
      render json: { error: 'Client role required' }, status: :forbidden
    end
  end

  def client_metrics
    {
      appointments: {
        total: current_user.appointments.count,
        upcoming: current_user.appointments.where('appointment_date >= ?', Time.current).count,
        completed: current_user.appointments.where(status: 'completed').count,
        next_appointment: next_appointment_json
      },
      messages: {
        total: ContactMessage.where(sender_type: 'User', sender_id: current_user.id).count,
        sent_this_month: ContactMessage.where(sender_type: 'User', sender_id: current_user.id)
                                       .where('created_at >= ?', 1.month.ago.beginning_of_month).count
      },
      subscription: {
        plan: current_user.subscription&.plan&.name || 'Grátis',
        status: current_user.subscription&.status || 'none',
        renewal_date: current_user.subscription&.current_period_end&.iso8601
      }
    }
  end

  def next_appointment_json
    next_apt = current_user.appointments
                           .where('appointment_date >= ?', Time.current)
                           .order(appointment_date: :asc)
                           .first
    
    return nil unless next_apt
    
    {
      id: next_apt.id,
      lawyer_name: next_apt.lawyer.full_name,
      appointment_date: next_apt.appointment_date.iso8601,
      appointment_type: next_apt.appointment_type,
      status: next_apt.status,
      meeting_link: next_apt.meeting_link
    }
  end

  def appointment_json(appointment)
    {
      id: appointment.id,
      lawyer: {
        id: appointment.lawyer.id,
        name: appointment.lawyer.full_name,
        photo_url: appointment.lawyer.photo.attached? ? url_for(appointment.lawyer.photo) : nil
      },
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
      lawyer: {
        id: message.lawyer.id,
        name: message.lawyer.full_name
      },
      message: message.message,
      case_type: message.case_type,
      status: message.status,
      created_at: message.created_at.iso8601
    }
  end

  def subscription_json(subscription)
    {
      id: subscription.id,
      plan: {
        id: subscription.plan.id,
        name: subscription.plan.name,
        slug: subscription.plan.slug,
        price_monthly: subscription.plan.price_monthly
      },
      status: subscription.status,
      current_period_start: subscription.current_period_start&.iso8601,
      current_period_end: subscription.current_period_end&.iso8601,
      cancel_at_period_end: subscription.cancel_at_period_end,
      trial_end: subscription.trial_end&.iso8601,
      amount: subscription.amount
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
