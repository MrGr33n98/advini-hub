# == Schema Information
#
# Table name: leads
#
#  id                    :bigint           not null, primary key
#  email                 :string           not null
#  name                  :string           not null
#  phone                 :string
#  company               :string
#  job_title             :string
#  source                :integer          default("website"), not null
#  status                :integer          default("new"), not null
#  score                 :integer          default(0)
#  demographic_score     :integer          default(0)
#  behavioral_score      :integer          default(0)
#  firmographic_score    :integer          default(0)
#  intent_score          :integer          default(0)
#  engagement_score      :integer          default(0)
#  recency_score         :integer          default(0)
#  specialty_interest    :string
#  estimated_case_value  :decimal(12, 2)
#  location_city         :string
#  location_state        :string
#  location_country      :string           default("Brasil")
#  tags                  :text             default([]), is an Array
#  notes                 :text
#  last_contacted_at     :datetime
#  converted_at          :datetime
#  conversion_value      :decimal(12, 2)
#  email_opened_count    :integer          default(0)
#  email_clicked_count   :integer          default(0)
#  last_email_opened_at  :datetime
#  engagement_level      :integer          default("low")
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  assigned_lawyer_id    :bigint
#
# Indexes
#
#  index_leads_on_assigned_lawyer_id                    (assigned_lawyer_id)
#  index_leads_on_email                                 (email) UNIQUE
#  index_leads_on_engagement_level                      (engagement_level)
#  index_leads_on_location_city_and_location_state      (location_city,location_state)
#  index_leads_on_score                                 (score)
#  index_leads_on_source                                (source)
#  index_leads_on_status                                (status)
#  index_leads_on_created_at                            (created_at)
#
class Lead < ApplicationRecord
  # Associations
  belongs_to :assigned_lawyer, class_name: 'Lawyer', optional: true
  has_many :activities, class_name: 'LeadActivity', dependent: :destroy

  # Enums
  enum source: {
    website: 0,
    google_ads: 1,
    facebook: 2,
    linkedin: 3,
    referral: 4,
    organic: 5,
    blog: 6,
    event: 7
  }

  enum status: {
    new: 0,
    contacted: 1,
    qualified: 2,
    proposal_sent: 3,
    negotiation: 4,
    converted: 5,
    lost: 6
  }

  enum engagement_level: {
    low: 0,
    medium: 1,
    high: 2,
    very_high: 3
  }

  # Validations
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true
  validates :score, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
  validates :estimated_case_value, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :email_opened_count, :email_clicked_count, numericality: { greater_than_or_equal_to: 0 }

  # Scopes
  scope :recent, -> { order(created_at: :desc) }
  scope :high_score, -> { where('score >= ?', 80) }
  scope :converted, -> { where(status: :converted) }
  scope :by_source, ->(source) { where(source: source) }
  scope :by_status, ->(status) { where(status: status) }
  scope :by_engagement, ->(level) { where(engagement_level: level) }
  scope :this_month, -> { where('created_at >= ?', 1.month.ago.beginning_of_month) }

  # Class methods for metrics
  def self.metrics
    {
      total_leads: count,
      new_leads_this_month: this_month.count,
      converted_leads: converted.count,
      conversion_rate: count > 0 ? (converted.count * 100.0 / count).round(2) : 0,
      average_score: average('score').to_f.round(2),
      leads_by_source: group(:source).count,
      leads_by_status: group(:status).count,
      revenue_generated: where.not(conversion_value: nil).sum('conversion_value'),
      average_time_to_conversion: calculate_avg_conversion_time
    }
  end

  # Instance methods
  def calculate_score
    total = (demographic_score || 0) + 
            (behavioral_score || 0) + 
            (firmographic_score || 0) + 
            (intent_score || 0)
    self.score = [total, 100].min
    save
  end

  def engagement_level_from_activity
    total_interactions = email_opened_count + email_clicked_count
    if total_interactions >= 15
      self.engagement_level = :very_high
    elsif total_interactions >= 8
      self.engagement_level = :high
    elsif total_interactions >= 3
      self.engagement_level = :medium
    else
      self.engagement_level = :low
    end
    save
  end

  def mark_as_contacted
    self.last_contacted_at = Time.current
    self.status = :contacted if new?
    save
  end

  def mark_as_converted(value = nil)
    self.converted_at = Time.current
    self.status = :converted
    self.conversion_value = value if value
    save
  end

  private

  def self.calculate_avg_conversion_time
    converted_leads = where.not(converted_at: nil)
    return 0 if converted_leads.count == 0
    
    total_days = converted_leads.sum { |lead| 
      (lead.converted_at - lead.created_at).to_i / 1.day 
    }
    (total_days.to_f / converted_leads.count).round(1)
  end

  # Ransack configuration for ActiveAdmin
  def self.ransackable_attributes(auth_object = nil)
    ["name", "email", "company", "source", "status", "score", "engagement_level", 
     "specialty_interest", "location_city", "location_state", "created_at"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["assigned_lawyer", "activities"]
  end
end
