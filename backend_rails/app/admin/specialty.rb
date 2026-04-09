ActiveAdmin.register Specialty do
  permit_params :name, :description, :parent_id, :slug, :icon, :color, :position, :is_active

  index do
    selectable_column
    id_column
    column :name
    column :description
    column :icon
    column :color do |specialty|
      div style: "background-color: #{specialty.color}; width: 30px; height: 30px; border-radius: 3px; border: 1px solid #ccc;"
    end
    column :position
    column :is_active
    column :created_at
    actions
  end

  filter :name
  filter :description
  filter :icon
  filter :is_active
  filter :created_at

  form do |f|
    f.inputs "Especialidade" do
      f.input :name, label: "Nome da Especialidade", required: true
      f.input :description, as: :text, label: "Descrição", required: true
      f.input :icon, label: "Ícone (ex: scales, briefcase, shield)", required: true
      f.input :color, as: :color, label: "Cor (ex: #FF5733)", required: true
      f.input :position, as: :number, label: "Posição", required: true
      f.input :is_active, as: :boolean, label: "Ativo"
      f.input :parent, as: :select, 
              collection: Specialty.all.reject { |s| s.id == f.object.try(:id) }.map { |s| [s.name, s.id] },
              label: "Especialidade Pai (opcional)"
    end
    f.actions
  end
end