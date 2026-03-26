# Update the Lawyer model to include appointments
class Lawyer < ApplicationRecord
  belongs_to :office, optional: true
  has_many :reviews, dependent: :destroy
  has_many :contact_messages, dependent: :destroy
  has_many :appointments, dependent: :destroy
  has_and_belongs_to_many :specialties
  belongs_to :user, optional: true  # Connect to User if this lawyer has an account
  
  validates :full_name, :oab_number, :city, :state, presence: true
  validates :oab_number, uniqueness: true
  
  has_one_attached :photo
  
  # Virtual attribute for email lookup
  def email
    user&.email
  end
end