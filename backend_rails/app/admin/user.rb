ActiveAdmin.register User do
  menu label: "Membros", priority: 2

  # Index page
  index do
    selectable_column
    id_column

    column :email do |user|
      div class: "font-semibold" do
        link_to user.email, admin_user_path(user)
      end
      div class: "text-sm text-gray-500" do
        "#{user.first_name} #{user.last_name}" if user.first_name || user.last_name
      end
    end

    column :role do |user|
      status_tag user.role, class: user.role
    end

    column :member_status do |user|
      status_tag user.member_status, class: user.member_status
    end

    column :plan_type do |user|
      badge_class = case user.plan_type
                    when 'enterprise' then 'bg-purple-100 text-purple-800'
                    when 'escritorio' then 'bg-blue-100 text-blue-800'
                    when 'pro' then 'bg-green-100 text-green-800'
                    else 'bg-gray-100 text-gray-800'
                    end
      span class: "px-2 py-1 rounded #{badge_class}" do
        user.plan_type.humanize
      end
    end

    column :last_login_at
    column :login_count
    column :created_at
    actions
  end

  # Filters
  filter :email
  filter :first_name
  filter :last_name
  filter :phone
  filter :role, as: :select, collection: User.roles.keys.map { |r| [r.humanize, r] }
  filter :member_status, as: :select, collection: User.member_statuses.keys.map { |s| [s.humanize, s] }
  filter :last_login_at
  filter :login_count
  filter :created_at

  # Show page
  show do
    attributes_table do
      row :email
      row :first_name
      row :last_name
      row :phone
      row :role
      row :member_status
      
      panel "Informações de Membro" do
        attributes_table_for user do
          row "Plano Atual" do |u| u.plan_type.humanize end
          row "Status do Membro" do |u| u.member_status.humanize end
          row "Início da Assinatura" do |u| u.subscription&.current_period_start end
          row "Fim da Assinatura" do |u| u.subscription&.current_period_end end
          row "Trial Até" do |u| u.trial_ends_at || "N/A" end
          row "Último Login" do |u| u.last_login_at || "Nunca" end
          row "Total de Logins" do |u| u.login_count || 0 end
        end
      end

      panel "Uso de Recursos" do
        attributes_table_for user do
          row "Contatos Usados" do |u| 
            # This would need a contacts table - placeholder for now
            "0 / #{u.contacts_limit}"
          end
          row "Armazenamento" do |u| 
            used_mb = u.storage_used_mb || 0
            limit_mb = u.storage_limit_mb
            "#{(used_mb / 1024.0).round(2)} / #{(limit_mb / 1024.0).round(2)} GB"
          end
          row "API Calls este Mês" do |u| 
            "#{u.api_calls_this_month || 0} / #{u.api_calls_limit}"
          end
        end
      end

      row :lawyer_profile do |user|
        user.lawyer_profile ? link_to(user.lawyer_profile.full_name, admin_lawyer_path(user.lawyer_profile)) : "N/A"
      end
      row :subscription do |user|
        user.subscription ? link_to("Assinatura ##{user.subscription.id}", admin_subscription_path(user.subscription)) : "N/A"
      end
      row :created_at
      row :updated_at
    end

    panel "Agendamentos (#{user.appointments.count})" do
      table_for user.appointments.order(appointment_date: :desc).limit(10) do
        column :id
        column :lawyer do |apt| apt.lawyer.full_name end
        column :appointment_date
        column :status
        column :appointment_type
        column "" do |apt|
          link_to "Ver", admin_appointment_path(apt)
        end
      end
      if user.appointments.count > 10
        div do
          link_to "Ver Todos os Agendamentos", admin_appointments_path(q: { client_id_eq: user.id })
        end
      end
    end

    if user.lawyer_profile
      panel "Perfil de Advogado" do
        attributes_table_for user.lawyer_profile do
          row :full_name
          row :oab_number
          row :oab_state
          row :city
          row :state
          row :years_experience
          row :is_verified
        end
      end
    end
  end

  # Form
  form do |f|
    f.inputs "Informações do Usuário" do
      f.input :email
      f.input :password, hint: f.object.new_record? ? "Mínimo 6 caracteres" : "Deixe em branco para manter a senha atual"
      f.input :first_name
      f.input :last_name
      f.input :phone
      f.input :role, as: :select
    end

    f.inputs "Status de Membro" do
      f.input :member_status, as: :select
      f.input :trial_ends_at, as: :datetime_picker
      f.input :last_login_at, as: :datetime_picker
      f.input :login_count
    end

    f.inputs "Uso de Recursos" do
      f.input :storage_used_mb
      f.input :api_calls_this_month
    end

    f.actions
  end

  # Custom actions
  member_action :update_last_login, method: :put do
    resource.update_last_login
    redirect_to admin_user_path(resource), notice: "Último login atualizado."
  end

  member_action :suspend, method: :put do
    resource.update(member_status: :suspended)
    redirect_to admin_user_path(resource), notice: "Usuário suspenso."
  end

  member_action :activate, method: :put do
    resource.update(member_status: :active)
    redirect_to admin_user_path(resource), notice: "Usuário ativado."
  end

  member_action :set_trial, method: :put do
    trial_ends = params[:trial_ends_at] || 30.days.from_now
    resource.update(member_status: :trial, trial_ends_at: trial_ends)
    redirect_to admin_user_path(resource), notice: "Período de trial definido até #{trial_ends}."
  end

  member_action :expire, method: :put do
    resource.update(member_status: :expired)
    redirect_to admin_user_path(resource), notice: "Usuário marcado como expirado."
  end

  collection_action :metrics do
    @metrics = User.member_metrics
    render 'admin/users/metrics'
  end
end
