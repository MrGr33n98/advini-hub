# frozen_string_literal: true
ActiveAdmin.setup do |config|
  # == Site Title
  #
  # The title that appears at the top of every page.
  config.site_title = "Advocacia Hub"

  # == Default Namespace
  #
  # The namespace that Active Admin should use by default.
  # config.default_namespace = :admin

  # == User Authentication
  #
  # The method used to log in as an administrator.
  config.authentication_method = :authenticate_admin_user!

  # == Current User
  #
  # The method used to get the current administrator.
  config.current_user_method = :current_admin_user

  # == Logging Out
  #
  # The method used to log out as an administrator.
  config.logout_link_path = :destroy_admin_user_session_path

  # == Root Namespace
  #
  # You can also set a root namespace.
  # config.root_to = 'dashboard#index'

  # == Admin Comments
  #
  # Admin comments are enabled by default.
  config.comments = false

  # == Batch Actions
  #
  # Batch actions are enabled by default.
  config.batch_actions = true

  # == Localized Dates
  #
  # To use localized dates, uncomment this.
  # config.localize_format = :long

  # == Setting a Favicon
  #
  # config.favicon = 'favicon.ico'

  # == Meta Tags
  #
  # config.meta_tags = {
  #   viewport: 'width=device-width, initial-scale=1'
  # }

  # == Indexing Strategy
  #
  # config.index_as = :table
end
