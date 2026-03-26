# Migration for Users table
class CreateUserTable < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :email, null: false
      t.string :password_digest, null: false
      t.string :first_name
      t.string :last_name
      t.string :phone
      t.integer :role, default: 0
      t.references :lawyer_profile, null: true, foreign_key: { to_table: :lawyers }
      
      t.timestamps
    end

    add_index :users, :email, unique: true
    add_index :users, :role
  end
end