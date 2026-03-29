# Forçar carregamento para ActiveAdmin em produção
require_relative '../app/models/application_record'
require_relative '../app/models/appointment'
require_relative '../app/models/lawyer'
require_relative '../app/models/office'
require_relative '../app/models/specialty'
require_relative '../app/models/contact_message'

Rails.application.routes.draw do
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