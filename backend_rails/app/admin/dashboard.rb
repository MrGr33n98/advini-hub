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

    # Recent stats - guarded with rescue to prevent 500 errors from missing tables
    columns do
      column do
        panel "Estatísticas Gerais" do
          ul do
            begin
              li "Total de Advogados: #{Lawyer.count}" if ActiveRecord::Base.connection.table_exists?(:lawyers)
              li "Total de Escritórios: #{Office.count}" if ActiveRecord::Base.connection.table_exists?(:offices)
              li "Total de Agendamentos: #{Appointment.count}" if ActiveRecord::Base.connection.table_exists?(:appointments)
              if ActiveRecord::Base.connection.table_exists?(:contact_messages)
                li "Mensagens Pendentes: #{ContactMessage.unread.count}"
              end
            rescue => e
              li "Erro ao carregar estatísticas: #{e.message}"
            end
          end
        end
      end

      column do
        panel "Atividade Recente" do
          if ActiveRecord::Base.connection.table_exists?(:contact_messages)
            begin
              table_for(ContactMessage.last(5) || []) do
                column("Cliente") { |msg| msg.client_name }
                column("Advogado") { |msg| msg.lawyer.full_name if msg.lawyer }
                column("Status") { |msg| status_tag(msg.status) }
                column("Data") { |msg| pretty_format(msg.created_at) }
              end
            rescue => e
              para "Erro ao carregar mensagens: #{e.message}"
            end
          else
            para "Tabela de mensagens ainda não criada. Execute as migrations."
          end
        end
      end
    end

    # Charts section
    columns do
      column do
        panel "Agendamentos Semanais" do
          div do
            para "Gráfico de agendamentos das últimas semanas"
          end
        end
      end

      column do
        panel "Especialidades Mais Populares" do
          if ActiveRecord::Base.connection.table_exists?(:specialties)
            begin
              top_specialties = Specialty.joins(:lawyers).group(:id).order('COUNT(lawyers.id) DESC').limit(5)
              table_for(top_specialties) do
                column("Especialidade") { |spec| spec.name }
                column("Número de Advogados") { |spec| spec.lawyers.count }
              end
            rescue => e
              para "Erro ao carregar especialidades: #{e.message}"
            end
          else
            para "Nenhuma especialidade cadastrada ainda."
          end
        end
      end
    end
  end
end