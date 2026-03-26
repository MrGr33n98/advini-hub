# Update the admin dashboard
ActiveAdmin.register_page "Dashboard" do
  menu priority: 1, label: proc { I18n.t("active_admin.dashboard") }

  content title: proc { I18n.t("active_admin.dashboard") } do
    div class: "blank_slate_container", id: "dashboard_default_message" do
      span class: "blank_slate" do
        span I18n.t("active_admin.dashboard_welcome.welcome")
        small I18n.t("active_admin.dashboard_welcome.call_to_action")
      end
    end

    # Recent stats
    columns do
      column do
        panel "Estatísticas Gerais" do
          ul do
            li "Total de Advogados: #{Lawyer.count}"
            li "Total de Escritórios: #{Office.count}"
            li "Total de Agendamentos: #{Appointment.count}"
            li "Mensagens Pendentes: #{ContactMessage.unread.count}"
          end
        end
      end

      column do
        panel "Atividade Recente" do
          table_for(ContactMessage.last(5) || []) do
            column("Cliente") { |msg| msg.client_name }
            column("Advogado") { |msg| msg.lawyer.full_name if msg.lawyer }
            column("Status") { |msg| status_tag(msg.status) }
            column("Data") { |msg| pretty_format(msg.created_at) }
          end
        end
      end
    end

    # Charts section
    columns do
      column do
        panel "Agendamentos Semanais" do
          # This would integrate with a charting library in a real implementation
          div do
            para "Gráfico de agendamentos das últimas semanas"
          end
        end
      end

      column do
        panel "Especialidades Mais Populares" do
          # Top specialties by number of lawyers
          top_specialties = Specialty.joins(:lawyers).group(:id).order('COUNT(lawyers.id) DESC').limit(5)
          
          table_for(top_specialties) do
            column("Especialidade") { |spec| spec.name }
            column("Número de Advogados") { |spec| spec.lawyers.count }
          end
        end
      end
    end
  end
end