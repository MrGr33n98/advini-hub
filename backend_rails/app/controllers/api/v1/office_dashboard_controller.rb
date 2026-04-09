# Office Dashboard API Controller
class Api::V1::OfficeDashboardController < ApplicationController
  before_action :authenticate_user!
  before_action :require_office_access

  # GET /api/v1/office/dashboard/metrics
  def metrics
    render json: office_metrics
  end

  # GET /api/v1/office/lawyers
  def lawyers
    @lawyers = @office.lawyers
                      .includes(:specialties)
                      .page(params[:page])
                      .per(params[:per_page] || 20)
    
    render json: {
      data: @lawyers.map { |l| lawyer_json(l) },
      meta: pagination_json(@lawyers)
    }
  end

  # GET /api/v1/office/appointments
  def appointments
    @appointments = @office.appointments
                           .where('appointment_date >= ?', Time.current.beginning_of_day)
                           .order(appointment_date: :asc)
                           .page(params[:page])
                           .per(params[:per_page] || 20)
    
    render json: {
      data: @appointments.map { |apt| appointment_json(apt) },
      meta: pagination_json(@appointments)
    }
  end

  # GET /api/v1/office/campaigns
  def campaigns
    @campaigns = SponsoredCampaign.where(sponsor_type: 'Office', sponsor_id: @office.id)
                                  .order(created_at: :desc)
                                  .page(params[:page])
                                  .per(params[:per_page] || 10)
    
    render json: {
      data: @campaigns.map { |c| campaign_json(c) },
      meta: pagination_json(@campaigns)
    }
  end

  # GET /api/v1/office/revenue
  def revenue
    render json: {
      monthly_revenue: calculate_monthly_revenue,
      yearly_revenue: calculate_yearly_revenue,
      revenue_by_lawyer: revenue_by_lawyer,
      revenue_trend: revenue_trend
    }
  end

  private

  def require_office_access
    @office = current_user.lawyer_profile&.office
    
    unless @office
      render json: { error: 'Office access required' }, status: :forbidden
      return
    end
    
    # Check if user has permission to access office dashboard
    unless current_user.role == 'admin' || (@office.lawyers.map(&:user_id).include?(current_user.id))
      render json: { error: 'Insufficient permissions' }, status: :forbidden
    end
  end

  def office_metrics
    {
      office: {
        id: @office.id,
        name: @office.trade_name,
        city: @office.city,
        state: @office.state,
        total_lawyers: @office.lawyers.count,
        active_lawyers: @office.lawyers.joins(:appointments).distinct.count
      },
      lawyers: {
        total: @office.lawyers.count,
        verified: @office.lawyers.where(is_verified: true).count,
        avg_experience: @office.lawyers.average('years_experience').to_f.round(1)
      },
      appointments: {
        total: @office.appointments.count,
        this_month: @office.appointments.where('appointment_date >= ?', 1.month.ago.beginning_of_month).count,
        upcoming: @office.appointments.where('appointment_date >= ?', Time.current).count,
        completed_this_month: @office.appointments.where('appointment_date >= ? AND status = ?', 
                                      1.month.ago.beginning_of_month, 'completed').count
      },
      leads: {
        total: Lead.joins('INNER JOIN lawyers ON lawyers.id = leads.assigned_lawyer_id')
                   .where(lawyers: { office_id: @office.id }).count,
        new_this_week: Lead.joins('INNER JOIN lawyers ON lawyers.id = leads.assigned_lawyer_id')
                          .where(lawyers: { office_id: @office.id })
                          .where('leads.created_at >= ?', 1.week.ago).count,
        converted: Lead.joins('INNER JOIN lawyers ON lawyers.id = leads.assigned_lawyer_id')
                      .where(lawyers: { office_id: @office.id })
                      .where(status: :converted).count
      },
      campaigns: {
        active: SponsoredCampaign.where(sponsor_type: 'Office', sponsor_id: @office.id, status: :active).count,
        total_spent: SponsoredCampaign.where(sponsor_type: 'Office', sponsor_id: @office.id).sum('budget_spent'),
        total_impressions: SponsoredCampaign.where(sponsor_type: 'Office', sponsor_id: @office.id).sum('impressions'),
        total_clicks: SponsoredCampaign.where(sponsor_type: 'Office', sponsor_id: @office.id).sum('clicks')
      },
      revenue: {
        monthly: calculate_monthly_revenue,
        yearly: calculate_yearly_revenue
      }
    }
  end

  def calculate_monthly_revenue
    @office.appointments
           .where('appointment_date >= ?', 1.month.ago.beginning_of_month)
           .where.not(fee_amount: nil)
           .sum('fee_amount')
  end

  def calculate_yearly_revenue
    @office.appointments
           .where('appointment_date >= ?', 1.year.ago.beginning_of_year)
           .where.not(fee_amount: nil)
           .sum('fee_amount')
  end

  def revenue_by_lawyer
    @office.lawyers.map do |lawyer|
      {
        lawyer_id: lawyer.id,
        lawyer_name: lawyer.full_name,
        revenue: lawyer.appointments.where.not(fee_amount: nil).sum('fee_amount'),
        appointments_count: lawyer.appointments.count
      }
    end
  end

  def revenue_trend
    # Last 12 months
    (0..11).map do |i|
      month_start = i.months.ago.beginning_of_month
      month_end = i.months.ago.end_of_month
      
      revenue = @office.appointments
                       .where('appointment_date >= ? AND appointment_date <= ?', month_start, month_end)
                       .where.not(fee_amount: nil)
                       .sum('fee_amount')
      
      {
        month: month_start.strftime('%Y-%m'),
        revenue: revenue
      }
    end.reverse
  end

  def lawyer_json(lawyer)
    {
      id: lawyer.id,
      full_name: lawyer.full_name,
      oab_number: lawyer.oab_number,
      oab_state: lawyer.oab_state,
      city: lawyer.city,
      state: lawyer.state,
      years_experience: lawyer.years_experience,
      is_verified: lawyer.is_verified,
      avg_rating: lawyer.avg_rating,
      total_reviews: lawyer.total_reviews,
      specialties: lawyer.specialties.map { |s| { id: s.id, name: s.name } },
      appointments_count: lawyer.appointments.count,
      leads_count: lawyer.assigned_leads.count
    }
  end

  def appointment_json(appointment)
    {
      id: appointment.id,
      lawyer: {
        id: appointment.lawyer.id,
        name: appointment.lawyer.full_name
      },
      client_name: appointment.client_name,
      client_email: appointment.client_email,
      appointment_date: appointment.appointment_date.iso8601,
      appointment_type: appointment.appointment_type,
      status: appointment.status,
      fee_amount: appointment.fee_amount
    }
  end

  def campaign_json(campaign)
    {
      id: campaign.id,
      campaign_name: campaign.campaign_name,
      campaign_type: campaign.campaign_type,
      status: campaign.status,
      budget_total: campaign.budget_total,
      budget_spent: campaign.budget_spent,
      impressions: campaign.impressions,
      clicks: campaign.clicks,
      ctr: campaign.ctr,
      conversions: campaign.conversions,
      start_date: campaign.start_date&.iso8601,
      end_date: campaign.end_date&.iso8601
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
