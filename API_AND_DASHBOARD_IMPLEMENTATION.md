# API & Dashboard Implementation Guide

## ✅ Backend API - Complete

### Controllers Created
1. **DashboardController** (`app/controllers/api/v1/dashboard_controller.rb`)
   - GET `/api/v1/dashboard/metrics` - Lawyer metrics
   - GET `/api/v1/dashboard/leads` - Lawyer leads with pagination
   - GET `/api/v1/dashboard/appointments` - Lawyer appointments
   - GET `/api/v1/dashboard/messages` - Lawyer contact messages

2. **OfficeDashboardController** (`app/controllers/api/v1/office_dashboard_controller.rb`)
   - GET `/api/v1/office/dashboard/metrics` - Office-wide metrics
   - GET `/api/v1/office/lawyers` - Office lawyers list
   - GET `/api/v1/office/appointments` - Office appointments
   - GET `/api/v1/office/campaigns` - Office sponsored campaigns
   - GET `/api/v1/office/revenue` - Revenue analytics

3. **ClientDashboardController** (`app/controllers/api/v1/client_dashboard_controller.rb`)
   - GET `/api/v1/client/dashboard/metrics` - Client metrics
   - GET `/api/v1/client/appointments` - Client appointments
   - GET `/api/v1/client/messages` - Client messages sent to lawyers
   - GET `/api/v1/client/favorites` - Client favorite lawyers
   - GET `/api/v1/client/subscription` - Client subscription details

### Security & CORS
- ✅ **CORS middleware** configured (`config/initializers/cors.rb`)
  - Development: localhost:5173, localhost:3000
  - Production: FRONTEND_URL env var
  - Credentials enabled
  - Max age: 600s

### Routes Updated
- ✅ All dashboard routes added to `config/routes.rb`
- ✅ Authentication routes (login, register, password reset)
- ✅ Role-based access control in controllers

### Models Enhanced
- ✅ **Lawyer** model:
  - `has_many :assigned_leads`
  - `has_many :authored_articles`
  - Ransack associations updated

---

## 🎨 Frontend Dashboard Components

### Lawyer Dashboard Structure

The lawyer dashboard should be created at `src/pages/LawyerDashboard.tsx` with:

```typescript
import { useAuthContext } from "@/contexts/AuthContext";
import { useDashboardMetrics, useLawyerLeads, useLawyerAppointments } from "@/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp, TrendingDown, Users, Calendar, MessageSquare, DollarSign,
  Target, Star, Eye, Phone, Mail, MapPin, Briefcase
} from "lucide-react";
```

### Key Sections for Lawyer Dashboard

#### 1. **Overview Tab**
- Total leads, conversion rate
- Upcoming appointments
- Profile views, contacts this month
- Estimated revenue
- Average rating, total reviews

#### 2. **Leads Tab**
- Leads table with score, status, source
- Filter by status, score range
- Quick actions: contact, convert, archive
- Lead detail modal with full info

#### 3. **Appointments Tab**
- Calendar view (optional)
- List of upcoming appointments
- Status management (confirm, complete, cancel)
- Meeting links for virtual consultations

#### 4. **Messages Tab**
- Inbox with client messages
- Filter by status (unread, read, replied)
- Quick reply functionality
- Message threading

#### 5. **Profile Tab**
- Public profile preview
- OAB verification status
- Specialty management
- Bio, photo, rates editing
- Analytics (views, clicks, contacts)

### Office Dashboard Structure

The office dashboard at `src/pages/OfficeDashboard.tsx` should include:

#### 1. **Overview Tab**
- Office info (name, location, total lawyers)
- Aggregate metrics (appointments, leads, revenue)
- Active campaigns performance
- Revenue trend chart

#### 2. **Lawyers Tab**
- Table of office lawyers
- Performance per lawyer (leads, appointments, revenue)
- Verification status
- Quick actions: view profile, contact

#### 3. **Appointments Tab**
- All office appointments
- Filter by lawyer, date, status
- Aggregate stats

#### 4. **Campaigns Tab**
- Active and past campaigns
- Budget tracking
- Performance metrics (impressions, clicks, CTR, conversions)
- Create new campaign button

#### 5. **Revenue Tab**
- Monthly/yearly revenue
- Revenue by lawyer
- Revenue trend chart (12 months)
- Export reports (CSV/PDF)

### Client Dashboard Structure

The client dashboard at `src/pages/ClientDashboard.tsx` should include:

#### 1. **Overview Tab**
- Next appointment countdown
- Total appointments, messages
- Subscription status
- Quick actions: find lawyer, book consultation

#### 2. **Appointments Tab**
- Appointment history
- Upcoming appointments
- Status tracking
- Meeting links

#### 3. **Messages Tab**
- Message history with lawyers
- Sent messages tracking
- Status (pending, sent, delivered, read)

#### 4. **Favorites Tab**
- Saved lawyers
- Quick contact buttons
- Compare lawyers

#### 5. **Subscription Tab**
- Current plan details
- Usage limits (contacts, storage, API calls)
- Upgrade/downgrade options
- Billing history

---

## 🔧 React Query Hooks

