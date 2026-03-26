# Contact Messages Model
class ContactMessage < ApplicationRecord
  belongs_to :lawyer
  belongs_to :sender, polymorphic: true # Can be User or anonymous client

  validates :client_name, :client_email, :message, presence: true
  validates :client_email, format: { with: URI::MailTo::EMAIL_REGEXP }
  
  enum status: { pending: 0, sent: 1, delivered: 2, read: 3 }

  scope :unread, -> { where(status: 'pending') }
  scope :by_lawyer, ->(lawyer_id) { where(lawyer_id: lawyer_id) }
end