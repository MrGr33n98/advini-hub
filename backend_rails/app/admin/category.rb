ActiveAdmin.register_page "Categories" do
  menu priority: 3, label: "Categorias"
  
  content title: "Gerenciar Categorias (Especialidades)" do
    div class: "blank_slate_container" do
      span class: "blank_slate" do
        h2 "Categorias de Especialidades Jurídicas"
        p "Gerencie as categorias de especialidades que seus advogados podem oferecer"
        
        div class: "actions" do
          link_to "Novo Categoria", admin_specialty_path, class: "button"
          link_to "Ver Todos", admin_specialties_path, class: "button"
        end
      end
    end
    
    # Stats sobre categorias
    columns do
      column do
        panel "Estatísticas" do
          ul do
            li "Total de Categorias: #{Specialty.count}"
            li "Categorias Ativas: #{Specialty.active.count}"
            li "Categorias com Advogados: #{Specialty.joins(:lawyers).distinct.count}"
          end
        end
      end
      
      column do
        panel "Top 5 Categorias Mais Populares" do
          if Specialty.joins(:lawyers).group(:id).order('COUNT(lawyers.id) DESC').limit(5).any?
            table_for(Specialty.joins(:lawyers).group(:id).order('COUNT(lawyers.id) DESC').limit(5)) do
              column("Categoria") { |spec| spec.name }
              column("Advogados") { |spec| spec.lawyers.count }
            end
          else
            para "Nenhuma categoria com advogados ainda"
          end
        end
      end
    end
    
    # Lista rápida de categorias
    panel "Todas as Categorias" do
      table_for(Specialty.alphabetical) do
        column("Nome") { |spec| link_to spec.name, admin_specialty_path(spec) }
        column("Descrição") { |spec| truncate(spec.description, length: 50) }
        column("Ícone") { |spec| spec.icon }
        column("Cor") do |spec|
          span style: "background-color: #{spec.color}; color: white; padding: 2px 8px; border-radius: 3px;" do
            spec.color
          end
        end
        column("Advogados") { |spec| spec.lawyers.count }
        column("Status") { |spec| status_tag(spec.is_active? ? "Ativo" : "Inativo") }
        column("Ações") do |spec|
          link_to "Editar", admin_specialty_path(spec), class: "button"
        end
      end
    end
  end
end
