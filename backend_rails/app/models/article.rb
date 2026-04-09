# == Schema Information
#
# Table name: articles
#
#  id                       :bigint           not null, primary key
#  title                    :string           not null
#  slug                     :string           not null
#  excerpt                  :text
#  content                  :text
#  cover_image_url          :string
#  meta_title               :string
#  meta_description         :text
#  meta_keywords            :string           default([]), is an Array
#  category                 :string
#  tags                     :string           default([]), is an Array
#  related_specialties      :string           default([]), is an Array
#  status                   :integer          default("draft"), not null
#  published_at             :datetime
#  scheduled_for            :datetime
#  views                    :bigint           default(0)
#  unique_views             :bigint           default(0)
#  average_read_time_seconds :integer         default(0)
#  likes                    :integer          default(0)
#  shares                   :integer          default(0)
#  comments_count           :integer          default(0)
#  seo_score                :integer          default(0)
#  readability_score        :integer          default(0)
#  is_featured              :boolean          default(FALSE)
#  is_premium               :boolean          default(FALSE)
#  allow_comments           :boolean          default(TRUE)
#  featured_image_url       :string
#  read_time_minutes        :integer          default(0)
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  author_id                :bigint           not null
#
# Indexes
#
#  index_articles_on_author_id     (author_id)
#  index_articles_on_category      (category)
#  index_articles_on_is_featured   (is_featured)
#  index_articles_on_published_at  (published_at)
#  index_articles_on_slug          (slug) UNIQUE
#  index_articles_on_status        (status)
#  index_articles_on_views         (views)
#
class Article < ApplicationRecord
  belongs_to :author, class_name: 'Lawyer'
  has_many :comments, class_name: 'ArticleComment', dependent: :destroy

  enum status: {
    draft: 0,
    pending_review: 1,
    scheduled: 2,
    published: 3,
    archived: 4
  }

  # Validations
  validates :title, presence: true, length: { maximum: 200 }
  validates :slug, presence: true, uniqueness: true, format: { with: /\A[a-z0-9_-]+\z/ }
  validates :content, presence: true, if: :published?
  validates :excerpt, length: { maximum: 500 }, allow_nil: true
  validates :seo_score, :readability_score, numericality: { 
    greater_than_or_equal_to: 0, 
    less_than_or_equal_to: 100 
  }, allow_nil: true
  validates :views, :unique_views, :likes, :shares, :comments_count, 
    numericality: { greater_than_or_equal_to: 0 }

  # Callbacks
  before_validation :generate_slug, on: :create
  before_save :calculate_read_time
  before_save :auto_set_published_at

  # Scopes
  scope :published, -> { where(status: :published) }
  scope :draft, -> { where(status: :draft) }
  scope :featured, -> { where(is_featured: true) }
  scope :recent, -> { order(published_at: :desc) }
  scope :by_category, ->(category) { where(category: category) }
  scope :with_tag, ->(tag) { where('? = ANY(tags)', tag) }
  scope :this_month, -> { where('created_at >= ?', 1.month.ago.beginning_of_month) }
  scope :popular, -> { where('views >= ?', 1000).order(views: :desc) }
  scope :high_seo, -> { where('seo_score >= ?', 80) }

  # Class methods for metrics
  def self.metrics
    published_articles = self.published
    {
      total_articles: count,
      published_articles: published_articles.count,
      draft_articles: draft.count,
      total_views: sum('views'),
      total_likes: sum('likes'),
      total_shares: sum('shares'),
      average_views_per_article: count > 0 ? (sum('views').to_f / count).round(0) : 0,
      top_articles: published_articles.order(views: :desc).limit(5).as_json(
        only: [:id, :title, :slug, :views, :likes, :shares],
        include: { author: { only: [:full_name] } }
      ),
      views_this_month: this_month.sum('views'),
      growth_rate: calculate_growth_rate,
      engagement_rate: calculate_engagement_rate
    }
  end

  # Instance methods
  def publish!
    update(
      status: :published,
      published_at: Time.current
    )
  end

  def schedule!(datetime)
    update(
      status: :scheduled,
      scheduled_for: datetime
    )
  end

  def archive!
    update(status: :archived)
  end

  def increment_views
    increment!(:views)
  end

  def like!
    increment!(:likes)
  end

  def share!
    increment!(:shares)
  end

  def add_comment
    increment!(:comments_count)
  end

  def seo_status
    return 'excellent' if seo_score >= 90
    return 'good' if seo_score >= 70
    return 'needs_improvement' if seo_score >= 50
    'poor'
  end

  def readability_status
    return 'easy' if readability_score >= 80
    return 'moderate' if readability_score >= 60
    'difficult'
  end

  def is_published?
    published? && published_at.present? && published_at <= Time.current
  end

  def is_scheduled?
    scheduled? && scheduled_for.present? && scheduled_for > Time.current
  end

  private

  def generate_slug
    return if slug.present?
    self.slug = title.parameterize
  end

  def calculate_read_time
    return unless content.present?
    words_per_minute = 200
    word_count = content.split.size
    self.read_time_minutes = [(word_count / words_per_minute.to_f).ceil, 1].max
  end

  def auto_set_published_at
    if status_changed_to_published? && published_at.nil?
      self.published_at = Time.current
    end
  end

  def status_changed_to_published?
    status == 'published' && status_previously != 'published'
  end

  def self.calculate_growth_rate
    this_month_count = this_month.count
    last_month_count = where('created_at >= ? AND created_at < ?', 
      2.months.ago.beginning_of_month, 
      1.month.ago.beginning_of_month
    ).count
    
    return 0 if last_month_count == 0
    ((this_month_count - last_month_count).to_f * 100.0 / last_month_count).round(1)
  end

  def self.calculate_engagement_rate
    total = sum('views')
    return 0 if total == 0
    engagements = sum('likes') + sum('shares') + sum('comments_count')
    ((engagements.to_f * 100.0 / total).round(2))
  end

  # Ransack configuration
  def self.ransackable_attributes(auth_object = nil)
    ["title", "slug", "category", "status", "author_id", "published_at", 
     "views", "likes", "shares", "seo_score", "readability_score", 
     "is_featured", "is_premium", "created_at"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["author", "comments"]
  end
end
