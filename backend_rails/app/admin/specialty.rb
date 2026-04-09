ActiveAdmin.register Specialty do
  menu label: "Categorias"
  
  permit_params :name, :description, :parent_id, :slug, :icon, :color, :position, :is_active

  index do
    selectable_column
    id_column
    column :name do |spec|
      link_to spec.name, admin_specialty_path(spec)
    end
    column :description do |spec|
      truncate(spec.description, length: 50)
    end
    column :icon
    column :color do |specialty|
      div style: "background-color: #{specialty.color}; width: 30px; height: 30px; border-radius: 3px; border: 1px solid #ccc;" do
        " "
      end
    end
    column :position
    column :is_active do |spec|
      status_tag(spec.is_active? ? "Ativo" : "Inativo")
    end
    column "Advogados" do |spec|
      spec.lawyers.count
    end
    column :created_at
    actions
  end

  filter :name
  filter :description
  filter :icon
  filter :is_active
  filter :created_at

  form do |f|
    f.inputs "Categoria/Especialidade" do
      f.input :name, label: "Nome da Categoria", required: true, hint: "Ex: Direito Civil, Direito Trabalhista"
      f.input :description, as: :text, label: "Descrição", required: true, hint: "Descreva a categoria jurídica"
      f.input :icon, label: "Ícone", required: true, hint: "Ex: scales, shield, briefcase, home, briefcase-open, scale, document, building-2, leaf, user-check, zap, shield-check, activity, tree"
      f.input :color, as: :color, label: "Cor para UI", required: true, hint: "Escolha uma cor que represente a categoria"
      f.input :position, as: :number, label: "Posição", required: true, hint: "Define a ordem de exibição (1, 2, 3...)"
      f.input :is_active, as: :boolean, label: "Categoria Ativa?"
      f.input :parent, as: :select, 
              collection: Specialty.where.not(id: f.object.try(:id)).alphabetical.map { |s| [s.name, s.id] },
              label: "Categoria Pai (opcional)", 
              hint: "Use apenas se esta for uma subcategoria"
    end
    f.actions
  end
  
  show do |spec|
    attributes_table do
      row :id
      row :name
      row :description
      row :icon
      row :color do |s|
        span style: "background-color: #{s.color}; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;" do
          s.color
        end
      end
      row :slug
      row :position
      row :is_active do
        status_tag(spec.is_active? ? "Ativo" : "Inativo")
      end
      row "Total de Advogados" do
        spec.lawyers.count
      end
      row :created_at
      row :updated_at
    end
    
    panel "Advogados nesta Categoria" do
      if spec.lawyers.any?
        table_for(spec.lawyers) do
          column("Nome") { |lawyer| link_to lawyer.full_name, admin_lawyer_path(lawyer) }
          column("OAB") { |lawyer| lawyer.oab_number }
          column("Cidade") { |lawyer| lawyer.city }
        end
      else
        para "Nenhum advogado nesta categoria ainda"
      end
    end
  end
  
  # Ações customizadas
  action_item :view_lawyers, only: :show do
    link_to "Ver Advogados", admin_lawyers_path(q: { specialties_id_eq: resource.id })
  end
end
