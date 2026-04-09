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

  def self.ransackable_attributes(auth_object = nil)
    %w[id trade_name city state created_at updated_at]
  end

  def self.ransackable_associations(auth_object = nil)
    %w[lawyers appointments]
  end
end