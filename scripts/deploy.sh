# scripts/deploy.sh
#!/bin/bash

# Deployment script for AdvocaciaHub

set -e  # Exit on any error

echo "Starting deployment process..."

# Check if we're on the correct branch
if [[ $(git branch --show-current) != "main" ]]; then
  echo "Error: Deployment can only be performed from the main branch"
  exit 1
fi

# Pull latest changes
echo "Pulling latest changes..."
git pull origin main

# Build frontend
echo "Building frontend..."
cd artifacts/advocacia-hub
npm ci
npm run build
cd ../..

# Build backend
echo "Building backend..."
cd backend_rails
bundle install
bundle exec rake assets:precompile
cd ..

# Run tests
echo "Running tests..."
npm run test

# Deploy to production
echo "Deploying to production..."
if [ "$DEPLOY_TO_HEROKU" = "true" ]; then
  echo "Deploying to Heroku..."
  git push heroku main
  heroku run rake db:migrate --app $HEROKU_APP_NAME
else
  echo "Deploying to custom server..."
  # Add your custom deployment commands here
  # For example, rsync to your server, or docker deployment
fi

echo "Deployment completed successfully!"