# AdvocaciaHub - Quick Start Guide

## 🚀 Getting Started (5 minutes)

### 1. Prerequisites
```bash
# Ensure you have:
ruby -v        # Should be 3.1.2
rails -v       # Should be 7.0.x
postgres -V    # Should be 13+
```

### 2. Install & Setup
```bash
cd backend_rails
bundle install
bundle exec rake db:create
bundle exec rake db:migrate
bundle exec rake db:seed
```

### 3. Start Server
```bash
bundle exec rails server -b 0.0.0.0 -p 3001
```

### 4. Verify
- Open http://localhost:3001/admin
- Login with admin@advocaciahub.com / temporary123
- ✅ You should see all models and data

---

## 🧪 Running Tests

```bash
# All tests (should take ~10 seconds)
bundle exec rspec

# With coverage report
COVERAGE=true bundle exec rspec

# Just model tests
bundle exec rspec lawyer_spec.rb appointment_spec.rb contact_message_spec.rb

# Just API tests
bundle exec rspec *_controller_spec.rb
```

---

## 📚 API Endpoints

### Lawyers
```bash
# Get all lawyers
curl http://localhost:3001/api/v1/lawyers

# Filter by city
curl "http://localhost:3001/api/v1/lawyers?city=São%20Paulo"

# Get specific lawyer
curl http://localhost:3001/api/v1/lawyers/1
```

### Appointments
```bash
# Create appointment (POST)
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

### Contact Messages
```bash
# Create message (POST, anonymous allowed)
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

---

## 📖 Database Schema

### Key Models
- **Lawyer** - Legal professionals (full_name, oab_number, years_experience, specialties)
- **Specialty** - Legal areas (name, slug, hierarchical)
- **Office** - Law firms (trade_name, city, state)
- **Appointment** - Scheduled meetings (lawyer, client, date, status)
- **Review** - Lawyer reviews (rating 1-5, moderation_status)
- **ContactMessage** - Client inquiries (anonymous or authenticated)
- **User** - System users (email, role: client/lawyer/admin)
- **AdminUser** - Administrators for ActiveAdmin

---

## 🔧 Common Tasks

### Reset Everything
```bash
bundle exec rake db:drop db:create db:migrate db:seed
```

### Access Rails Console
```bash
bundle exec rails console

# Examples:
Lawyer.count
Specialty.pluck(:name)
Appointment.where(status: 'scheduled')
```

### Debug a Failing Test
```bash
# Run with verbose output
bundle exec rspec lawyer_spec.rb --format documentation --no-fail-fast

# Run specific test
bundle exec rspec lawyer_spec.rb -e "validates presence"
```

### Clear Cache
```bash
bundle exec rake cache:clear
```

---

## 📊 Seed Data Available

After running `bundle exec rake db:seed`, you'll have:

| Type | Count | Examples |
|------|-------|----------|
| Specialties | 15 | Civil, Penal, Trabalhista, Família... |
| Offices | 3 | Silva & Associados (SP), Costa Pereira (RJ)... |
| Lawyers | 10 | João Silva, Maria Costa, Carlos Pereira... |
| Reviews | 10 | All approved, 4-5 stars |
| Appointments | 3 | Future dates, various statuses |

**Admin User:**
- Email: admin@advocaciahub.com
- Password: temporary123

---

## 🐛 Troubleshooting

### Error: "PG::ConnectionBad"
```bash
# Ensure PostgreSQL is running
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
# Then try again: bundle exec rake db:create
```

### Error: "Bundler could not find compatible package"
```bash
bundle install --redownload
```

### Tests failing with "database does not exist"
```bash
bundle exec rake db:create db:test:prepare
bundle exec rspec
```

### ActiveAdmin showing blank or 500 error
- Clear cache: `bundle exec rake cache:clear`
- Check Ransack is properly installed: `gem list | grep ransack`
- Verify models have ransackable methods

---

## 📝 Documentation Files

- **FOUNDATION-SUMMARY.md** - Complete milestone summary
- **EXECUTION_REPORT.md** - Detailed execution report
- **TEST_GUIDE.md** - Comprehensive testing guide
- **MODELS_REFERENCE.md** - Model associations and fields
- **VALIDATION_CHECKLIST.md** - Success criteria verification

---

## ✅ Verification Checklist

After setup, verify:

- [ ] `bundle exec rspec` passes with no failures
- [ ] http://localhost:3001/admin loads without errors
- [ ] Can login with admin@advocaciahub.com / temporary123
- [ ] All ActiveAdmin tabs accessible
- [ ] API endpoints return valid JSON
- [ ] Database has 40+ records from seeds
- [ ] Tests have >80% coverage

---

## 🚢 Deployment

### Docker
```bash
docker build -f Dockerfile.backend -t advocaciahub-backend .
docker run -p 3001:3001 \
  -e DATABASE_URL=postgres://user:pass@host/db \
  advocaciahub-backend
```

### CI/CD
Commits to `main` or `develop` branches automatically:
1. Run all RSpec tests
2. Check coverage >80%
3. Report results to GitHub

---

## 📞 Need Help?

1. Check documentation files
2. Review test examples in spec files
3. Check `backend_rails/TEST_GUIDE.md`
4. Check `MODELS_REFERENCE.md` for schema

---

**Status:** ✅ FOUNDATION Milestone Complete - Ready to Code!
