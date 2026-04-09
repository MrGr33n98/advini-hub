# == Schema Information
#
# Table name: subscriptions
#
#  id                       :bigint           not null, primary key
#  status                   :integer          default("active"), not null
#  current_period_start     :datetime
#  current_period_end       :datetime
#  cancel_at_period_end     :boolean          default(FALSE)
#  canceled_at              :datetime
#  trial_start              :datetime
#  trial_end                :datetime
#  amount                   :decimal(10, 2)
#  currency                 :string           default("BRL")
#  payment_method           :string
#  last_payment_date        :datetime
#  next_payment_date        :datetime
#  stripe_subscription_id   :string
#  stripe_customer_id       :string
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  user_id                  :bigint           not null
#  plan_id                  :bigint           not null
#
# Indexes
#
#  index_subscriptions_on_plan_id                 (plan_id)
#  index_subscriptions_on_status                  (status)
#  index_subscriptions_on_current_period_end      (current_period_end)
#  index_subscriptions_on_stripe_subscription_id  (stripe_subscription_id) UNIQUE
#  index_subscriptions_on_user_id                 (user_id)
#
class Subscription < ApplicationRecord
  belongs_to :user
  belongs_to :plan

  enum status: {
    active: 0,
    canceled: 1,
    past_due: 2,
    trialing: 3,
    unpaid: 4
  }

  validates :amount, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :stripe_subscription_id, uniqueness: true, allow_nil: true

  scope :active, -> { where(status: :active) }
  scope :trialing, -> { where(status: :trialing) }
  scope :canceled, -> { where(status: :canceled) }
  scope :expiring_soon, -> { where('current_period_end <= ? AND status = ?', 7.days.from_now, :active) }
  scope :this_month, -> { where('created_at >= ?', 1.month.ago.beginning_of_month) }
  scope :upgrades, -> { this_month.where('amount > ?', 0) } # Simplified
  scope :downgrades, -> { this_month.where('amount < ?', 0) } # Simplified

  # Instance methods
  def active?
    status == 'active' || status == 'trialing'
  end

  def trialing?
    trial_end.present? && trial_end > Time.current
  end

  def days_until_renewal
    return nil unless current_period_end
    [(current_period_end - Time.current).to_i / 1.day, 0].max
  end

  def cancel_at_period_end!
    update(cancel_at_period_end: true, canceled_at: Time.current)
  end

  def reactivate!
    update(cancel_at_period_end: false, canceled_at: nil, status: :active)
  end

  def mark_as_canceled!
    update(status: :canceled, canceled_at: Time.current)
  end

  def mark_as_past_due!
    update(status: :past_due)
  end

  # Ransack configuration
  def self.ransackable_attributes(auth_object = nil)
    ["status", "amount", "currency", "current_period_start", "current_period_end", 
     "trial_start", "trial_end", "created_at"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["user", "plan"]
  end
end
