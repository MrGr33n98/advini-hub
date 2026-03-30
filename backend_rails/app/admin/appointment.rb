
ActiveAdmin.register "Appointment" do
  permit_params :lawyer_id, :client_id, :office_id, :client_name, :client_email, 
                :client_phone, :appointment_date, :notes, :service_type, 
                :appointment_type, :status, :fee_amount, :meeting_link

  index do
    selectable_column
    id_column
    column :client_name
    column :client_email
    column :lawyer
    column :appointment_date
    column :service_type
    column :status
    column :fee_amount
    actions
  end

  filter :client_name
  filter :client_email
  filter :lawyer
  filter :appointment_date
  filter :service_type
  filter :status
  filter :created_at

  form do |f|
    f.inputs "Agendamento" do
      f.input :lawyer
      f.input :client
      f.input :office
      f.input :client_name
      f.input :client_email
      f.input :client_phone
      f.input :appointment_date, as: :datetime_picker
      f.input :service_type
      f.input :appointment_type, as: :select, collection: Appointment.appointment_types.keys
      f.input :status, as: :select, collection: Appointment.statuses.keys
      f.input :fee_amount
      f.input :meeting_link
      f.input :notes
    end
    f.actions
  end
  
  # Calendar view
  sidebar "Calendário", only: :index do
    div do
      # Would integrate with a calendar widget in a real implementation
      para "Visualização de agenda disponível"
    end
  end
end