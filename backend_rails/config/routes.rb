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
    require_dependency Rails.root.join('app/models/lead').to_s
    require_dependency Rails.root.join('app/models/plan').to_s
    require_dependency Rails.root.join('app/models/subscription').to_s
    require_dependency Rails.root.join('app/models/sponsored_campaign').to_s
    require_dependency Rails.root.join('app/models/article').to_s
  end

  ActiveAdmin.routes(self)

  namespace :api do
    # Mantém /api/v1/ para compatibilidade
    namespace :v1 do
      # Public resources
      resources :lawyers, only: [:index, :show]
      resources :offices, only: [:index, :show]
      resources :specialties, only: [:index, :show]

      # Authentication
      post '/login', to: 'sessions#create'
      delete '/logout', to: 'sessions#destroy'
      post '/register', to: 'registrations#create'
      post '/password/reset', to: 'password_resets#create'
      put '/password/reset', to: 'password_resets#update'

      # Contact messages
      resources :contact_messages, only: [:index, :show, :create]

      # Appointments
      resources :appointments, except: [:new, :edit]

      # Dashboard routes (authenticated)
      get '/dashboard/metrics', to: 'dashboard#metrics'
      get '/dashboard/leads', to: 'dashboard#leads'
      get '/dashboard/appointments', to: 'dashboard#appointments'
      get '/dashboard/messages', to: 'dashboard#messages'

      # Office dashboard (authenticated, office access required)
      get '/office/dashboard/metrics', to: 'office_dashboard#metrics'
      get '/office/lawyers', to: 'office_dashboard#lawyers'
      get '/office/appointments', to: 'office_dashboard#appointments'
      get '/office/campaigns', to: 'office_dashboard#campaigns'
      get '/office/revenue', to: 'office_dashboard#revenue'

      # Client dashboard (authenticated, client role required)
      get '/client/dashboard/metrics', to: 'client_dashboard#metrics'
      get '/client/appointments', to: 'client_dashboard#appointments'
      get '/client/messages', to: 'client_dashboard#messages'
      get '/client/favorites', to: 'client_dashboard#favorites'
      get '/client/subscription', to: 'client_dashboard#subscription'
    end

    # Atalho para /api/ (sem v1) atende o frontend
    scope module: :v1 do
      resources :lawyers, only: [:index, :show]
      resources :offices, only: [:index, :show]
      resources :specialties, only: [:index, :show]
      resources :contact_messages, only: [:index, :show, :create]
      resources :appointments, except: [:new, :edit]
      resources :banners, only: [:index, :show]
    end
  end

  # Root path
  root to: redirect('/admin')
end