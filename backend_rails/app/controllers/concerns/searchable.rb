# Add searchable concerns
module Searchable
  extend ActiveSupport::Concern

  def search_lawyers(query, filters = {})
    # Basic search implementation
    results = Lawyer.includes(:specialties, :office)
    
    if query.present?
      results = results.where(
        "full_name ILIKE ? OR bio ILIKE ?", 
        "%#{query}%", "%#{query}%"
      )
    end
    
    results = results.where(city: filters[:city]) if filters[:city].present?
    results = results.where(state: filters[:state]) if filters[:state].present?
    results = results.where("avg_rating >= ?", filters[:min_rating].to_f) if filters[:min_rating].present?
    
    if filters[:specialty].present?
      results = results.joins(:specialties).where(specialties: { name: filters[:specialty] })
    end
    
    results
  end
end
