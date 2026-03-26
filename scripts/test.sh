# scripts/test.sh
#!/bin/bash

# Test script for AdvocaciaHub

set -e  # Exit on any error

echo "Running tests..."

# Run frontend tests
echo "Running frontend tests..."
cd artifacts/advocacia-hub
npm run test:unit
npm run test:integration
cd ../..

# Run backend tests
echo "Running backend tests..."
cd backend_rails
bundle exec rspec
cd ..

echo "All tests passed!"