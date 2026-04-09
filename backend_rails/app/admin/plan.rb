ActiveAdmin.register Plan do
  menu label: "Planos SaaS", priority: 3

  # Index page
  index do
    selectable_column
    id_column

    column :name do |plan|
      div class: "font-semibold" do
        link_to plan.name, admin_plan_path(plan)
      end
      if plan.is_popular
        span class: "ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded", style: "display: inline-block; margin-top: 4px;" do
          "Popular"
        end
      end
    end

    column :slug
    column :price_monthly do |plan|
      number_to_currency(plan.price_monthly, unit: "R$", separator: ",", delimiter: ".")
    end

    column :price_yearly do |plan|
      number_to_currency(plan.price_yearly, unit: "R$", separator: ",", delimiter: ".")
    end

    column :is_active do |plan|
      status_tag plan.is_active ? "Ativo" : "Inativo", class: plan.is_active ? "active" : "inactive"
    end

    column :max_contacts_per_month
    column :max_lawyers
    column :subscriptions_count do |plan|
      plan.subscriptions.count
    end

    column :display_order
    actions
  end

  # Filters
  filter :name
  filter :slug
  filter :is_active, as: :select, collection: [['Ativos', true], ['Inativos', false]]
  filter :is_popular, as: :select, collection: [['Populares', true], ['Não Populares', false]]
  filter :price_monthly
  filter :display_order
  filter :created_at

  # Show page
  show do
    attributes_table do
      row :name
      row :slug
      row :description
      row :price_monthly do |plan|
        number_to_currency(plan.price_monthly, unit: "R$", separator: ",", delimiter: ".")
      end
      row :price_yearly do |plan|
        number_to_currency(plan.price_yearly, unit: "R$", separator: ",", delimiter: ".")
      end
      row :currency
      row :is_active
      row :is_popular
      row :display_order

      panel "Limites do Plano" do
        attributes_table_for plan do
          row "Contatos/mês" do |p| p.max_contacts_per_month || "Ilimitado" end
          row "Especialidades" do |p| p.max_specialties || "Ilimitado" end
          row "Advogados" do |p| p.max_lawyers || "Ilimitado" end
          row "Armazenamento" do |p| "#{p.max_storage_gb || 'Ilimitado'} GB" end
          row "API calls/mês" do |p| p.max_api_calls_per_month || "Ilimitado" end
        end
      end

      panel "Recursos" do
        attributes_table_for plan do
          row "Analytics" do |p| status_tag p.has_analytics ? "Sim" : "Não" end
          row "Blog Access" do |p| status_tag p.has_blog_access ? "Sim" : "Não" end
          row "Suporte Prioritário" do |p| status_tag p.has_priority_support ? "Sim" : "Não" end
          row "API Access" do |p| status_tag p.has_api_access ? "Sim" : "Não" end
          row "Branding Customizado" do |p| status_tag p.has_custom_branding ? "Sim" : "Não" end
          row "White Label" do |p| status_tag p.has_white_label ? "Sim" : "Não" end
        end
      end

      row :stripe_price_id_monthly
      row :stripe_price_id_yearly
      row :created_at
      row :updated_at
    end

    panel "Assinaturas deste Plano (#{plan.subscriptions.count})" do
      table_for plan.subscriptions.order(created_at: :desc).limit(10) do
        column :id
        column :user do |sub| sub.user.email end
        column :status
        column :amount
        column :current_period_end
        column :created_at
        column "" do |sub|
          link_to "Ver", admin_subscription_path(sub)
        end
      end
      div do
        link_to "Ver Todas as Assinaturas", admin_subscriptions_path(q: { plan_id_eq: plan.id })
      end
    end
  end

  # Form
  form do |f|
    f.inputs "Informações do Plano" do
      f.input :name
      f.input :slug, hint: "Apenas letras minúsculas, números, hífens e underscores"
      f.input :description, as: :text
      f.input :price_monthly
      f.input :price_yearly
      f.input :currency
      f.input :is_active
      f.input :is_popular
      f.input :display_order
    end

    f.inputs "Limites" do
      f.input :max_contacts_per_month
      f.input :max_specialties
      f.input :max_lawyers
      f.input :max_storage_gb
      f.input :max_api_calls_per_month
    end

    f.inputs "Recursos" do
      f.input :has_analytics, as: :boolean
      f.input :has_blog_access, as: :boolean
      f.input :has_priority_support, as: :boolean
      f.input :has_api_access, as: :boolean
      f.input :has_custom_branding, as: :boolean
      f.input :has_white_label, as: :boolean
    end

    f.inputs "Integração Stripe" do
      f.input :stripe_price_id_monthly
      f.input :stripe_price_id_yearly
    end

    f.actions
  end

  # Custom actions
  member_action :duplicate, method: :post do
    new_plan = resource.dup
    new_plan.name = "#{resource.name} (Cópia)"
    new_plan.slug = "#{resource.slug}-copy"
    new_plan.save
    redirect_to admin_plan_path(new_plan), notice: "Plano duplicado com sucesso."
  end

  collection_action :metrics do
    @metrics = Plan.metrics
    render 'admin/plans/metrics'
  end
end
