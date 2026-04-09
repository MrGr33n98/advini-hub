# == Schema Information
#
# Table name: article_comments
#
#  id          :bigint           not null, primary key
#  user_name   :string           not null
#  user_email  :string           not null
#  content     :text             not null
#  status      :integer          default("pending"), not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  article_id  :bigint           not null
#  user_id     :bigint
#  parent_id   :bigint
#
# Indexes
#
#  index_article_comments_on_article_id  (article_id)
#  index_article_comments_on_created_at  (created_at)
#  index_article_comments_on_parent_id   (parent_id)
#  index_article_comments_on_status      (status)
#  index_article_comments_on_user_id     (user_id)
#
class ArticleComment < ApplicationRecord
  belongs_to :article
  belongs_to :user, optional: true
  belongs_to :parent, class_name: 'ArticleComment', optional: true
  has_many :replies, class_name: 'ArticleComment', foreign_key: 'parent_id', dependent: :destroy

  enum status: {
    pending: 0,
    approved: 1,
    rejected: 2,
    spam: 3
  }

  validates :user_name, presence: true
  validates :user_email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :content, presence: true, length: { minimum: 5, maximum: 2000 }

  scope :approved, -> { where(status: :approved) }
  scope :pending, -> { where(status: :pending) }
  scope :recent, -> { order(created_at: :desc) }
  scope :top_level, -> { where(parent_id: nil) }
  scope :replies_to, ->(comment_id) { where(parent_id: comment_id) }

  # Instance methods
  def approve!
    update(status: :approved)
    article.add_comment if approved?
  end

  def reject!
    update(status: :rejected)
  end

  def mark_as_spam!
    update(status: :spam)
  end

  def is_reply?
    parent_id.present?
  end

  def is_top_level?
    parent_id.nil?
  end

  # Ransack configuration
  def self.ransackable_attributes(auth_object = nil)
    ["user_name", "user_email", "content", "status", "created_at"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["article", "user", "parent"]
  end
end
