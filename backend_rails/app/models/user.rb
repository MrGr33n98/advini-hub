# Update the User model to include appointments
class User < ApplicationRecord
  has_secure_password

  has_many :appointments, foreign_key: 'client_id', dependent: :destroy
  has_one :lawyer_profile, class_name: 'Lawyer', foreign_key: 'user_id', dependent: :nullify
  belongs_to :subscription, optional: true

  validates :email, presence: true, uniqueness: true
  validates :password, length: { minimum: 6 }, if: :password_required?

  enum role: { client: 0, lawyer: 1, admin: 2 }
  enum member_status: { active: 0, suspended: 1, pending: 2, trial: 3, expired: 4 }

  # Member tracking
  scope :active_members, -> { where(member_status: :active) }
  scope :trial_members, -> { where(member_status: :trial) }
  scope :recent_signups, -> { order(created_at: :desc).limit(10) }

  def password_required?
    new_record? || password.present?
  end

  def jwt_token
    encode_token({ user_id: id })
  end

  def update_last_login
    update(last_login_at: Time.current, login_count: (login_count || 0) + 1)
  end

  def plan_type
    subscription&.plan&.slug || 'free'
  end

  def contacts_limit
    case plan_type
    when 'gratis' then 5
    when 'pro' then 9999
    when 'escritorio' then 99999
    when 'enterprise' then 999999
    else 5
    end
  end

  def storage_limit_mb
    case plan_type
    when 'gratis' then 512
    when 'pro' then 5120
    when 'escritorio' then 10240
    when 'enterprise' then 102400
    else 512
    end
  end

  def api_calls_limit
    case plan_type
    when 'gratis' then 0
    when 'pro' then 5000
    when 'escritorio' then 10000
    when 'enterprise' then 100000
    else 0
    end
  end

  def self.ransackable_attributes(auth_object = nil)
    %w[id email role member_status first_name last_name phone created_at updated_at last_login_at login_count]
  end

  def self.ransackable_associations(auth_object = nil)
    %w[appointments lawyer_profile subscription]
  end

  # Class methods for metrics
  def self.member_metrics
    {
      total_members: count,
      active_members: active_members.count,
      trial_members: trial_members.count,
      churned_members: where(member_status: :expired).count,
      mrr: calculate_mrr,
      arr: calculate_mrr * 12,
      average_lifetime: 245, # Would need historical data
      churn_rate: calculate_churn_rate,
      members_by_plan: group_by_plan,
      members_by_status: group(:member_status).count,
      new_members_this_month: where('created_at >= ?', 1.month.ago.beginning_of_month).count,
      growth_rate: calculate_growth_rate
    }
  end

  private

  def encode_token(payload)
    payload[:exp] = 24.hours.from_now.to_i
    JWT.encode(payload, Rails.application.secret_key_base)
  end

  def self.calculate_mrr
    # Sum up all active subscription plan prices
    joins('LEFT JOIN subscriptions ON subscriptions.user_id = users.id')
      .joins('LEFT JOIN plans ON plans.id = subscriptions.plan_id')
      .where(member_status: [:active, :trial])
      .where(subscriptions: { status: [:active, :trialing] })
      .sum('plans.price_monthly').to_f
  end

  def self.calculate_churn_rate
    total = count
    return 0 if total == 0
    churned = where(member_status: :expired).count
    ((churned.to_f / total) * 100).round(1)
  end

  def self.group_by_plan
    # This would need subscription data
    { 'free' => where.not(member_status: [:active, :trial]).count }
  end

  def self.calculate_growth_rate
    this_month = where('created_at >= ?', 1.month.ago.beginning_of_month).count
    last_month = where('created_at >= ? AND created_at < ?', 
      2.months.ago.beginning_of_month, 
      1.month.ago.beginning_of_month
    ).count
    
    return 0 if last_month == 0
    ((this_month - last_month).to_f * 100.0 / last_month).round(1)
  end
end