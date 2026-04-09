ActiveAdmin.register ArticleComment do
  menu label: "Comentários", parent_menu: "Artigos", priority: 7

  # Index page
  index do
    selectable_column
    id_column

    column :article do |comment|
      link_to comment.article.title.truncate(50), admin_article_path(comment.article)
    end

    column :user_name
    column :user_email
    column :content do |comment|
      comment.content.truncate(100)
    end

    column :status do |comment|
      status_tag comment.status, class: comment.status
    end

    column :is_reply do |comment|
      comment.is_reply? ? "Sim" : "Não"
    end

    column :created_at
    actions
  end

  # Filters
  filter :user_name
  filter :user_email
  filter :content
  filter :status, as: :select, collection: ArticleComment.statuses.keys.map { |s| [s.humanize, s] }
  filter :article
  filter :created_at

  # Show page
  show do
    attributes_table do
      row :article do |comment|
        link_to comment.article.title, admin_article_path(comment.article)
      end
      row :user
      row :user_name
      row :user_email
      row :content do |comment|
        simple_format(comment.content)
      end
      row :status
      row :parent do |comment|
        comment.parent ? link_to("Ver comentário pai", admin_article_comment_path(comment.article, comment.parent)) : "N/A"
      end
      row :is_reply do |comment|
        comment.is_reply? ? "Sim" : "Não"
      end
      row :created_at
      row :updated_at
    end

    if article_comment.replies.count > 0
      panel "Respostas (#{article_comment.replies.count})" do
        table_for article_comment.replies.order(created_at: :asc) do
          column :user_name
          column :content do |reply|
            reply.content.truncate(100)
          end
          column :status
          column :created_at
        end
      end
    end
  end

  # Form
  form do |f|
    f.inputs "Informações do Comentário" do
      f.input :article, collection: Article.all.map { |a| [a.title.truncate(50), a.id] }
      f.input :user, collection: User.all.map { |u| [u.email, u.id] }, include_blank: true
      f.input :user_name
      f.input :user_email
      f.input :content, as: :text
      f.input :status, as: :select
      f.input :parent, collection: ArticleComment.top_level.map { |c| [c.content.truncate(50), c.id] }, include_blank: true
    end

    f.actions
  end

  # Custom actions
  member_action :approve, method: :put do
    resource.approve!
    redirect_to admin_article_comment_path(resource.article, resource), notice: "Comentário aprovado."
  end

  member_action :reject, method: :put do
    resource.reject!
    redirect_to admin_article_comments_path, notice: "Comentário rejeitado."
  end

  member_action :mark_as_spam, method: :put do
    resource.mark_as_spam!
    redirect_to admin_article_comments_path, notice: "Comentário marcado como spam."
  end
end
