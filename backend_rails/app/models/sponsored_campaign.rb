# == Schema Information
#
# Table name: sponsored_campaigns
#
#  id                    :bigint           not null, primary key
#  sponsor_type          :string           not null
#  sponsor_id            :integer          not null
#  sponsor_name          :string           not null
#  sponsor_email         :string           not null
#  campaign_name         :string           not null
#  campaign_type         :integer          not null
#  status                :integer          default("draft"), not null
#  budget_total          :decimal(12, 2)
#  budget_spent          :decimal(12, 2)   default(0)
#  budget_remaining      :decimal(12, 2)
#  cost_per_click        :decimal(10, 2)
#  daily_budget          :decimal(10, 2)
#  billing_type          :integer          default("cpc")
#  impressions           :bigint           default(0)
#  clicks                :bigint           default(0)
#  ctr                   :decimal(5, 2)    default(0)
#  conversions           :integer          default(0)
#  conversion_rate       :decimal(5, 2)    default(0)
#  cost_per_conversion   :decimal(10, 2)
#  target_specialties    :string           default([]), is an Array
#  target_locations      :string           default([]), is an Array
#  target_keywords       :string           default([]), is an Array
#  start_date            :datetime
#  end_date              :datetime
#  schedule_type         :integer          default("continuous")
#  banner_url            :string
#  landing_page_url      :string
#  custom_html           :text
#  approved_by_id        :bigint
#  approved_at           :datetime
#  rejection_reason      :text
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#
# Indexes
#
#  index_sponsored_campaigns_on_approved_by_id           (approved_by_id)
#  index_sponsored_campaigns_on_campaign_type            (campaign_type)
#  index_sponsored_campaigns_on_end_date                 (end_date)
#  index_sponsored_campaigns_on_sponsor_type_and_sponsor_id  (sponsor_type,sponsor_id)
#  index_sponsored_campaigns_on_start_date               (start_date)
#  index_sponsored_campaigns_on_status                   (status)
#
class SponsoredCampaign < ApplicationRecord
  belongs_to :sponsor, polymorphic: true, optional: true
  belongs_to :approved_by, class_name: 'AdminUser', optional: true

  enum campaign_type: {
    featured_profile: 0,
    top_search: 1,
    banner_ad: 2,
    homepage_featured: 3,
    category_sponsorship: 4,
    blog_sponsorship: 5
  }

  enum status: {
    draft: 0,
    pending_approval: 1,
    active: 2,
    paused: 3,
    completed: 4,
    cancelled: 5
  }

  enum billing_type: {
    cpc: 0,
    cpm: 1,
    flat_rate: 2,
    monthly: 3
  }

  enum schedule_type: {
    continuous: 0,
    scheduled: 1,
    ongoing: 2
  }

  # Validations
  validates :campaign_name, presence: true
  validates :sponsor_name, :sponsor_email, presence: true
  validates :budget_total, numericality: { greater_than: 0 }, allow_nil: true
  validates :cost_per_click, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :impressions, :clicks, :conversions, numericality: { greater_than_or_equal_to: 0 }

  # Callbacks
  before_save :calculate_budget_remaining
  before_save :calculate_ctr
  before_save :calculate_conversion_rate
  before_save :calculate_cost_per_conversion

  # Scopes
  scope :active, -> { where(status: :active) }
  scope :pending_approval, -> { where(status: :pending_approval) }
  scope :running, -> { where(status: [:active, :paused]) }
  scope :this_month, -> { where('created_at >= ?', 1.month.ago.beginning_of_month) }
  scope :by_type, ->(type) { where(campaign_type: type) }
  scope :expiring_soon, -> { where('end_date <= ? AND status = ?', 7.days.from_now, :active) }

  # Class methods for metrics
  def self.metrics
    active_campaigns = active
    {
      total_campaigns: count,
      active_campaigns: active_campaigns.count,
      total_revenue: sum('budget_spent'),
      average_campaign_duration: calculate_avg_duration,
      average_roi: calculate_avg_roi,
      revenue_by_type: revenue_grouped_by_type,
      impressions_this_month: this_month.sum('impressions'),
      clicks_this_month: this_month.sum('clicks'),
      ctr_average: active_campaigns.count > 0 ? active_campaigns.average('ctr').to_f.round(2) : 0
    }
  end

  # Instance methods
  def approve!(admin_user)
    update(
      status: :active,
      approved_by: admin_user,
      approved_at: Time.current,
      rejection_reason: nil
    )
  end

  def reject!(reason)
    update(
      status: :draft,
      rejection_reason: reason
    )
  end

  def pause!
    update(status: :paused)
  end

  def activate!
    update(status: :active)
  end

  def complete!
    update(status: :completed)
  end

  def cancel!
    update(status: :cancelled)
  end

  def is_active?
    active? && start_date.present? && start_date <= Time.current &&
      (end_date.nil? || end_date >= Time.current)
  end

  def days_remaining
    return nil unless end_date
    [(end_date - Time.current).to_i / 1.day, 0].max
  end

  def budget_percentage_used
    return 0 unless budget_total && budget_total > 0
    ((budget_spent || 0) * 100.0 / budget_total).round(1)
  end

  private

  def calculate_budget_remaining
    self.budget_remaining = (budget_total || 0) - (budget_spent || 0)
  end

  def calculate_ctr
    self.ctr = impressions > 0 ? (clicks.to_f * 100.0 / impressions).round(2) : 0
  end

  def calculate_conversion_rate
    self.conversion_rate = clicks > 0 ? (conversions.to_f * 100.0 / clicks).round(2) : 0
  end

  def calculate_cost_per_conversion
    self.cost_per_conversion = conversions > 0 ? (budget_spent.to_f / conversions).round(2) : 0
  end

  def self.calculate_avg_duration
    completed_campaigns = where.not(end_date: nil).where(status: [:completed, :active])
    return 0 if completed_campaigns.count == 0
    
    total_days = completed_campaigns.sum { |campaign| 
      ((campaign.end_date || Time.current) - campaign.start_date).to_i / 1.day 
    }
    (total_days.to_f / completed_campaigns.count).round(1)
  end

  def self.calculate_avg_roi
    # Simplified ROI calculation
    active_campaigns = active
    return 0 if active_campaigns.count == 0
    
    total_revenue = active_campaigns.sum('budget_spent')
    total_cost = active_campaigns.count * 1000 # Assume average cost per campaign
    total_cost > 0 ? (((total_revenue - total_cost) * 100.0 / total_cost).round(1)) : 0
  end

  def self.revenue_grouped_by_type
    group(:campaign_type).sum('budget_spent')
  end

  # Ransack configuration
  def self.ransackable_attributes(auth_object = nil)
    ["campaign_name", "sponsor_name", "sponsor_email", "campaign_type", "status", 
     "billing_type", "budget_total", "budget_spent", "impressions", "clicks", "ctr",
     "start_date", "end_date", "created_at"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["sponsor", "approved_by"]
  end
end
