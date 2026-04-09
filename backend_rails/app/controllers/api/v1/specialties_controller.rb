# API Controller for Specialties
class Api::V1::SpecialtiesController < ApplicationController
  def index
    @specialties = Specialty.all
    
    # Filter by parent category if specified
    if params[:parent_id].present?
      @specialties = @specialties.where(parent_id: params[:parent_id])
    else
      # Only show top-level categories by default
      @specialties = @specialties.where(parent_id: nil)
    end
    
    # Search by name
    if params[:search].present?
      @specialties = @specialties.where("name ILIKE ?", "%#{params[:search]}%")
    end
    
    render json: @specialties.map { |s| specialty_json(s) }
  end

  def show
    @specialty = Specialty.includes(children: :lawyers).find(params[:id])
    render json: specialty_with_children_json(@specialty)
  end

  private

  def specialty_json(specialty)
    {
      id: specialty.id,
      name: specialty.name,
      description: specialty.description,
      slug: specialty.slug,
      icon: specialty.icon,
      color: specialty.color,
      position: specialty.position,
      is_active: specialty.is_active,
      has_children: specialty.children.exists?,
      child_count: specialty.children.count
    }
  end
  
  def specialty_with_children_json(specialty)
    base_specialty = specialty_json(specialty)
    base_specialty.merge({
      children: specialty.children.map { |child| specialty_json(child) },
      lawyer_count: specialty.lawyers.count
    })
  end
end