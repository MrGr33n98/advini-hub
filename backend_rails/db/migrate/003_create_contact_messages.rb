# Migration for Contact Messages
class CreateContactMessages < ActiveRecord::Migration[7.0]
  def change
    create_table :contact_messages do |t|
      t.references :lawyer, null: false, foreign_key: true
      t.references :sender, polymorphic: true, null: true
      t.string :client_name, null: false
      t.string :client_email, null: false
      t.string :client_phone
      t.text :message, null: false
      t.string :case_type
      t.integer :status, default: 0
      
      t.timestamps
    end

    add_index :contact_messages, :status
    add_index :contact_messages, [:lawyer_id, :status]
  end
end