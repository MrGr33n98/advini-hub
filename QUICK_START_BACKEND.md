# Quick Start Guide - Backend SaaS Features

## 🚀 Running the Migrations

### Step 1: Navigate to Backend Directory
```bash
cd C:\Users\Bobi\Desktop\advini-hub\backend_rails
```

### Step 2: Check Database Connection
```bash
rails db:version
```

### Step 3: Run Migrations
```bash
rails db:migrate
```

This will create all SaaS tables:
- leads
- lead_activities
- subscriptions
- plans
- sponsored_campaigns
- articles
- article_comments

And add new columns to users table.

### Step 4: Seed Sample Data
```bash
rails db:seed
```

This will create:
- 4 SaaS plans (Grátis, Pro, Escritório, Enterprise)
- 5 sample leads with scores
- 2 sponsored campaigns
- 3 sample articles

### Step 5: Start Rails Server
```bash
rails server
```

### Step 6: Access Admin Panel
Open browser: `http://localhost:3000/admin`

Login:
- Email: `admin@advocaciahub.com`
- Password: `temporary123`

---

## 📊 What You'll See in Admin

### Dashboard
- SaaS metrics overview
- Recent leads
- Recent articles
- Active plans
- Revenue stats

### Menu Items
1. **Dashboard** - Overview with SaaS metrics
2. **Membros** - User/member management
3. **Leads** - Lead management with scoring
4. **Planos SaaS** - Subscription plans
5. **Assinaturas** - User subscriptions
6. **Patrocinados** - Ad campaigns
7. **Artigos** - Content management
   - **Comentários** - Comment moderation

---

## 🔍 Testing Features

### Test Lead Scoring
1. Go to Admin → Leads
2. Click on any lead
3. See score breakdown (demographic, behavioral, etc.)
4. Click "Recalculate Score" action

### Test Campaign Approval
1. Go to Admin → Patrocinados
2. Click on a campaign
3. Click "Approve" action
4. Campaign status changes to active

### Test Article Publishing
1. Go to Admin → Artigos
2. Click on a draft article
3. Click "Publish" action
4. Article gets published_at timestamp

### Test Member Management
1. Go to Admin → Membros
2. Click on a user
3. See their plan, usage, login history
4. Suspend/activate user

---

## 🛠️ Troubleshooting

### If migration fails:
```bash
rails db:rollback
rails db:migrate
```

### If seed fails:
```bash
rails db:reset  # WARNING: Deletes all data
rails db:seed
```

### Check migration status:
```bash
rails db:migrate:status
```

### View Rails console:
```bash
rails console
```

Then test:
```ruby
Lead.count
Plan.all
SponsoredCampaign.metrics
Article.metrics
```

---

## 📝 Sample Data Created

### Plans
| Name | Price/Mo | Features |
|------|----------|----------|
| Grátis | R$0 | Basic profile, 5 contacts |
| Pro | R$99 | Full profile, unlimited contacts |
| Escritório | R$299 | Up to 10 lawyers, full analytics |
| Enterprise | R$999 | Unlimited, white-label |

### Leads
- 5 leads with scores from 45 to 92
- Various sources (Google Ads, Facebook, LinkedIn, Organic, Referral)
- Different statuses (New, Contacted, Qualified, Proposal, Negotiation)

### Campaigns
- 1 Featured Profile campaign (Dr. João Silva)
- 1 Banner Ad campaign (Silva & Associados)

### Articles
- 2 published articles (Commercial Law, Family Law)
- 1 draft article (Tax Planning)

---

## 🎯 Next Steps

1. **Explore Admin Panel**: Click through all menus
2. **Check Metrics**: View dashboard for aggregated data
3. **Create New Records**: Test the forms
4. **Run Reports**: Use filters and search
5. **Integrate API**: Create API controllers for frontend

---

**Need Help?**

Check the full documentation:
- `BACKEND_SAAS_IMPLEMENTATION.md` - Complete backend docs
- `ENTERPRISE_DASHBOARD_IMPLEMENTATION.md` - Frontend docs
