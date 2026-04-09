# Update the admin dashboard
ActiveAdmin.register_page "Dashboard" do
  menu priority: 1, label: proc { I18n.t("active_admin.dashboard") }

  content title: proc { I18n.t("active_admin.dashboard") } do
    # SaaS Metrics Overview
    columns do
      column do
        panel "📊 Métricas SaaS" do
          ul do
            begin
              if ActiveRecord::Base.connection.table_exists?(:leads)
                li "Total de Leads: #{Lead.count}"
                li "Leads este Mês: #{Lead.this_month.count}"
                li "Taxa de Conversão: #{Lead.metrics[:conversion_rate]}%"
              end
              
              if ActiveRecord::Base.connection.table_exists?(:users)
                li "Total de Membros: #{User.count}"
                li "Membros Ativos: #{User.active_members.count}"
              end
              
              if ActiveRecord::Base.connection.table_exists?(:subscriptions)
                li "Assinaturas Ativas: #{Subscription.active.count}"
              end
              
              if ActiveRecord::Base.connection.table_exists?(:articles)
                li "Artigos Publicados: #{Article.published.count}"
                li "Total de Visualizações: #{Article.sum('views')}"
              end
            rescue => e
              li "Erro ao carregar métricas: #{e.message}"
            end
          end
        end
      end

      column do
        panel "💰 Receita" do
          ul do
            begin
              if ActiveRecord::Base.connection.table_exists?(:plans) && ActiveRecord::Base.connection.table_exists?(:subscriptions)
                mrr = Plan.metrics[:mrr]
                arr = Plan.metrics[:arr]
                li "MRR: #{number_to_currency(mrr, unit: 'R$', separator: ',', delimiter: '.')}"
                li "ARR: #{number_to_currency(arr, unit: 'R$', separator: ',', delimiter: '.')}"
                li "Upgrades este Mês: #{Plan.metrics[:upgrades_this_month]}"
                li "Cancelamentos este Mês: #{Plan.metrics[:cancellations_this_month]}"
              end
              
              if ActiveRecord::Base.connection.table_exists?(:sponsored_campaigns)
                revenue = SponsoredCampaign.metrics[:total_revenue]
                li "Receita de Patrocínios: #{number_to_currency(revenue, unit: 'R$', separator: ',', delimiter: '.')}"
                li "Campanhas Ativas: #{SponsoredCampaign.metrics[:active_campaigns]}"
              end
            rescue => e
              li "Erro ao carregar receita: #{e.message}"
            end
          end
        end
      end
    end

    # Recent activity
    columns do
      column do
        panel "🎯 Leads Recentes" do
          if ActiveRecord::Base.connection.table_exists?(:leads)
            begin
              table_for(Lead.recent.limit(5)) do
                column("Nome") { |lead| link_to lead.name, admin_lead_path(lead) }
                column("Score") { |lead| "#{lead.score}/100" }
                column("Status") { |lead| status_tag(lead.status) }
                column("Data") { |lead| pretty_format(lead.created_at) }
              end
            rescue => e
              para "Erro ao carregar leads: #{e.message}"
            end
          else
            para "Tabela de leads ainda não criada. Execute as migrations."
          end
        end
      end

      column do
        panel "📝 Artigos Recentes" do
          if ActiveRecord::Base.connection.table_exists?(:articles)
            begin
              table_for(Article.recent.limit(5)) do
                column("Título") { |article| link_to article.title.truncate(30), admin_article_path(article) }
                column("Autor") { |article| article.author.full_name }
                column("Views") { |article| article.views }
                column("Data") { |article| pretty_format(article.published_at || article.created_at) }
              end
            rescue => e
              para "Erro ao carregar artigos: #{e.message}"
            end
          else
            para "Tabela de artigos ainda não criada. Execute as migrations."
          end
        end
      end
    end

    # Original stats section
    columns do
      column do
        panel "⚖️ Estatísticas da Plataforma" do
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
        panel "📅 Atividade Recente" do
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
        panel "📈 Especialidades Mais Populares" do
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

      column do
        panel "🚀 Planos SaaS" do
          if ActiveRecord::Base.connection.table_exists?(:plans)
            begin
              table_for(Plan.ordered) do
                column("Plano") { |plan| link_to plan.name, admin_plan_path(plan) }
                column("Preço") { |plan| number_to_currency(plan.price_monthly, unit: 'R$', separator: ',', delimiter: '.') }
                column("Assinaturas") { |plan| plan.subscriptions.count }
                column("Status") { |plan| status_tag(plan.is_active ? 'Ativo' : 'Inativo') }
              end
            rescue => e
              para "Erro ao carregar planos: #{e.message}"
            end
          else
            para "Tabela de planos ainda não criada. Execute as migrations."
          end
        end
      end
    end
  end
end