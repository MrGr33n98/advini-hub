Rails.application.routes.draw do
  # Forçar carregamento de todas as classes (models) em produção 
  # para o ActiveAdmin não dar NameError
  Rails.application.eager_load! if Rails.env.production?

  devise_for :admin_users, ActiveAdmin::Devise.config
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