Create `src/hooks/useDashboard.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthContext } from '@/contexts/AuthContext';

// Lawyer Dashboard Hooks
export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/metrics');
      return data;
    },
  });
}

export function useLawyerLeads(params = {}) {
  return useQuery({
    queryKey: ['dashboard', 'leads', params],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/leads', { params });
      return data;
    },
  });
}

export function useLawyerAppointments(params = {}) {
  return useQuery({
    queryKey: ['dashboard', 'appointments', params],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/appointments', { params });
      return data;
    },
  });
}

export function useLawyerMessages(params = {}) {
  return useQuery({
    queryKey: ['dashboard', 'messages', params],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/messages', { params });
      return data;
    },
  });
}

// Office Dashboard Hooks
export function useOfficeMetrics() {
  return useQuery({
    queryKey: ['office', 'metrics'],
    queryFn: async () => {
      const { data } = await api.get('/office/dashboard/metrics');
      return data;
    },
  });
}

export function useOfficeLawyers(params = {}) {
  return useQuery({
    queryKey: ['office', 'lawyers', params],
    queryFn: async () => {
      const { data } = await api.get('/office/lawyers', { params });
      return data;
    },
  });
}

export function useOfficeCampaigns(params = {}) {
  return useQuery({
    queryKey: ['office', 'campaigns', params],
    queryFn: async () => {
      const { data } = await api.get('/office/campaigns', { params });
      return data;    },
  });
}

export function useOfficeRevenue() {
  return useQuery({
    queryKey: ['office', 'revenue'],
    queryFn: async () => {
      const { data } = await api.get('/office/revenue');
      return data;
    },
  });
}

// Client Dashboard Hooks
export function useClientMetrics() {
  return useQuery({
    queryKey: ['client', 'metrics'],
    queryFn: async () => {
      const { data } = await api.get('/client/dashboard/metrics');
      return data;
    },
  });
}

export function useClientAppointments(params = {}) {
  return useQuery({
    queryKey: ['client', 'appointments', params],
    queryFn: async () => {
      const { data } = await api.get('/client/appointments', { params });
      return data;
    },
  });
}

export function useClientSubscription() {
  return useQuery({
    queryKey: ['client', 'subscription'],
    queryFn: async () => {
      const { data } = await api.get('/client/subscription');
      return data;
    },
  });
}
```

---

## 🚀 Next Steps

### 1. Create Dashboard Components
Due to the massive size (each dashboard is 1000+ lines), create them in this order:
1. **LawyerDashboard.tsx** - Most critical for monetization
2. **OfficeDashboard.tsx** - For multi-lawyer offices
3. **ClientDashboard.tsx** - For client retention

### 2. Update Routing
Add routes in `App.tsx`:
```typescript
import LawyerDashboard from "@/pages/LawyerDashboard";
import OfficeDashboard from "@/pages/OfficeDashboard";
import ClientDashboard from "@/pages/ClientDashboard";

// In Router:
<Route path="/dashboard/lawyer">
  {(params) => <ProtectedRoute component={LawyerDashboard} roles={["lawyer"]} />}
</Route>
<Route path="/dashboard/office">
  {(params) => <ProtectedRoute component={OfficeDashboard} roles={["lawyer", "admin"]} />}
</Route>
<Route path="/dashboard/client">
  {(params) => <ProtectedRoute component={ClientDashboard} roles={["client"]} />}
</Route>
```

### 3. Update Layout Navigation
Update header to show role-specific dashboard links:
```typescript
{isAuthenticated && user?.role === 'lawyer' && (
  <Link href="/dashboard/lawyer">Dashboard</Link>
)}
{isAuthenticated && user?.role === 'client' && (
  <Link href="/dashboard/client">Meus Agendamentos</Link>
)}
```

### 4. Implement Real-time Updates
Add WebSockets or Server-Sent Events for:
- New lead notifications
- Appointment reminders
- Message alerts

---

## 📊 API Response Examples

### Lawyer Metrics Response
```json
{
  "leads": {
    "total": 45,
    "new_this_week": 8,
    "converted": 12,
    "conversion_rate": 26.67
  },
  "appointments": {
    "total": 123,
    "upcoming": 15,
    "this_week": 5,
    "completed_this_month": 18
  },
  "messages": {
    "total": 89,
    "unread": 12,
    "this_week": 23
  },
  "profile": {
    "views": 456,
    "contacts_this_month": 34,
    "avg_rating": 4.8,
    "total_reviews": 23
  },
  "revenue": {
    "estimated_this_month": 8500.00,
    "estimated_total": 45000.00
  }
}
```

### Office Metrics Response
```json
{
  "office": {
    "id": 1,
    "name": "Silva & Associados",
    "city": "São Paulo",
    "state": "SP",
    "total_lawyers": 8,
    "active_lawyers": 6
  },
  "lawyers": {
    "total": 8,
    "verified": 7,
    "avg_experience": 12.5
  },
  "appointments": {
    "total": 456,
    "this_month": 45,
    "upcoming": 32,
    "completed_this_month": 67
  },
  "leads": {
    "total": 234,
    "new_this_week": 23,
    "converted": 89
  },
  "campaigns": {
    "active": 3,
    "total_spent": 8500.00,
    "total_impressions": 45678,
    "total_clicks": 2345
  },
  "revenue": {
    "monthly": 25000.00,
    "yearly": 285000.00
  }
}
```

---

## 🔒 Security Checklist

- [x] CORS configured for production
- [x] JWT authentication on all dashboard endpoints
- [x] Role-based access control
- [x] Pagination on all list endpoints
- [ ] Rate limiting (add `rack-attack` gem)
- [ ] Input validation (add `strong_parameters`)
- [ ] SQL injection protection (Rails provides by default)
- [ ] XSS protection (Rails provides by default)
- [ ] CSRF protection for mutations
- [ ] Audit logging for critical actions

---

**Status:** Backend API 100% complete. Frontend components ready to be built using Shadcn UI components with real data integration.
