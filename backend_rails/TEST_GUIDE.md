# AdvocaciaHub Rails Backend - Test & Development Guide

## Quick Start

### Prerequisites
- Ruby 3.1.2
- PostgreSQL 13+
- Node.js 14+
- Bundler

### Setup

```bash
cd backend_rails

# Install dependencies
bundle install

# Create test database
bundle exec rake db:create
bundle exec rake db:migrate

# (Optional) Load seed data
bundle exec rake db:seed
```

## Running Tests

### All Tests
```bash
bundle exec rspec
```

### With Coverage Report
```bash
COVERAGE=true bundle exec rspec
```

### Specific Test File
```bash
bundle exec rspec lawyer_spec.rb
bundle exec rspec appointment_spec.rb
bundle exec rspec contact_message_spec.rb
```

### API Tests Only
```bash
bundle exec rspec lawyers_controller_spec.rb
bundle exec rspec appointments_controller_spec.rb
bundle exec rspec contact_messages_controller_spec.rb
```

### Verbose Output
```bash
bundle exec rspec --format documentation
```

## Development Server

### Start Rails Server
```bash
bundle exec rails server -b 0.0.0.0 -p 3001
```

### Access ActiveAdmin
- URL: http://localhost:3001/admin
- Email: admin@advocaciahub.com
- Password: temporary123

### Test API Endpoints

#### Get All Lawyers
```bash
curl http://localhost:3001/api/v1/lawyers
```

#### Get Lawyer by ID
```bash
curl http://localhost:3001/api/v1/lawyers/1
```

#### Filter Lawyers
```bash
curl "http://localhost:3001/api/v1/lawyers?city=São Paulo"
curl "http://localhost:3001/api/v1/lawyers?specialty=Direito Civil"
```

#### Create Appointment
```bash
curl -X POST http://localhost:3001/api/v1/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "appointment": {
      "lawyer_id": 1,
      "client_name": "João Silva",
      "client_email": "joao@example.com",
      "appointment_date": "2024-12-20T10:00:00Z",
      "service_type": "Consultation"
    }
  }'
```

#### Create Contact Message
```bash
curl -X POST http://localhost:3001/api/v1/contact_messages \
  -H "Content-Type: application/json" \
  -d '{
    "contact_message": {
      "lawyer_id": 1,
      "client_name": "Maria Costa",
      "client_email": "maria@example.com",
      "message": "I need legal advice about a contract."
    }
  }'
```

## Database

### Create Database
```bash
bundle exec rake db:create
```

### Run Migrations
```bash
bundle exec rake db:migrate
```

### Load Seed Data
```bash
bundle exec rake db:seed
```

### Reset Database
```bash
bundle exec rake db:reset
```

### Run Specific Migration
```bash
bundle exec rake db:migrate:up VERSION=001_create_advocacia_tables
```

## Debugging

### Rails Console
```bash
bundle exec rails console

# Inside console:
Lawyer.count
Specialty.all
```

### Test with Debugging
```bash
bundle exec rspec lawyer_spec.rb --format documentation --no-fail-fast
```

## Docker

### Build Image
```bash
docker build -f Dockerfile.backend -t advocaciahub-backend .
```

### Run Container
```bash
docker run -it -p 3001:3001 \
  -e DATABASE_URL=postgres://user:password@localhost:5432/advocaciahub \
  advocaciahub-backend
```

## CI/CD

### GitHub Actions
Tests run automatically on:
- Push to `main` or `develop` branch
- Pull requests to `main` or `develop` branch

View logs in `.github/workflows/rspec.yml`

## Test Coverage Targets
- **Overall:** >80%
- **Per File:** ≥75%
- **Focus Areas:**
  - Model validations
  - Associations
  - API endpoints
  - Scopes and filters

## Troubleshooting

### "PG::ConnectionBad" Error
Ensure PostgreSQL is running:
```bash
# macOS
brew services start postgresql

# Linux (Ubuntu/Debian)
sudo service postgresql start

# Windows
# Use PostgreSQL installer or Docker
```

### "Bundler could not find compatible package"
Regenerate lock file:
```bash
bundle install --redownload
```

### Database Already Exists
```bash
bundle exec rake db:drop db:create db:migrate
```

### Tests Timeout
Increase timeout in `rails_helper.rb` or specific test:
```ruby
RSpec.configure do |config|
  config.timeout = 30
end
```

---

For more information, see `FOUNDATION-SUMMARY.md`
