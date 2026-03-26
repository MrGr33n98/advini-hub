# scripts/setup.sh
#!/bin/bash

# Setup script for AdvocaciaHub development environment

set -e  # Exit on any error

echo "Setting up AdvocaciaHub development environment..."

# Install system dependencies
echo "Installing system dependencies..."
if command -v apt-get &> /dev/null; then
  sudo apt-get update
  sudo apt-get install -y postgresql postgresql-contrib redis-server
elif command -v brew &> /dev/null; then
  brew install postgresql redis
fi

# Setup frontend
echo "Setting up frontend..."
cd artifacts/advocacia-hub
npm install
cd ../..

# Setup backend
echo "Setting up backend..."
cd backend_rails
bundle install

# Setup database
echo "Setting up database..."
bundle exec rake db:create
bundle exec rake db:migrate
bundle exec rake db:seed

# Return to root
cd ..

echo "Development environment setup complete!"
echo "To start the application, run: npm run dev"