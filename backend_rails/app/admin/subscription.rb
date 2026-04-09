ActiveAdmin.register Subscription do
  menu label: "Assinaturas", priority: 4

  # Index page
  index do
    selectable_column
    id_column

    column :user do |sub|
      link_to sub.user.email, admin_user_path(sub.user)
    end

    column :plan do |sub|
      link_to sub.plan.name, admin_plan_path(sub.plan)
    end

    column :status do |sub|
      status_tag sub.status, class: sub.status
    end

    column :amount do |sub|
      number_to_currency(sub.amount || sub.plan.price_monthly, unit: "R$", separator: ",", delimiter: ".")
    end

    column :current_period_end
    column :cancel_at_period_end do |sub|
      status_tag sub.cancel_at_period_end ? "Sim" : "Não"
    end

    column :trial_end
    column :created_at
    actions
  end

  # Filters
  filter :status, as: :select, collection: Subscription.statuses.keys.map { |s| [s.humanize, s] }
  filter :plan
  filter :user, as: :select, collection: User.all.map { |u| [u.email, u.id] }
  filter :amount
  filter :current_period_start
  filter :current_period_end
  filter :trial_start
  filter :trial_end
  filter :created_at

  # Show page
  show do
    attributes_table do
      row :user do |sub|
        link_to sub.user.email, admin_user_path(sub.user)
      end
      row :plan do |sub|
        link_to sub.plan.name, admin_plan_path(sub.plan)
      end
      row :status
      row :amount do |sub|
        number_to_currency(sub.amount || 0, unit: "R$", separator: ",", delimiter: ".")
      end
      row :currency
      row :payment_method
      row :current_period_start
      row :current_period_end
      row :cancel_at_period_end
      row :canceled_at
      row :trial_start
      row :trial_end
      row :last_payment_date
      row :next_payment_date
      row :stripe_subscription_id
      row :stripe_customer_id
      row :created_at
      row :updated_at

      row "Dias até Renovação" do |sub|
        if sub.current_period_end
          days = sub.days_until_renewal
          days ? "#{days} dias" : "N/A"
        else
          "N/A"
        end
      end
    end

    panel "Detalhes do Usuário" do
      attributes_table_for subscription.user do
        row :email
        row :first_name
        row :last_name
        row :role
        row :member_status
        row :last_login_at
        row :login_count
      end
    end

    panel "Detalhes do Plano" do
      attributes_table_for subscription.plan do
        row :name
        row :price_monthly
        row :price_yearly
        row :max_contacts_per_month
        row :max_lawyers
        row :max_storage_gb
      end
    end
  end

  # Form
  form do |f|
    f.inputs "Informações da Assinatura" do
      f.input :user, collection: User.all.map { |u| [u.email, u.id] }
      f.input :plan, collection: Plan.active.map { |p| [p.name, p.id] }
      f.input :status, as: :select
      f.input :amount
      f.input :currency
      f.input :payment_method
    end

    f.inputs "Período" do
      f.input :current_period_start, as: :datetime_picker
      f.input :current_period_end, as: :datetime_picker
      f.input :cancel_at_period_end
      f.input :canceled_at, as: :datetime_picker
    end

    f.inputs "Trial" do
      f.input :trial_start, as: :datetime_picker
      f.input :trial_end, as: :datetime_picker
    end

    f.inputs "Pagamentos" do
      f.input :last_payment_date, as: :datetime_picker
      f.input :next_payment_date, as: :datetime_picker
    end

    f.inputs "Stripe" do
      f.input :stripe_subscription_id
      f.input :stripe_customer_id
    end

    f.actions
  end

  # Custom actions
  member_action :cancel_at_period_end, method: :put do
    resource.cancel_at_period_end!
    redirect_to admin_subscription_path(resource), notice: "Assinatura será cancelada ao final do período."
  end

  member_action :reactivate, method: :put do
    resource.reactivate!
    redirect_to admin_subscription_path(resource), notice: "Assinatura reativada com sucesso."
  end

  member_action :mark_as_canceled, method: :put do
    resource.mark_as_canceled!
    redirect_to admin_subscriptions_path, notice: "Assinatura cancelada."
  end

  member_action :mark_as_past_due, method: :put do
    resource.mark_as_past_due!
    redirect_to admin_subscription_path(resource), notice: "Assinatura marcada como em atraso."
  end
end
