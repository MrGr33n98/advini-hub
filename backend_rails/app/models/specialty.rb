class Specialty < ApplicationRecord
  has_and_belongs_to_many :lawyers, join_table: 'lawyer_specialties'
  belongs_to :parent, class_name: 'Specialty', optional: true
  has_many :children, class_name: 'Specialty', foreign_key: 'parent_id'
  
  validates :name, presence: true, uniqueness: true
  validates :description, presence: true
  validates :icon, presence: true
  validates :color, presence: true, format: { with: /\A#[0-9A-Fa-f]{6}\z/, message: "deve ser um hexadecimal válido (ex: #FF5733)" }
  validates :position, presence: true, numericality: { only_integer: true }
  
  before_save :generate_slug
  
  scope :active, -> { where(is_active: true) }
  scope :popular, -> { joins(:lawyers).group(:id).order('COUNT(lawyers.id) DESC') }
  scope :alphabetical, -> { order(:name) }

  def self.ransackable_attributes(auth_object = nil)
    %w[id name slug description icon color position is_active created_at updated_at]
  end

  def self.ransackable_associations(auth_object = nil)
    %w[lawyers parent children]
  end

  private

  def generate_slug
    self.slug = name.parameterize if name.present?
  end
end