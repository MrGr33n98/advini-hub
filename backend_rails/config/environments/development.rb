# Configuration for production-like API behavior
Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # Make code changes take effect immediately
  config.cache_classes = false

  # Do not eager load code on boot
  config.eager_load = false

  # Show full error reports
  config.consider_all_requests_local = true

  # Enable server timing
  config.server_timing = true

  # Enable/disable caching
  config.cache_store = :null_store

  # Raise exceptions for disallowed deprecations
  config.active_support.disallowed_deprecation = :raise

  # Tell Active Support which deprecation messages to disallow
  config.active_support.disallowed_deprecation_warnings = []

  # Raise an error on page load if there are pending migrations
  config.active_record.migration_error = :page_load

  # Highlight code that triggered database queries in logs
  config.active_record.verbose_query_logs = true

  # Suppress logger output for asset requests
  config.assets.quiet = true

  # Raises error for missing translations
  # config.i18n.raise_on_missing_translations = true

  # Annotate rendered view with file names
  # config.action_view.annotate_rendered_view_with_filenames = true

  # Uncomment if you wish to allow Action Cable access from any origin
  # config.action_cable.disable_request_forgery_protection = true
  
  # Configure CORS for API access
  config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins '*'
      resource '*',
        headers: :any,
        methods: [:get, :post, :put, :patch, :delete, :options, :head],
        credentials: false
    end
  end
end