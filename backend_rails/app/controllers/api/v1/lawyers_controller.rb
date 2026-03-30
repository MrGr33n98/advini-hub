# Update the Lawyers API controller to include user association
class Api::V1::LawyersController < ApplicationController
  before_action :set_lawyer, only: [:show]

  def index
    @lawyers = Lawyer.includes(:specialties, :office).all

    # Apply filters
    @lawyers = @lawyers.where(city: params[:city]) if params[:city].present?
    @lawyers = @lawyers.where(state: params[:state]) if params[:state].present?
    @lawyers = @lawyers.joins(:specialties).where(specialties: { name: params[:specialty] }) if params[:specialty].present?

    if params[:min_rating].present?
      @lawyers = @lawyers.where('avg_rating >= ?', params[:min_rating].to_f)
    end

    if params[:search].present?
      @lawyers = @lawyers.where("full_name ILIKE ?", "%#{params[:search]}%")
    end

    # Count total BEFORE pagination
    total_count = @lawyers.count

    # Pagination
    page = (params[:page] || 1).to_i
    limit = (params[:limit] || 12).to_i
    offset = (page - 1) * limit

    @lawyers = @lawyers.limit(limit).offset(offset)

    render json: {
      data: @lawyers.map { |l| lawyer_json(l) },
      total: total_count,
      page: page,
      limit: limit,
      totalPages: (total_count.to_f / limit).ceil
    }
  end

  def show
    render json: lawyer_json(@lawyer)
  end

  private

  def set_lawyer
    @lawyer = Lawyer.includes(:specialties, :office, :reviews).find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Lawyer not found' }, status: :not_found
  end

  def lawyer_json(lawyer)
    {
      id: lawyer.id,
      full_name: lawyer.full_name,
      oab_number: lawyer.oab_number,
      oab_state: lawyer.oab_state,
      city: lawyer.city,
      state: lawyer.state,
      bio: lawyer.bio,
      years_experience: lawyer.years_experience,
      hourly_rate_min: lawyer.hourly_rate_min,
      hourly_rate_max: lawyer.hourly_rate_max,
      is_verified: lawyer.is_verified,
      avg_rating: lawyer.avg_rating,
      total_reviews: lawyer.total_reviews,
      photo_url: lawyer.photo.attached? ? url_for(lawyer.photo) : nil,
      specialties: lawyer.specialties.map { |s| specialty_json(s) },
      office: lawyer.office ? office_json(lawyer.office) : nil,
      has_account: lawyer.user.present?  # Indicates if lawyer has registered account
    }
  end

  def specialty_json(specialty)
    {
      id: specialty.id,
      name: specialty.name,
      description: specialty.description,
      slug: specialty.slug
    }
  end

  def office_json(office)
    {
      id: office.id,
      trade_name: office.trade_name,
      city: office.city,
      state: office.state,
      lawyer_count: office.lawyer_count,
      logo_url: office.logo_url
    }
  end
end