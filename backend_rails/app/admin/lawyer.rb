# Active Admin for Lawyers

# Forçar carregamento do modelo base e do modelo específico antes do registro
require_dependency Rails.root.join('app', 'models', 'application_record').to_s
require_dependency Rails.root.join('app', 'models', 'lawyer').to_s

ActiveAdmin.register "Lawyer" do
  permit_params :full_name, :oab_number, :oab_state, :city, :state, 
                :bio, :years_experience, :hourly_rate_min, :hourly_rate_max,
                :is_verified, :avg_rating, :total_reviews, :office_id,
                specialty_ids: []

  index do
    selectable_column
    id_column
    column :full_name
    column :oab_number
    column :oab_state
    column :city
    column :state
    column :is_verified
    column :avg_rating
    column :office
    actions
  end

  filter :full_name
  filter :oab_number
  filter :city
  filter :state
  filter :is_verified
  filter :office
  filter :created_at

  form do |f|
    f.inputs "Dados do Advogado" do
      f.input :full_name
      f.input :oab_number
      f.input :oab_state
      f.input :city
      f.input :state
      f.input :bio
      f.input :years_experience
      f.input :hourly_rate_min
      f.input :hourly_rate_max
      f.input :is_verified
      f.input :office, as: :select, collection: Office.all.map { |o| [o.trade_name, o.id] }
      f.input :specialties, as: :check_boxes, collection: Specialty.all.map { |s| [s.name, s.id] }
    end
    f.actions
  end
end