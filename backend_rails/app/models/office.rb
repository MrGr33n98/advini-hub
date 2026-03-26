# Update the Office model to include appointments
class Office < ApplicationRecord
  has_many :lawyers, dependent: :nullify
  has_many :appointments, dependent: :destroy
  has_one_attached :logo
  
  validates :trade_name, :city, :state, presence: true
  
  # Virtual attribute for email lookup
  def email
    # Could be added as a field later
    nil
  end
end