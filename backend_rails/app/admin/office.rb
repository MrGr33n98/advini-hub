# Active Admin Configuration for Offices

# Forçar carregamento do modelo base e do modelo específico antes do registro
require_dependency Rails.root.join('app', 'models', 'application_record').to_s
require_dependency Rails.root.join('app', 'models', 'office').to_s

ActiveAdmin.register "Office" do
  permit_params :trade_name, :city, :state, :lawyer_count, :logo_url

  index do
    selectable_column
    id_column
    column :trade_name
    column :city
    column :state
    column :lawyer_count
    column :logo_url
    actions
  end

  filter :trade_name
  filter :city
  filter :state
  filter :created_at

  form do |f|
    f.inputs "Dados do Escritório" do
      f.input :trade_name
      f.input :city
      f.input :state
      f.input :lawyer_count
      f.input :logo_url
    end
    f.actions
  end
end