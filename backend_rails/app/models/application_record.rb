# Models
require 'active_record'
require 'pg'

class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class
end

class Lawyer < ApplicationRecord
  belongs_to :office, optional: true
  has_many :reviews, dependent: :destroy
  has_and_belongs_to_many :specialties
  
  validates :full_name, :oab_number, :city, :state, presence: true
  validates :oab_number, uniqueness: true
  
  has_one_attached :photo
end

class Office < ApplicationRecord
  has_many :lawyers, dependent: :nullify
  has_one_attached :logo
  
  validates :trade_name, :city, :state, presence: true
end

class Specialty < ApplicationRecord
  has_and_belongs_to_many :lawyers
  belongs_to :parent, class_name: 'Specialty', optional: true
  has_many :children, class_name: 'Specialty', foreign_key: 'parent_id'
  
  validates :name, presence: true
end

class Review < ApplicationRecord
  belongs_to :lawyer
  
  validates :rating, inclusion: { in: 1..5 }
  validates :comment, length: { minimum: 20 }
end