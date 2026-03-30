Rails.application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config
  # Garantir o carregamento dos modelos para o ActiveAdmin em produção
  if Rails.env.production?
    require_dependency Rails.root.join('app/models/application_record').to_s
    require_dependency Rails.root.join('app/models/appointment').to_s
    require_dependency Rails.root.join('app/models/lawyer').to_s
    require_dependency Rails.root.join('app/models/office').to_s
    require_dependency Rails.root.join('app/models/specialty').to_s
    require_dependency Rails.root.join('app/models/contact_message').to_s
  end

  ActiveAdmin.routes(self)

  namespace :api do
    namespace :v1 do
      resources :lawyers, only: [:index, :show]
      resources :offices, only: [:index, :show]
      resources :specialties, only: [:index, :show]
      
      # Authentication
      post '/login', to: 'sessions#create'
      delete '/logout', to: 'sessions#destroy'
      
      # Contact messages
      resources :contact_messages, only: [:index, :show, :create]
      
      # Appointments
      resources :appointments, except: [:new, :edit]
    end
  end

  # Root path
  root to: redirect('/admin')
end