# Update the Specialty model
class Specialty < ApplicationRecord
  has_and_belongs_to_many :lawyers, join_table: 'lawyer_specialties'
  belongs_to :parent, class_name: 'Specialty', optional: true
  has_many :children, class_name: 'Specialty', foreign_key: 'parent_id'
  
  validates :name, presence: true

  def self.ransackable_attributes(auth_object = nil)
    %w[id name slug created_at updated_at]
  end

  def self.ransackable_associations(auth_object = nil)
    %w[lawyers parent children]
  end
end