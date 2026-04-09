# == Schema Information
#
# Table name: lead_activities
#
#  id             :bigint           not null, primary key
#  activity_type  :integer          not null
#  description    :string
#  metadata       :jsonb
#  occurred_at    :datetime
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  lead_id        :bigint           not null
#
# Indexes
#
#  index_lead_activities_on_activity_type  (activity_type)
#  index_lead_activities_on_lead_id        (lead_id)
#  index_lead_activities_on_occurred_at    (occurred_at)
#
class LeadActivity < ApplicationRecord
  belongs_to :lead

  enum activity_type: {
    email_opened: 0,
    email_clicked: 1,
    form_submitted: 2,
    page_viewed: 3,
    downloaded: 4,
    webinar_attended: 5,
    call_made: 6,
    meeting_scheduled: 7
  }

  validates :activity_type, presence: true
  validates :description, presence: true

  scope :recent, -> { order(occurred_at: :desc) }
  scope :by_type, ->(type) { where(activity_type: type) }
  scope :this_week, -> { where('occurred_at >= ?', 1.week.ago) }

  def self.ransackable_attributes(auth_object = nil)
    ["activity_type", "description", "occurred_at", "created_at"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["lead"]
  end
end
