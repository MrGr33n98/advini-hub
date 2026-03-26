# Migration for Appointments
class CreateAppointments < ActiveRecord::Migration[7.0]
  def change
    create_table :appointments do |t|
      t.references :lawyer, null: false, foreign_key: true
      t.references :client, null: true, foreign_key: { to_table: :users }
      t.references :office, null: true, foreign_key: true
      t.string :client_name, null: false
      t.string :client_email, null: false
      t.string :client_phone
      t.datetime :appointment_date, null: false
      t.text :notes
      t.string :service_type, null: false
      t.integer :appointment_type, default: 0
      t.integer :status, default: 0
      t.decimal :fee_amount
      t.string :meeting_link  # For virtual appointments
      
      t.timestamps
    end

    add_index :appointments, :appointment_date
    add_index :appointments, :status
    add_index :appointments, [:lawyer_id, :appointment_date]
    add_index :appointments, [:client_email, :appointment_date]
  end
end