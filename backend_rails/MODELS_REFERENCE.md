# AdvocaciaHub Models Reference

## Core Models

### Lawyer
- **Table:** lawyers
- **Key Fields:** full_name, oab_number, oab_state, city, state, bio, years_experience, hourly_rate_min/max, avg_rating, total_reviews, is_verified
- **Associations:**
  - belongs_to :office (optional)
  - has_many :reviews (destroy)
  - has_many :contact_messages (destroy)
  - has_many :appointments (destroy)
  - has_and_belongs_to_many :specialties (join_table: lawyer_specialties)
  - belongs_to :user (optional)
- **Validations:** full_name, oab_number, city, state presence; oab_number uniqueness
- **Scopes:** searchable via Ransack
- **ActiveStorage:** photo attachment

### Specialty
- **Table:** specialties
- **Key Fields:** name, description, slug, parent_id
- **Associations:**
  - has_and_belongs_to_many :lawyers (join_table: lawyer_specialties)
  - belongs_to :parent (optional, self-referencing)
  - has_many :children (dependent: destroy, class_name: Specialty, foreign_key: parent_id)
- **Validations:** name presence
- **Examples:** Direito Civil, Direito Penal, Direito Trabalhista, etc.

### Office
- **Table:** offices
- **Key Fields:** trade_name, city, state, lawyer_count, logo_url
- **Associations:**
  - has_many :lawyers (dependent: nullify)
  - has_many :appointments (dependent: destroy)
- **Validations:** trade_name, city, state presence
- **ActiveStorage:** logo attachment

### Appointment
- **Table:** appointments
- **Key Fields:** client_name, client_email, client_phone, appointment_date, service_type, notes, fee_amount, meeting_link
- **Associations:**
  - belongs_to :lawyer
  - belongs_to :client (class_name: User, optional)
  - belongs_to :office (optional)
- **Enums:**
  - status: scheduled, confirmed, completed, cancelled, missed
  - appointment_type: consultation, meeting, hearing, document_review
- **Validations:** client_name, client_email, appointment_date, service_type presence; email format; future date
- **Scopes:** .upcoming, .past, .by_lawyer(id), .by_status(status)

### Review
- **Table:** reviews
- **Key Fields:** rating (1-5), comment, case_type, case_outcome, moderation_status, client_name
- **Associations:** belongs_to :lawyer
- **Enums:** moderation_status: pending, approved, rejected
- **Validations:** rating (1-5 inclusive), comment (minimum 20 chars)

### ContactMessage
- **Table:** contact_messages
- **Key Fields:** client_name, client_email, client_phone, message, case_type, status
- **Associations:**
  - belongs_to :lawyer
  - belongs_to :sender (polymorphic, optional) - Can be User or anonymous
- **Enums:** status: pending, sent, delivered, read
- **Validations:** client_name, client_email, message presence; email format
- **Scopes:** .unread, .by_lawyer(id)

### User
- **Table:** users
- **Key Fields:** email, password_digest
- **Associations:**
  - has_many :appointments (foreign_key: client_id)
  - has_one :lawyer_profile (class_name: Lawyer, foreign_key: user_id)
- **Enums:** role: client, lawyer, admin
- **Validations:** email presence & uniqueness; password (6+ chars, if new/present)
- **Methods:** jwt_token, password_required?

### AdminUser
- **Table:** admin_users
- **Key Fields:** email, encrypted_password
- **Devise:** database_authenticatable, recoverable, rememberable, validatable
- **Used By:** ActiveAdmin
- **Default Credentials:** admin@advocaciahub.com / temporary123

## Ransack Integration (4.x)

All models support Ransack searching through ransackable_attributes and ransackable_associations methods:

```ruby
# Example ransack queries
Lawyer.ransack(full_name_cont: 'João').result
Lawyer.ransack(specialties_name_eq: 'Direito Civil').result
Appointment.ransack(status_eq: 'scheduled').result
```

## Database Relationships

```
Office (1) ──────── (Many) Lawyers
  │                    │
  │                    ├──── (Many) Appointments
  │                    ├──── (Many) Reviews
  │                    ├──── (Many) ContactMessages
  │                    └──── (Many:Many) Specialties
  │                              │
  │                    ┌─────────┤
  └────────── (1) Appointments (1) ──────── (1) User (client)
                         │
                         └────── (1) Office

Specialty (Parent) ──────── (1) Specialty (Child)
```

## API Endpoints

### Lawyers
- `GET /api/v1/lawyers` - List all lawyers with filters (city, state, specialty, min_rating, search)
- `GET /api/v1/lawyers/:id` - Get lawyer details

### Specialties
- `GET /api/v1/specialties` - List all specialties
- `GET /api/v1/specialties/:id` - Get specialty details

### Offices
- `GET /api/v1/offices` - List all offices
- `GET /api/v1/offices/:id` - Get office details

### Appointments
- `GET /api/v1/appointments` - List appointments (role-based)
- `POST /api/v1/appointments` - Create appointment
- `GET /api/v1/appointments/:id` - Get appointment details
- `PUT /api/v1/appointments/:id` - Update appointment
- `DELETE /api/v1/appointments/:id` - Cancel appointment

### ContactMessages
- `GET /api/v1/contact_messages` - List messages (role-based)
- `POST /api/v1/contact_messages` - Create message (anonymous allowed)
- `GET /api/v1/contact_messages/:id` - Get message details (marks as read)

### Authentication
- `POST /api/v1/login` - Create JWT token
- `DELETE /api/v1/logout` - Invalidate token

## ActiveAdmin Resources

- AdminUsers (system administrators)
- Lawyers (browse and filter)
- Specialties (manage)
- Offices (manage)
- Appointments (view and manage)
- Reviews (moderation)
- ContactMessages (moderation)

## Seed Data

Default seed includes:
- 1 AdminUser (admin@advocaciahub.com)
- 15 Specialties (real Brazilian legal areas)
- 3 Offices (São Paulo, Rio de Janeiro, Belo Horizonte)
- 10 Lawyers (with diverse specialties and experience)
- 10 Reviews (approved, 4-5 stars)
- 3 Appointments (future dates)

Run with: `bundle exec rake db:seed`
