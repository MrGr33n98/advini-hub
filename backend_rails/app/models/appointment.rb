# Appointment Model for scheduling
class Appointment < ApplicationRecord
  belongs_to :lawyer
  belongs_to :client, class_name: 'User', optional: true  # Optional if anonymous
  belongs_to :office, optional: true  # If meeting at office
  
  validates :client_name, :client_email, :appointment_date, :service_type, presence: true
  validates :client_email, format: { with: URI::MailTo::EMAIL_REGEXP }
  validate :appointment_date_future
  
  enum status: { scheduled: 0, confirmed: 1, completed: 2, cancelled: 3, missed: 4 }
  enum appointment_type: { consultation: 0, meeting: 1, hearing: 2, document_review: 3 }

  scope :upcoming, -> { where('appointment_date > ?', Time.current) }
  scope :past, -> { where('appointment_date <= ?', Time.current) }
  scope :by_lawyer, ->(lawyer_id) { where(lawyer_id: lawyer_id) }
  scope :by_status, ->(status) { where(status: status) }

  def self.ransackable_attributes(auth_object = nil)
    %w[id client_name client_email appointment_date status service_type created_at updated_at]
  end

  def self.ransackable_associations(auth_object = nil)
    %w[lawyer client office]
  end

  private

  def appointment_date_future
    if appointment_date.present? && appointment_date < Time.current
      errors.add(:appointment_date, 'must be in the future')
    end
  end
end