# Update the Specialty model
class Specialty < ApplicationRecord
  has_and_belongs_to_many :lawyers
  belongs_to :parent, class_name: 'Specialty', optional: true
  has_many :children, class_name: 'Specialty', foreign_key: 'parent_id'
  
  validates :name, presence: true
end