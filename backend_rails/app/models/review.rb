# Update the Review model
class Review < ApplicationRecord
  belongs_to :lawyer
  
  validates :rating, inclusion: { in: 1..5 }
  validates :comment, length: { minimum: 20 }
  
  enum moderation_status: { pending: 0, approved: 1, rejected: 2 }

  def self.ransackable_attributes(auth_object = nil)
    %w[id rating comment moderation_status client_name created_at updated_at]
  end

  def self.ransackable_associations(auth_object = nil)
    %w[lawyer]
  end
end