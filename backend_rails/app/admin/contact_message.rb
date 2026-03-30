# Active Admin for Contact Messages
# Forçar carregamento do modelo base e do modelo específico antes do registro
require_dependency Rails.root.join('app', 'models', 'application_record').to_s
require_dependency Rails.root.join('app', 'models', 'contact_message').to_s

ActiveAdmin.register "ContactMessage" do
  permit_params :lawyer_id, :client_name, :client_email, :client_phone, :message, :case_type, :status

  index do
    selectable_column
    id_column
    column :client_name
    column :client_email
    column :lawyer
    column :case_type
    column :status
    column :created_at
    actions
  end

  filter :client_name
  filter :client_email
  filter :lawyer
  filter :case_type
  filter :status
  filter :created_at

  form do |f|
    f.inputs "Mensagem de Contato" do
      f.input :lawyer
      f.input :client_name
      f.input :client_email
      f.input :client_phone
      f.input :message
      f.input :case_type
      f.input :status, as: :select, collection: ContactMessage.statuses.keys
    end
    f.actions
  end
  
  # Allow marking as read from index
  action_item :mark_as_read, only: :show do
    link_to "Marcar como Lido", mark_as_read_admin_contact_message_path(contact_message), method: :put if contact_message.pending?
  end
  
  member_action :mark_as_read, method: :put do
    contact_message = ContactMessage.find(params[:id])
    contact_message.update(status: 'read')
    redirect_to admin_contact_message_path(contact_message), notice: "Mensagem marcada como lida."
  end
end