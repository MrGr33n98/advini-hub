# Update the Review model
class Review < ApplicationRecord
  belongs_to :lawyer
  
  validates :rating, inclusion: { in: 1..5 }
  validates :comment, length: { minimum: 20 }
  
  enum moderation_status: { pending: 0, approved: 1, rejected: 2 }
end