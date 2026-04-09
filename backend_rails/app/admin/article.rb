ActiveAdmin.register Article do
  menu label: "Artigos", priority: 6

  # Index page
  index do
    selectable_column
    id_column

    column :title do |article|
      div class: "font-semibold" do
        link_to article.title, admin_article_path(article)
      end
      div class: "text-sm text-gray-500" do
        article.excerpt&.truncate(80)
      end
    end

    column :author do |article|
      link_to article.author.full_name, admin_lawyer_path(article.author)
    end

    column :category
    column :status do |article|
      status_tag article.status, class: article.status
    end

    column :views
    column :likes
    column :seo_score do |article|
      color = article.seo_score >= 90 ? 'green' : article.seo_score >= 70 ? 'yellow' : 'red'
      span class: "px-2 py-1 rounded bg-#{color}-100 text-#{color}-800 font-semibold" do
        "#{article.seo_score}/100"
      end
    end

    column :is_featured do |article|
      status_tag article.is_featured ? "Sim" : "Não"
    end

    column :published_at
    actions
  end

  # Filters
  filter :title
  filter :author, as: :select, collection: Lawyer.all.map { |l| [l.full_name, l.id] }
  filter :category
  filter :status, as: :select, collection: Article.statuses.keys.map { |s| [s.humanize, s] }
  filter :is_featured, as: :select, collection: [['Destacados', true], ['Não Destacados', false]]
  filter :is_premium, as: :select, collection: [['Premium', true], ['Gratuitos', false]]
  filter :seo_score
  filter :views
  filter :published_at
  filter :created_at

  # Show page
  show do
    attributes_table do
      row :title
      row :slug
      row :author do |article|
        link_to article.author.full_name, admin_lawyer_path(article.author)
      end
      row :excerpt
      row :content do |article|
        simple_format(article.content)
      end
      row :cover_image_url do |article|
        article.cover_image_url ? image_tag(article.cover_image_url, style: "max-width: 300px;") : "N/A"
      end

      panel "SEO" do
        attributes_table_for article do
          row :meta_title
          row :meta_description
          row "Palavras-chave" do |a| a.meta_keywords&.join(", ") end
          row "SEO Score" do |a| 
            color = a.seo_score >= 90 ? 'green' : a.seo_score >= 70 ? 'yellow' : 'red'
            span class: "text-2xl font-bold text-#{color}-600" do "#{a.seo_score}/100" end
          end
          row "Status SEO" do |a| a.seo_status.humanize end
          row "Legibilidade" do |a| "#{a.readability_score}/100 - #{a.readability_status.humanize}" end
        end
      end

      panel "Categorização" do
        attributes_table_for article do
          row :category
          row "Tags" do |a| 
            a.tags.map { |tag| span class: "px-2 py-1 bg-blue-100 text-blue-800 rounded mr-1", style: "display: inline-block; margin: 2px;" do tag end }.join.html_safe
          end
          row "Especialidades Relacionadas" do |a| a.related_specialties&.join(", ") end
        end
      end

      panel "Publicação" do
        attributes_table_for article do
          row :status
          row :published_at
          row :scheduled_for
          row :is_featured
          row :is_premium
          row :allow_comments
          row "Tempo de Leitura" do |a| "#{a.read_time_minutes} minutos" end
        end
      end

      panel "Engajamento" do
        attributes_table_for article do
          row :views
          row :unique_views
          row "Tempo Médio de Leitura" do |a| "#{a.average_read_time_seconds} segundos" end
          row :likes
          row :shares
          row :comments_count
          row "Taxa de Engajamento" do |a|
            rate = a.views > 0 ? ((a.likes + a.shares + a.comments_count).to_f * 100.0 / a.views).round(2) : 0
            "#{rate}%"
          end
        end
      end

      row :created_at
      row :updated_at
    end

    panel "Comentários (#{article.comments.count})" do
      table_for article.comments.order(created_at: :desc).limit(10) do
        column :user_name
        column :user_email
        column :content do |comment|
          comment.content.truncate(100)
        end
        column :status do |comment|
          status_tag comment.status, class: comment.status
        end
        column :created_at
        column "" do |comment|
          link_to "Ver", admin_article_comment_path(article, comment)
        end
      end
      div do
        link_to "Ver Todos os Comentários", admin_article_comments_path(article)
      end
    end
  end

  # Form
  form do |f|
    f.inputs "Informações do Artigo" do
      f.input :title
      f.input :slug, hint: "Gerado automaticamente se vazio"
      f.input :author, collection: Lawyer.all.map { |l| [l.full_name, l.id] }
      f.input :excerpt, as: :text
      f.input :content, as: :text, input_html: { rows: 20 }
      f.input :cover_image_url
      f.input :featured_image_url
    end

    f.inputs "SEO" do
      f.input :meta_title
      f.input :meta_description, as: :text
      f.input :meta_keywords, input_html: { value: f.object.meta_keywords.join(', ') }, hint: "Separado por vírgulas"
      f.input :seo_score
      f.input :readability_score
    end

    f.inputs "Categorização" do
      f.input :category
      f.input :tags, input_html: { value: f.object.tags.join(', ') }, hint: "Separado por vírgulas"
      f.input :related_specialties, input_html: { value: f.object.related_specialties.join(', ') }, hint: "Separado por vírgulas"
    end

    f.inputs "Publicação" do
      f.input :status, as: :select
      f.input :published_at, as: :datetime_picker
      f.input :scheduled_for, as: :datetime_picker
      f.input :is_featured
      f.input :is_premium
      f.input :allow_comments
      f.input :read_time_minutes
    end

    f.actions
  end

  # Custom actions
  member_action :publish, method: :put do
    resource.publish!
    redirect_to admin_article_path(resource), notice: "Artigo publicado com sucesso."
  end

  member_action :schedule, method: :put do
    scheduled_for = params[:scheduled_for] || 1.day.from_now
    resource.schedule!(scheduled_for)
    redirect_to admin_article_path(resource), notice: "Artigo agendado para #{scheduled_for}."
  end

  member_action :archive, method: :put do
    resource.archive!
    redirect_to admin_article_path(resource), notice: "Artigo arquivado."
  end

  collection_action :metrics do
    @metrics = Article.metrics
    render 'admin/articles/metrics'
  end
end
