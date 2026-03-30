# Active Admin Configuration for Specialties
# Forçar carregamento do modelo antes do registro
require_dependency Rails.root.join('app', 'models', 'specialty').to_s

ActiveAdmin.register "Specialty" do
  permit_params :name, :description, :parent_id, :slug

  index do
    selectable_column
    id_column
    column :name
    column :description
    column :parent
    column :slug
    actions
  end

  filter :name
  filter :description
  filter :parent
  filter :created_at

  form do |f|
    f.inputs "Especialidade" do
      f.input :name
      f.input :description
      f.input :parent, as: :select, collection: Specialty.all.reject { |s| s.id == f.object.try(:id) }.map { |s| [s.name, s.id] }
      f.input :slug
    end
    f.actions
  end
end