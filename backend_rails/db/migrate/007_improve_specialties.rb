class ImproveSpecialties < ActiveRecord::Migration[7.0]
  def change
    add_column :specialties, :icon, :string unless column_exists?(:specialties, :icon)
    add_column :specialties, :color, :string unless column_exists?(:specialties, :color)
    add_column :specialties, :position, :integer, default: 0 unless column_exists?(:specialties, :position)
    add_column :specialties, :is_active, :boolean, default: true unless column_exists?(:specialties, :is_active)
    
    add_index :specialties, :slug, unique: true unless index_exists?(:specialties, :slug)
  end
end
