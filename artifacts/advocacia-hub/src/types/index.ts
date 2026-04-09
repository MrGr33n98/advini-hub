// types/index.ts
export interface Lawyer {
  id: number;
  full_name: string;
  oab_number: string;
  oab_state: string;
  city: string;
  state: string;
  bio: string;
  years_experience: number;
  hourly_rate_min?: number;
  hourly_rate_max?: number;
  is_verified: boolean;
  avg_rating: number;
  total_reviews: number;
  photo_url?: string;
  specialties: Specialty[];
  office?: Office;
  has_account: boolean;
}

export interface Office {
  id: number;
  trade_name: string;
  city: string;
  state: string;
  lawyer_count: number;
  logo_url?: string;
}

export interface Specialty {
  id: number;
  name: string;
  description?: string;
  slug: string;
}

export interface Appointment {
  id: number;
  lawyer_id: number;
  client_id?: number;
  office_id?: number;
  client_name: string;
  client_email: string;
  client_phone?: string;
  appointment_date: string;
  notes?: string;
  service_type: string;
  appointment_type: 'consultation' | 'meeting' | 'hearing' | 'document_review';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'missed';
  fee_amount?: number;
  meeting_link?: string;
}

export interface ContactMessage {
  id: number;
  lawyer_id: number;
  client_name: string;
  client_email: string;
  client_phone?: string;
  message: string;
  case_type?: string;
  status: 'pending' | 'sent' | 'delivered' | 'read';
}

export interface User {
  id: number;
  email: string;
  role: 'client' | 'lawyer' | 'admin';
  first_name?: string;
  last_name?: string;
}

// ========================================
// SAAS - LEADS MANAGEMENT
// ========================================

export interface Lead {
  id: number;
  email: string;
  name: string;
  phone?: string;
  company?: string;
  job_title?: string;
  source: 'website' | 'google_ads' | 'facebook' | 'linkedin' | 'referral' | 'organic' | 'blog' | 'event';
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiation' | 'converted' | 'lost';
  score: number; // 0-100 lead score
  score_factors?: LeadScoreFactors;
  specialty_interest?: string;
  estimated_case_value?: number;
  location?: {
    city: string;
    state: string;
    country: string;
  };
  tags: string[];
  notes?: string;
  assigned_lawyer_id?: number;
  created_at: string;
  updated_at: string;
  last_contacted_at?: string;
  converted_at?: string;
  conversion_value?: number;
  email_opened_count: number;
  email_clicked_count: number;
  last_email_opened_at?: string;
  engagement_level: 'low' | 'medium' | 'high' | 'very_high';
}

export interface LeadScoreFactors {
  demographic_score: number; // 0-30
  behavioral_score: number; // 0-30
  firmographic_score: number; // 0-20
  intent_score: number; // 0-20
  engagement_score: number; // 0-100
  recency_score: number; // 0-100
}

export interface LeadActivity {
  id: number;
  lead_id: number;
  activity_type: 'email_opened' | 'email_clicked' | 'form_submitted' | 'page_viewed' | 'downloaded' | 'webinar_attended' | 'call_made' | 'meeting_scheduled';
  description: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface LeadMetrics {
  total_leads: number;
  new_leads_this_month: number;
  converted_leads: number;
  conversion_rate: number;
  average_score: number;
  average_time_to_conversion: number; // days
  leads_by_source: Record<string, number>;
  leads_by_status: Record<string, number>;
  revenue_generated: number;
  cost_per_lead: number;
  roi: number;
}

// ========================================
// SAAS - MEMBER MANAGEMENT
// ========================================

export interface Member {
  id: number;
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: 'client' | 'lawyer' | 'admin' | 'paralegal' | 'intern';
  plan_type: 'free' | 'pro' | 'escritorio' | 'enterprise' | 'custom';
  status: 'active' | 'suspended' | 'pending' | 'trial' | 'expired';
  avatar_url?: string;
  phone?: string;
  company?: string;
  department?: string;
  
  // Lawyer-specific fields
  oab_number?: string;
  oab_state?: string;
  specialties?: string[];
  years_experience?: number;
  hourly_rate_min?: number;
  hourly_rate_max?: number;
  is_verified?: boolean;
  
  // Subscription details
  subscription_start?: string;
  subscription_end?: string;
  trial_ends_at?: string;
  last_login_at?: string;
  login_count: number;
  
  // Usage metrics
  contacts_used: number;
  contacts_limit: number;
  storage_used_mb: number;
  storage_limit_mb: number;
  api_calls_this_month: number;
  api_calls_limit: number;
  
  created_at: string;
  updated_at: string;
}

export interface MemberMetrics {
  total_members: number;
  active_members: number;
  trial_members: number;
  churned_members: number;
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
  average_lifetime: number; // days
  churn_rate: number; // percentage
  members_by_plan: Record<string, number>;
  members_by_status: Record<string, number>;
  new_members_this_month: number;
  growth_rate: number;
}

// ========================================
// SAAS - PLAN MANAGEMENT
// ========================================

export interface Plan {
  id: number;
  name: string;
  slug: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  is_active: boolean;
  is_popular: boolean;
  display_order: number;
  
