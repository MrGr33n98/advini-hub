ActiveAdmin.register SponsoredCampaign do
  menu label: "Patrocinados", priority: 5

  # Index page
  index do
    selectable_column
    id_column

    column :campaign_name do |campaign|
      link_to campaign.campaign_name, admin_sponsored_campaign_path(campaign)
    end

    column :sponsor do |campaign|
      div class: "font-semibold" do
        campaign.sponsor_name
      end
      div class: "text-sm text-gray-500" do
        campaign.sponsor_email
      end
    end

    column :campaign_type
    column :status do |campaign|
      status_tag campaign.status, class: campaign.status
    end

    column :budget do |campaign|
      spent = campaign.budget_spent || 0
      total = campaign.budget_total || 0
      "#{number_to_currency(spent, unit: 'R$', separator: ',', delimiter: '.')} / #{number_to_currency(total, unit: 'R$', separator: ',', delimiter: '.')}"
    end

    column :impressions
    column :clicks
    column :ctr do |campaign|
      "#{campaign.ctr}%"
    end

    column :conversions
    column :start_date
    actions
  end

  # Filters
  filter :campaign_name
  filter :sponsor_name
  filter :sponsor_email
  filter :campaign_type, as: :select, collection: SponsoredCampaign.campaign_types.keys.map { |t| [t.humanize, t] }
  filter :status, as: :select, collection: SponsoredCampaign.statuses.keys.map { |s| [s.humanize, s] }
  filter :billing_type, as: :select, collection: SponsoredCampaign.billing_types.keys.map { |b| [b.humanize, b] }
  filter :budget_total
  filter :impressions
  filter :clicks
  filter :start_date
  filter :end_date
  filter :created_at

  # Show page
  show do
    attributes_table do
      row :campaign_name
      row :sponsor_type
      row :sponsor_name
      row :sponsor_email
      row :campaign_type
      row :status
      row :billing_type
      row :schedule_type

      panel "Orçamento" do
        attributes_table_for campaign do
          row "Total" do |c| number_to_currency(c.budget_total || 0, unit: "R$", separator: ",", delimiter: ".") end
          row "Gasto" do |c| number_to_currency(c.budget_spent || 0, unit: "R$", separator: ",", delimiter: ".") end
          row "Restante" do |c| number_to_currency(c.budget_remaining || 0, unit: "R$", separator: ",", delimiter: ".") end
          row "Custo por Clique" do |c| number_to_currency(c.cost_per_click || 0, unit: "R$", separator: ",", delimiter: ".") end
          row "Orçamento Diário" do |c| c.daily_budget ? number_to_currency(c.daily_budget, unit: "R$", separator: ",", delimiter: ".") : "N/A" end
          row "Porcentagem Gasta" do |c| "#{c.budget_percentage_used}%" end
        end
      end

      panel "Performance" do
        attributes_table_for campaign do
          row :impressions
          row :clicks
          row "CTR" do |c| "#{c.ctr}%" end
          row :conversions
          row "Taxa de Conversão" do |c| "#{c.conversion_rate}%" end
          row "Custo por Conversão" do |c| number_to_currency(c.cost_per_conversion || 0, unit: "R$", separator: ",", delimiter: ".") end
        end
      end

      panel "Targeting" do
        attributes_table_for campaign do
          row "Especialidades" do |c| c.target_specialties.join(", ") if c.target_specialties.present? end
          row "Localizações" do |c| c.target_locations.join(", ") if c.target_locations.present? end
          row "Palavras-chave" do |c| c.target_keywords.join(", ") if c.target_keywords.present? end
        end
      end

      panel "Agendamento" do
        attributes_table_for campaign do
          row :start_date
          row :end_date
          row "Dias Restantes" do |c| c.days_remaining ? "#{c.days_remaining} dias" : "N/A" end
        end
      end

      panel "Criativos" do
        row :banner_url do |c|
          c.banner_url ? link_to(c.banner_url, c.banner_url, target: '_blank') : "N/A"
        end
        row :landing_page_url do |c|
          c.landing_page_url ? link_to(c.landing_page_url, c.landing_page_url, target: '_blank') : "N/A"
        end
        row :custom_html
      end

      panel "Aprovação" do
        attributes_table_for campaign do
          row "Aprovado por" do |c| c.approved_by&.email end
          row :approved_at
          row :rejection_reason
        end
      end

      row :created_at
      row :updated_at
    end
  end

  # Form
  form do |f|
    f.inputs "Informações da Campanha" do
      f.input :campaign_name
      f.input :sponsor_type, as: :select, collection: [['Advogado', 'Lawyer'], ['Escritório', 'Office']]
      f.input :sponsor_name
      f.input :sponsor_email
      f.input :campaign_type, as: :select
      f.input :status, as: :select
      f.input :billing_type, as: :select
      f.input :schedule_type, as: :select
    end

    f.inputs "Orçamento" do
      f.input :budget_total
      f.input :budget_spent
      f.input :cost_per_click
      f.input :daily_budget
    end

    f.inputs "Targeting" do
      f.input :target_specialties, input_html: { value: f.object.target_specialties.join(', ') }, hint: "Separado por vírgulas"
      f.input :target_locations, input_html: { value: f.object.target_locations.join(', ') }, hint: "Separado por vírgulas"
      f.input :target_keywords, input_html: { value: f.object.target_keywords.join(', ') }, hint: "Separado por vírgulas"
    end

    f.inputs "Agendamento" do
      f.input :start_date, as: :datetime_picker
      f.input :end_date, as: :datetime_picker
    end

    f.inputs "Criativos" do
      f.input :banner_url
      f.input :landing_page_url
      f.input :custom_html, as: :text
    end

    f.actions
  end

  # Custom actions
  member_action :approve, method: :put do
    resource.approve!(current_admin_user)
    redirect_to admin_sponsored_campaign_path(resource), notice: "Campanha aprovada com sucesso."
  end

  member_action :reject, method: :put do
    reason = params[:rejection_reason] || "Motivo não informado"
    resource.reject!(reason)
    redirect_to admin_sponsored_campaign_path(resource), notice: "Campanha rejeitada."
  end

  member_action :pause, method: :put do
    resource.pause!
    redirect_to admin_sponsored_campaign_path(resource), notice: "Campanha pausada."
  end

  member_action :activate, method: :put do
    resource.activate!
    redirect_to admin_sponsored_campaign_path(resource), notice: "Campanha ativada."
  end

  member_action :complete, method: :put do
    resource.complete!
    redirect_to admin_sponsored_campaign_path(resource), notice: "Campanha completada."
  end

  member_action :cancel, method: :put do
    resource.cancel!
    redirect_to admin_sponsored_campaign_path(resource), notice: "Campanha cancelada."
  end

  collection_action :metrics do
    @metrics = SponsoredCampaign.metrics
    render 'admin/sponsored_campaigns/metrics'
  end
end
