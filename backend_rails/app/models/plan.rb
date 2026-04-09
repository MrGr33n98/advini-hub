# == Schema Information
#
# Table name: plans
#
#  id                          :bigint           not null, primary key
#  name                        :string           not null
#  slug                        :string           not null
#  description                 :text
#  price_monthly               :decimal(10, 2)   default(0)
#  price_yearly                :decimal(10, 2)   default(0)
#  currency                    :string           default("BRL")
#  is_active                   :boolean          default(TRUE)
#  is_popular                  :boolean          default(FALSE)
#  display_order               :integer          default(0)
#  max_contacts_per_month      :integer
#  max_specialties             :integer
#  max_lawyers                 :integer
#  max_storage_gb              :integer
#  max_api_calls_per_month     :integer
#  has_analytics               :boolean          default(FALSE)
#  has_blog_access             :boolean          default(FALSE)
#  has_priority_support        :boolean          default(FALSE)
#  has_api_access              :boolean          default(FALSE)
#  has_custom_branding         :boolean          default(FALSE)
#  has_white_label             :boolean          default(FALSE)
#  features                    :jsonb
#  stripe_price_id_monthly     :string
#  stripe_price_id_yearly      :string
#  created_at                  :datetime         not null
#  updated_at                  :datetime         not null
#
# Indexes
#
#  index_plans_on_display_order  (display_order)
#  index_plans_on_is_active      (is_active)
#  index_plans_on_slug           (slug) UNIQUE
#
class Plan < ApplicationRecord
  has_many :subscriptions, dependent: :restrict_with_error

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: true, format: { with: /\A[a-z0-9_-]+\z/, message: "only lowercase letters, numbers, hyphens and underscores allowed" }
  validates :price_monthly, :price_yearly, numericality: { greater_than_or_equal_to: 0 }
  validates :display_order, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  scope :active, -> { where(is_active: true) }
  scope :ordered, -> { order(display_order: :asc) }
  scope :by_price, -> { order(price_monthly: :asc) }

  # Class methods for metrics
  def self.metrics
    active_plans = active
    total_subscriptions = Subscription.active.count
    
    {
      total_subscriptions: total_subscriptions,
      active_subscriptions: Subscription.active.count,
      mrr: calculate_mrr,
      arr: calculate_mrr * 12,
      average_revenue_per_user: total_subscriptions > 0 ? calculate_mrr / total_subscriptions : 0,
      plan_distribution: distribution_by_plan,
      upgrades_this_month: Subscription.this_month.upgrades.count,
      downgrades_this_month: Subscription.this_month.downgrades.count,
      cancellations_this_month: Subscription.this_month.canceled.count
    }
  end

  def monthly_price_formatted
    format_currency(price_monthly)
  end

  def yearly_price_formatted
    format_currency(price_yearly)
  end

  def yearly_savings
    return 0 if price_monthly == 0
    (price_monthly * 12) - price_yearly
  end

  private

  def format_currency(value)
    number_to_currency(value, unit: "R$", separator: ",", delimiter: ".")
  end

  def self.calculate_mrr
    Subscription.active.joins(:plan).sum("plans.price_monthly")
  end

  def self.distribution_by_plan
    Plan.active.includes(:subscriptions).map do |plan|
      count = plan.subscriptions.active.count
      total = Subscription.active.count
      {
        name: plan.name,
        slug: plan.slug,
        count: count,
        percentage: total > 0 ? (count * 100.0 / total).round(1) : 0,
        mrr: plan.price_monthly * count
      }
    end
  end

  # Ransack configuration
  def self.ransackable_attributes(auth_object = nil)
    ["name", "slug", "price_monthly", "price_yearly", "is_active", "is_popular", 
     "display_order", "created_at"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["subscriptions"]
  end
end