  // Features
  features: PlanFeature[];
  
  // Limits
  max_contacts_per_month?: number;
  max_specialties?: number;
  max_lawyers?: number;
  max_storage_gb?: number;
  max_api_calls_per_month?: number;
  has_analytics: boolean;
  has_blog_access: boolean;
  has_priority_support: boolean;
  has_api_access: boolean;
  has_custom_branding: boolean;
  has_white_label: boolean;
  
  // Metadata
  stripe_price_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PlanFeature {
  id: string;
  label: string;
  included: boolean;
  tooltip?: string;
}

export interface Subscription {
  id: number;
  member_id: number;
  plan_id: number;
  plan: Plan;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'unpaid';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  canceled_at?: string;
  trial_start?: string;
  trial_end?: string;
  amount: number;
  currency: string;
  payment_method?: string;
  last_payment_date?: string;
  next_payment_date?: string;
}

export interface PlanMetrics {
  total_subscriptions: number;
  active_subscriptions: number;
  mrr: number;
  arr: number;
  average_revenue_per_user: number;
  plan_distribution: Record<string, { count: number; percentage: number; mrr: number }>;
  upgrades_this_month: number;
  downgrades_this_month: number;
  cancellations_this_month: number;
}

// ========================================
// SAAS - SPONSORED (PATROCINADOS)
// ========================================

export interface Sponsored {
  id: number;
  sponsor_type: 'lawyer' | 'office';
  sponsor_id: number;
  sponsor_name: string;
  sponsor_email: string;
  
  // Campaign details
  campaign_name: string;
  campaign_type: 'featured_profile' | 'top_search' | 'banner_ad' | 'homepage_featured' | 'category_sponsorship' | 'blog_sponsorship';
  status: 'draft' | 'pending_approval' | 'active' | 'paused' | 'completed' | 'cancelled';
  
  // Budget and billing
  budget_total: number;
  budget_spent: number;
  budget_remaining: number;
  cost_per_click: number;
  daily_budget?: number;
  billing_type: 'cpc' | 'cpm' | 'flat_rate' | 'monthly';
  
  // Performance metrics
  impressions: number;
  clicks: number;
  ctr: number; // Click-through rate
  conversions: number;
  conversion_rate: number;
  cost_per_conversion: number;
  
  // Targeting
  target_specialties?: string[];
  target_locations?: string[];
  target_keywords?: string[];
  
  // Scheduling
  start_date: string;
  end_date?: string;
  schedule_type: 'continuous' | 'scheduled' | 'ongoing';
  
  // Creative assets
  banner_url?: string;
  landing_page_url?: string;
  custom_html?: string;
  
  // Approval
  approved_by?: number;
  approved_at?: string;
  rejection_reason?: string;
  
  created_at: string;
  updated_at: string;
}

export interface SponsoredMetrics {
  total_campaigns: number;
  active_campaigns: number;
  total_revenue: number;
  average_campaign_duration: number; // days
  average_roi: number;
  top_performers: Sponsored[];
  revenue_by_type: Record<string, number>;
  impressions_this_month: number;
  clicks_this_month: number;
  ctr_average: number;
}

// ========================================
// ARTICLES / BLOG MANAGEMENT
// ========================================

export interface Article {
  id: number;
  author_id: number;
  author_name: string;
  author_email: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url?: string;
  
  // SEO
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  
  // Categorization
  category?: string;
  tags: string[];
  related_specialties?: string[];
  
  // Publishing
  status: 'draft' | 'pending_review' | 'scheduled' | 'published' | 'archived';
  published_at?: string;
  scheduled_for?: string;
  created_at: string;
  updated_at: string;
  
  // Engagement metrics
  views: number;
  unique_views: number;
  average_read_time_seconds: number;
  likes: number;
  shares: number;
  comments_count: number;
  
  // SEO metrics
  seo_score: number; // 0-100
  readability_score: number; // 0-100
  
  // Settings
  is_featured: boolean;
  is_premium: boolean; // Requires subscription to read
  allow_comments: boolean;
  featured_image_url?: string;
  read_time_minutes: number;
}

export interface ArticleMetrics {
  total_articles: number;
  published_articles: number;
  draft_articles: number;
  total_views: number;
  total_likes: number;
  total_shares: number;
  average_views_per_article: number;
  top_articles: Article[];
  views_this_month: number;
  growth_rate: number;
  engagement_rate: number;
}

export interface ArticleComment {
  id: number;
  article_id: number;
  user_id?: number;
  user_name: string;
  user_email: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  created_at: string;
  parent_id?: number; // For nested comments
}