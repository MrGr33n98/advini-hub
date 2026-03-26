# Update the Offices API controller
class Api::V1::OfficesController < ApplicationController
  def index
    @offices = Office.all
    
    # Apply filters
    @offices = @offices.where(city: params[:city]) if params[:city].present?
    @offices = @offices.where(state: params[:state]) if params[:state].present?
    
    # Pagination
    page = (params[:page] || 1).to_i
    limit = (params[:limit] || 12).to_i
    offset = (page - 1) * limit
    
    @offices = @offices.limit(limit).offset(offset)
    
    render json: {
      data: @offices.map { |o| office_json(o) },
      total: @offices.count,
      page: page,
      limit: limit,
      totalPages: (@offices.count.to_f / limit).ceil
    }
  end

  def show
    @office = Office.includes(:lawyers => [:specialties, :user]).find(params[:id])
    render json: office_with_lawyers_json(@office)
  end

  private

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
  
  def office_with_lawyers_json(office)
    base_office = office_json(office)
    base_office.merge({
      lawyers: office.lawyers.map { |l| 
        {
          id: l.id,
          full_name: l.full_name,
          avg_rating: l.avg_rating,
          specialties: l.specialties.map { |s| { id: s.id, name: s.name } },
          has_account: l.user.present?
        }
      }
    })
  end
end