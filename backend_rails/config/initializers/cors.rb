# CORS Configuration
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Development
    origins 'http://localhost:5173', 'http://localhost:3000'
    
    # Production - replace with your actual domain
    origins ENV.fetch('FRONTEND_URL', 'https://advocaciahub.com.br')
    
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,
      expose: ['Authorization'],
      max_age: 600
  end
end
