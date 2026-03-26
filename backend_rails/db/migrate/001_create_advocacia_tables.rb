# Migration to create tables
class CreateAdvocaciaTables < ActiveRecord::Migration[7.0]
  def change
    create_table :offices do |t|
      t.string :trade_name, null: false
      t.string :city, null: false
      t.string :state, null: false
      t.integer :lawyer_count, default: 0
      t.text :logo_url
      
      t.timestamps
    end

    create_table :specialties do |t|
      t.string :name, null: false
      t.text :description
      t.references :parent, null: true, foreign_key: { to_table: :specialties }
      t.string :slug, null: false
      
      t.timestamps
    end

    create_table :lawyers do |t|
      t.string :full_name, null: false
      t.string :oab_number, null: false
      t.string :oab_state, null: false
      t.string :city, null: false
      t.string :state, null: false
      t.text :bio
      t.integer :years_experience, default: 0
      t.decimal :hourly_rate_min
      t.decimal :hourly_rate_max
      t.boolean :is_verified, default: false
      t.float :avg_rating, default: 0.0
      t.integer :total_reviews, default: 0
      t.references :office, null: true, foreign_key: true
      
      t.timestamps
    end

    create_table :lawyer_specialties do |t|
      t.references :lawyer, null: false, foreign_key: true
      t.references :specialty, null: false, foreign_key: true
      
      t.timestamps
    end

    create_table :reviews do |t|
      t.references :lawyer, null: false, foreign_key: true
      t.integer :rating, null: false
      t.text :comment
      t.string :case_type
      t.string :case_outcome
      t.string :moderation_status, default: 'pending'
      t.string :client_name, null: false
      
      t.timestamps
    end

    add_index :lawyers, :oab_number, unique: true
    add_index :lawyers, [:city, :state]
    add_index :offices, [:city, :state]
  end
end