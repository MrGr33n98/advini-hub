ActiveAdmin.register Lead do
  menu label: "Leads", priority: 2

  # Index page
  index do
    selectable_column
    id_column

    column :name do |lead|
      div class: "flex items-center gap-2" do
        avatar = lead.name.first
        div class: "font-semibold" do
          link_to lead.name, admin_lead_path(lead)
        end
        div class: "text-sm text-gray-500" do
          lead.email
        end
      end
    end

    column :score do |lead|
      color = lead.score >= 80 ? 'green' : lead.score >= 60 ? 'yellow' : lead.score >= 40 ? 'orange' : 'red'
      span class: "px-2 py-1 rounded bg-#{color}-100 text-#{color}-800 font-semibold" do
        "#{lead.score}/100"
      end
    end

    column :status do |lead|
      status_tag lead.status, class: lead.status
    end

    column :source
    column :specialty_interest
    column :engagement_level

    column :estimated_case_value do |lead|
      number_to_currency(lead.estimated_case_value || 0, unit: "R$", separator: ",", delimiter: ".")
    end

    column :email_stats do |lead|
      "📧 #{lead.email_opened_count} abertos, #{lead.email_clicked_count} cliques"
    end

    column :created_at
    actions
  end

  # Filters
  filter :name
  filter :email
  filter :company
  filter :source, as: :select, collection: Lead.sources.keys.map { |s| [s.humanize, s] }
  filter :status, as: :select, collection: Lead.statuses.keys.map { |s| [s.humanize, s] }
  filter :engagement_level, as: :select, collection: Lead.engagement_levels.keys.map { |s| [s.humanize, s] }
  filter :score, as: :numeric
  filter :specialty_interest
  filter :location_city
  filter :location_state
  filter :created_at

  # Show page
  show do
    attributes_table do
      row :name
      row :email
      row :phone
      row :company
      row :job_title
      row :source
      row :status
      row :engagement_level
      
      row :score do |lead|
        span class: "text-2xl font-bold #{lead.score >= 80 ? 'text-green-600' : lead.score >= 60 ? 'text-yellow-600' : 'text-red-600'}" do
          "#{lead.score}/100"
        end
      end

      panel "Score Factors" do
        attributes_table_for lead do
          row "Demográfico" do |l| "#{l.demographic_score}/30" end
          row "Comportamental" do |l| "#{l.behavioral_score}/30" end
          row "Firmográfico" do |l| "#{l.firmographic_score}/20" end
          row "Intenção" do |l| "#{l.intent_score}/20" end
          row "Engajamento" do |l| "#{l.engagement_score}/100" end
          row "Recência" do |l| "#{l.recency_score}/100" end
        end
      end

      row :specialty_interest
      row :estimated_case_value do |lead|
        number_to_currency(lead.estimated_case_value || 0, unit: "R$", separator: ",", delimiter: ".")
      end
      
      row "Localização" do |lead|
        "#{lead.location_city}, #{lead.location_state} - #{lead.location_country}"
      end

      row :tags do |lead|
        lead.tags.map { |tag| span class: "px-2 py-1 bg-blue-100 text-blue-800 rounded mr-1", style: "display: inline-block; margin: 2px;" do tag end }.join.html_safe
      end

      row :notes
      row :assigned_lawyer
      row :email_stats do |lead|
        "#{lead.email_opened_count} abertos, #{lead.email_clicked_count} cliques"
      end
      row :last_email_opened_at
      row :last_contacted_at
      row :converted_at
      row :conversion_value
      row :created_at
      row :updated_at
    end

    panel "Atividades do Lead" do
      table_for lead.activities.order(occurred_at: :desc).limit(10) do
        column :activity_type
        column :description
        column :occurred_at
      end
      div do
        link_to "Ver Todas as Atividades", admin_lead_activities_path(lead)
      end
    end
  end

  # Form
  form do |f|
    f.inputs "Informações do Lead" do
      f.input :name
      f.input :email
      f.input :phone
      f.input :company
      f.input :job_title
      f.input :source, as: :select
      f.input :status, as: :select
      f.input :engagement_level, as: :select
    end

    f.inputs "Score do Lead" do
      f.input :score
      f.input :demographic_score, hint: "0-30 pontos"
      f.input :behavioral_score, hint: "0-30 pontos"
      f.input :firmographic_score, hint: "0-20 pontos"
      f.input :intent_score, hint: "0-20 pontos"
      f.input :engagement_score, hint: "0-100 pontos"
      f.input :recency_score, hint: "0-100 pontos"
    end

    f.inputs "Detalhes" do
      f.input :specialty_interest
      f.input :estimated_case_value
      f.input :location_city
      f.input :location_state
      f.input :location_country
      f.input :tags, input_html: { value: f.object.tags.join(', ') }, hint: "Separado por vírgulas"
      f.input :notes, as: :text
      f.input :assigned_lawyer, collection: Lawyer.all.map { |l| [l.full_name, l.id] }, include_blank: true
    end

    f.inputs "Métricas de Email" do
      f.input :email_opened_count
      f.input :email_clicked_count
      f.input :last_email_opened_at, as: :datetime_picker
      f.input :last_contacted_at, as: :datetime_picker
      f.input :converted_at, as: :datetime_picker
      f.input :conversion_value
    end

    f.actions
  end

  # Custom actions
  member_action :mark_as_contacted, method: :put do
    resource.mark_as_contacted
    redirect_to admin_lead_path(resource), notice: "Lead marcado como contatado."
  end

  member_action :mark_as_converted, method: :put do
    resource.mark_as_converted
    redirect_to admin_lead_path(resource), notice: "Lead marcado como convertido."
  end

  member_action :recalculate_score, method: :put do
    resource.calculate_score
    redirect_to admin_lead_path(resource), notice: "Score recalculado com sucesso."
  end

  # Dashboard
  controller do
    def index
      super
    end

    def show
      super
    end
  end
end
