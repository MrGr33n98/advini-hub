import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MessageSquare,
  User,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Mail,
  Phone,
  Building,
  Briefcase,
  Star,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Award,
  FileText,
  Edit,
  Trash2,
  Settings,
  CreditCard,
  TrendingUpDown,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Megaphone,
  BookOpen,
  ThumbsUp,
  Share2,
  MessageCircle,
  EyeOff,
  CalendarDays,
  Timer,
  Link,
  Image as ImageIcon,
  Save,
  X,
  ChevronDown,
  RefreshCw,
  Send,
  UserPlus,
  UserCheck,
  UserX,
  AlertCircle,
  Info,
  Check,
  Copy,
  ExternalLink
} from "lucide-react";
import { Appointment, ContactMessage, Lead, LeadMetrics, Member, MemberMetrics, Plan, PlanMetrics, Sponsored, SponsoredMetrics, Article, ArticleMetrics } from "@/types";

// ========================================
// MOCK DATA GENERATORS
// ========================================

const generateMockLeads = (): Lead[] => [
  {
    id: 1,
    email: "maria.silva@email.com",
    name: "Maria Silva",
    phone: "+55 11 98765-4321",
    company: "Tech Solutions Ltda",
    job_title: "CEO",
    source: "google_ads",
    status: "qualified",
    score: 87,
    score_factors: {
      demographic_score: 25,
      behavioral_score: 28,
      firmographic_score: 18,
      intent_score: 16,
      engagement_score: 85,
      recency_score: 92
    },
    specialty_interest: "Direito Empresarial",
    estimated_case_value: 15000,
    location: { city: "São Paulo", state: "SP", country: "Brasil" },
    tags: ["high-value", "enterprise", "urgent"],
    notes: "Cliente interessado em reestruturação societária",
    assigned_lawyer_id: 1,
    created_at: "2026-04-01T10:00:00Z",
    updated_at: "2026-04-08T15:30:00Z",
    last_contacted_at: "2026-04-07T14:00:00Z",
    converted_at: undefined,
    conversion_value: undefined,
    email_opened_count: 12,
    email_clicked_count: 8,
    last_email_opened_at: "2026-04-08T09:15:00Z",
    engagement_level: "very_high"
  },
  {
    id: 2,
    email: "joao.santos@gmail.com",
    name: "João Santos",
    phone: "+55 21 97654-3210",
    source: "facebook",
    status: "contacted",
    score: 65,
    score_factors: {
      demographic_score: 18,
      behavioral_score: 20,
      firmographic_score: 12,
      intent_score: 15,
      engagement_score: 68,
      recency_score: 75
    },
    specialty_interest: "Direito Trabalhista",
    estimated_case_value: 8000,
    location: { city: "Rio de Janeiro", state: "RJ", country: "Brasil" },
    tags: ["individual", "trabalhista"],
    created_at: "2026-04-03T14:20:00Z",
    updated_at: "2026-04-07T11:00:00Z",
    last_contacted_at: "2026-04-06T16:30:00Z",
    email_opened_count: 5,
    email_clicked_count: 3,
    last_email_opened_at: "2026-04-07T10:00:00Z",
    engagement_level: "high"
  },
  {
    id: 3,
    email: "ana.costa@empresa.com.br",
    name: "Ana Costa",
    phone: "+55 31 96543-2109",
    company: "Indústria Brasil",
    job_title: "Diretora de RH",
    source: "linkedin",
    status: "proposal_sent",
    score: 92,
    score_factors: {
      demographic_score: 28,
      behavioral_score: 30,
      firmographic_score: 20,
      intent_score: 14,
      engagement_score: 95,
      recency_score: 88
    },
    specialty_interest: "Direito Trabalhista",
    estimated_case_value: 25000,
    location: { city: "Belo Horizonte", state: "MG", country: "Brasil" },
    tags: ["corporate", "high-value", "recorrente"],
    created_at: "2026-03-28T09:00:00Z",
    updated_at: "2026-04-08T16:45:00Z",
    last_contacted_at: "2026-04-08T14:00:00Z",
    email_opened_count: 18,
    email_clicked_count: 14,
    last_email_opened_at: "2026-04-08T16:30:00Z",
    engagement_level: "very_high"
  },
  {
    id: 4,
    email: "carlos.oliveira@hotmail.com",
    name: "Carlos Oliveira",
    source: "organic",
    status: "new",
    score: 45,
    score_factors: {
      demographic_score: 12,
      behavioral_score: 15,
      firmographic_score: 8,
      intent_score: 10,
      engagement_score: 42,
      recency_score: 55
    },
    specialty_interest: "Direito Civil",
    estimated_case_value: 5000,
    location: { city: "Curitiba", state: "PR", country: "Brasil" },
    tags: ["individual"],
    created_at: "2026-04-08T18:00:00Z",
    updated_at: "2026-04-08T18:00:00Z",
    email_opened_count: 0,
    email_clicked_count: 0,
    engagement_level: "low"
  },
  {
    id: 5,
    email: "fernanda.lima@techstartup.com",
    name: "Fernanda Lima",
    company: "StartupTech",
    job_title: "CTO",
    source: "referral",
    status: "negotiation",
    score: 78,
    specialty_interest: "Direito Digital",
    estimated_case_value: 18000,
    location: { city: "Florianópolis", state: "SC", country: "Brasil" },
    tags: ["startup", "tech", "medium-value"],
    created_at: "2026-04-02T11:30:00Z",
    updated_at: "2026-04-08T10:20:00Z",
    last_contacted_at: "2026-04-08T09:00:00Z",
    email_opened_count: 9,
    email_clicked_count: 6,
    last_email_opened_at: "2026-04-08T10:15:00Z",
    engagement_level: "high"
  }
];

const generateMockLeadMetrics = (): LeadMetrics => ({
  total_leads: 1247,
  new_leads_this_month: 156,
  converted_leads: 89,
  conversion_rate: 7.14,
  average_score: 68,
  average_time_to_conversion: 12,
  leads_by_source: {
    google_ads: 423,
    facebook: 287,
    linkedin: 198,
    organic: 156,
    referral: 98,
    blog: 85
  },
  leads_by_status: {
    new: 234,
    contacted: 312,
    qualified: 289,
    proposal_sent: 178,
    negotiation: 145,
    converted: 89,
    lost: 67
  },
  revenue_generated: 1245000,
  cost_per_lead: 45,
  roi: 285
});

const generateMockMembers = (): Member[] => [
  {
    id: 1,
    user_id: 101,
    email: "dr.ricardo@advocacia.com",
    first_name: "Ricardo",
    last_name: "Almeida",
    full_name: "Dr. Ricardo Almeida",
    role: "lawyer",
    plan_type: "escritorio",
    status: "active",
    phone: "+55 11 91234-5678",
    company: "Almeida Advocacia",
    oab_number: "123456",
    oab_state: "SP",
    specialties: ["Direito Empresarial", "Direito Tributário"],
    years_experience: 15,
    hourly_rate_min: 250,
    hourly_rate_max: 450,
    is_verified: true,
    subscription_start: "2026-01-01T00:00:00Z",
    subscription_end: "2027-01-01T00:00:00Z",
    last_login_at: "2026-04-09T08:30:00Z",
    login_count: 342,
    contacts_used: 87,
    contacts_limit: 9999,
    storage_used_mb: 2450,
    storage_limit_mb: 10240,
    api_calls_this_month: 1250,
    api_calls_limit: 10000,
    created_at: "2025-06-15T10:00:00Z",
    updated_at: "2026-04-09T08:30:00Z"
  },
  {
    id: 2,
    user_id: 102,
    email: "maria.jurista@email.com",
    first_name: "Maria",
    last_name: "Santos",
    full_name: "Dra. Maria Santos",
    role: "lawyer",
    plan_type: "pro",
    status: "active",
    phone: "+55 21 92345-6789",
    oab_number: "234567",
    oab_state: "RJ",
    specialties: ["Direito Civil", "Direito de Família"],
    years_experience: 8,
    hourly_rate_min: 150,
    hourly_rate_max: 300,
    is_verified: true,
    subscription_start: "2026-03-01T00:00:00Z",
    subscription_end: "2027-03-01T00:00:00Z",
    last_login_at: "2026-04-08T17:45:00Z",
    login_count: 156,
    contacts_used: 42,
    contacts_limit: 100,
    storage_used_mb: 850,
    storage_limit_mb: 5120,
    api_calls_this_month: 450,
    api_calls_limit: 5000,
    created_at: "2026-02-20T14:00:00Z",
    updated_at: "2026-04-08T17:45:00Z"
  },
  {
    id: 3,
    user_id: 103,
    email: "cliente@email.com",
    first_name: "João",
    last_name: "Silva",
    full_name: "João Silva",
    role: "client",
    plan_type: "free",
    status: "active",
    last_login_at: "2026-04-07T12:00:00Z",
    login_count: 23,
    contacts_used: 3,
    contacts_limit: 5,
    storage_used_mb: 50,
    storage_limit_mb: 512,
    api_calls_this_month: 0,
    api_calls_limit: 0,
    created_at: "2026-03-15T09:00:00Z",
    updated_at: "2026-04-07T12:00:00Z"
  },
  {
    id: 4,
    user_id: 104,
    email: "admin@advocacia.com",
    first_name: "Admin",
    last_name: "System",
    full_name: "Admin System",
    role: "admin",
    plan_type: "enterprise",
    status: "active",
    last_login_at: "2026-04-09T07:00:00Z",
    login_count: 892,
    contacts_used: 0,
    contacts_limit: 99999,
    storage_used_mb: 15000,
    storage_limit_mb: 102400,
    api_calls_this_month: 8500,
    api_calls_limit: 100000,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2026-04-09T07:00:00Z"
  }
];

const generateMockMemberMetrics = (): MemberMetrics => ({
  total_members: 3456,
  active_members: 2890,
  trial_members: 234,
  churned_members: 156,
  mrr: 287500,
  arr: 3450000,
  average_lifetime: 245,
  churn_rate: 4.5,
  members_by_plan: {
    free: 1234,
    pro: 1456,
    escritorio: 678,
    enterprise: 88
  },
  members_by_status: {
    active: 2890,
    trial: 234,
    suspended: 89,
    expired: 156,
    pending: 87
  },
  new_members_this_month: 178,
  growth_rate: 5.4
});

const generateMockPlans = (): Plan[] => [
  {
    id: 1,
    name: "Grátis",
    slug: "gratis",
    description: "Para quem está começando e quer conhecer a plataforma",
    price_monthly: 0,
    price_yearly: 0,
    currency: "BRL",
    is_active: true,
    is_popular: false,
    display_order: 1,
    features: [
      { id: "profile_basic", label: "Perfil básico", included: true },
      { id: "oab_verify", label: "Verificação OAB", included: true },
      { id: "contacts_5", label: "5 contatos/mês", included: true },
      { id: "specialty_1", label: "1 especialidade", included: true },
      { id: "search_standard", label: "Listagem padrão", included: true }
    ],
    max_contacts_per_month: 5,
    max_specialties: 1,
    max_lawyers: 1,
    max_storage_gb: 0.5,
    max_api_calls_per_month: 0,
    has_analytics: false,
    has_blog_access: false,
    has_priority_support: false,
    has_api_access: false,
    has_custom_branding: false,
    has_white_label: false,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2026-01-15T10:00:00Z"
  },
  {
    id: 2,
    name: "Pro",
    slug: "pro",
    description: "Para advogados autônomos que querem crescer",
    price_monthly: 99,
    price_yearly: 990,
    currency: "BRL",
    is_active: true,
    is_popular: true,
    display_order: 2,
    features: [
      { id: "profile_full", label: "Perfil completo", included: true },
      { id: "contacts_unlimited", label: "Contatos ilimitados", included: true },
      { id: "specialties_5", label: "5 especialidades", included: true },
      { id: "search_boost", label: "Boost moderado na busca", included: true },
      { id: "analytics_basic", label: "Estatísticas básicas", included: true },
      { id: "blog_publish", label: "Publicação no blog", included: true },
      { id: "badge_quick", label: "Selo Resposta Rápida", included: true }
    ],
    max_contacts_per_month: 9999,
    max_specialties: 5,
    max_lawyers: 1,
    max_storage_gb: 5,
    max_api_calls_per_month: 5000,
    has_analytics: true,
    has_blog_access: true,
    has_priority_support: false,
    has_api_access: false,
    has_custom_branding: false,
    has_white_label: false,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2026-02-20T14:30:00Z"
  },
  {
    id: 3,
    name: "Escritório",
    slug: "escritorio",
    description: "Para escritórios com múltiplos advogados",
    price_monthly: 299,
    price_yearly: 2990,
    currency: "BRL",
    is_active: true,
    is_popular: false,
    display_order: 3,
    features: [
      { id: "profiles_10", label: "Até 10 perfis de advogados", included: true },
      { id: "contacts_unlimited", label: "Contatos ilimitados", included: true },
      { id: "specialties_unlimited", label: "Especialidades ilimitadas", included: true },
      { id: "search_top", label: "Posição top na busca", included: true },
      { id: "analytics_full", label: "Analytics completo", included: true },
      { id: "blog_unlimited", label: "Blog ilimitado", included: true },
      { id: "multi_office", label: "Múltiplos escritórios", included: true },
      { id: "api_integration", label: "Integração API", included: true }
    ],
    max_contacts_per_month: 99999,
    max_specialties: 999,
    max_lawyers: 10,
    max_storage_gb: 10,
    max_api_calls_per_month: 10000,
    has_analytics: true,
    has_blog_access: true,
    has_priority_support: true,
    has_api_access: true,
    has_custom_branding: false,
    has_white_label: false,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2026-03-10T09:00:00Z"
  },
  {
    id: 4,
    name: "Enterprise",
    slug: "enterprise",
    description: "Solução personalizada para grandes bancas",
    price_monthly: 999,
    price_yearly: 9990,
    currency: "BRL",
    is_active: true,
    is_popular: false,
    display_order: 4,
    features: [
      { id: "profiles_unlimited", label: "Perfis ilimitados", included: true },
      { id: "everything_unlimited", label: "Tudo ilimitado", included: true },
      { id: "analytics_advanced", label: "Analytics avançado + BI", included: true },
      { id: "white_label", label: "White label", included: true },
      { id: "custom_branding", label: "Branding personalizado", included: true },
      { id: "dedicated_support", label: "Suporte dedicado 24/7", included: true },
      { id: "sla", label: "SLA garantido", included: true },
      { id: "custom_integrations", label: "Integrações customizadas", included: true }
    ],
    max_contacts_per_month: 999999,
    max_specialties: 9999,
    max_lawyers: 9999,
    max_storage_gb: 100,
    max_api_calls_per_month: 100000,
    has_analytics: true,
    has_blog_access: true,
    has_priority_support: true,
    has_api_access: true,
    has_custom_branding: true,
    has_white_label: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2026-04-01T11:00:00Z"
  }
];

const generateMockPlanMetrics = (): PlanMetrics => ({
  total_subscriptions: 2234,
  active_subscriptions: 2012,
  mrr: 287500,
  arr: 3450000,
  average_revenue_per_user: 143,
  plan_distribution: {
    gratis: { count: 1234, percentage: 55.2, mrr: 0 },
    pro: { count: 1456, percentage: 65.2, mrr: 144144 },
    escritorio: { count: 678, percentage: 30.3, mrr: 202722 },
    enterprise: { count: 88, percentage: 3.9, mrr: 87912 }
  },
  upgrades_this_month: 45,
  downgrades_this_month: 12,
  cancellations_this_month: 23
});

const generateMockSponsored = (): Sponsored[] => [
  {
    id: 1,
    sponsor_type: "lawyer",
    sponsor_id: 101,
    sponsor_name: "Dr. Ricardo Almeida",
    sponsor_email: "dr.ricardo@advocacia.com",
    campaign_name: "Campanha Direito Empresarial Q2",
    campaign_type: "featured_profile",
    status: "active",
    budget_total: 5000,
    budget_spent: 2340,
    budget_remaining: 2660,
    cost_per_click: 2.5,
    daily_budget: 100,
    billing_type: "cpc",
    impressions: 15678,
    clicks: 936,
    ctr: 5.97,
    conversions: 47,
    conversion_rate: 5.02,
    cost_per_conversion: 49.79,
    target_specialties: ["Direito Empresarial", "Direito Tributário"],
    target_locations: ["São Paulo", "Campinas", "Santos"],
    start_date: "2026-04-01T00:00:00Z",
    end_date: "2026-06-30T23:59:59Z",
    schedule_type: "continuous",
    approved_by: 104,
    approved_at: "2026-03-30T14:00:00Z",
    created_at: "2026-03-25T10:00:00Z",
    updated_at: "2026-04-09T08:00:00Z"
  },
  {
    id: 2,
    sponsor_type: "office",
    sponsor_id: 201,
    sponsor_name: "Silva & Associados",
    sponsor_email: "marketing@silvaadv.com",
    campaign_name: "Banner Homepage Abril",
    campaign_type: "banner_ad",
    status: "active",
    budget_total: 3000,
    budget_spent: 1800,
    budget_remaining: 1200,
    cost_per_click: 3.0,
    daily_budget: 150,
    billing_type: "cpm",
    impressions: 45000,
    clicks: 600,
    ctr: 1.33,
    conversions: 28,
    conversion_rate: 4.67,
    cost_per_conversion: 64.29,
    start_date: "2026-04-01T00:00:00Z",
    end_date: "2026-04-30T23:59:59Z",
    schedule_type: "continuous",
    approved_by: 104,
    approved_at: "2026-03-28T16:00:00Z",
    created_at: "2026-03-20T09:00:00Z",
    updated_at: "2026-04-09T07:30:00Z"
  }
];

const generateMockSponsoredMetrics = (): SponsoredMetrics => ({
  total_campaigns: 45,
  active_campaigns: 23,
  total_revenue: 156780,
  average_campaign_duration: 45,
  average_roi: 320,
  top_performers: [],
  revenue_by_type: {
    featured_profile: 67800,
    top_search: 34500,
    banner_ad: 28900,
    homepage_featured: 15600,
    category_sponsorship: 9980
  },
  impressions_this_month: 234567,
  clicks_this_month: 12345,
  ctr_average: 5.26
});

const generateMockArticles = (): Article[] => [
  {
    id: 1,
    author_id: 101,
    author_name: "Dr. Ricardo Almeida",
    author_email: "dr.ricardo@advocacia.com",
    title: "Novas Regras para Reestruturação Societária em 2026",
    slug: "novas-regras-reestruturacao-societaria-2026",
    excerpt: "Entenda as mudanças na legislação e como elas impactam as empresas brasileiras.",
    content: "Conteúdo completo do artigo...",
    cover_image_url: "https://example.com/image1.jpg",
    meta_title: "Novas Regras para Reestruturação Societária em 2026 | AdvocaciaHub",
    meta_description: "Guia completo sobre as novas regras de reestruturação societária",
    meta_keywords: ["reestruturação", "societária", "2026", "empresarial"],
    category: "Direito Empresarial",
    tags: ["reestruturação", "societário", "legislação"],
    related_specialties: ["Direito Empresarial"],
    status: "published",
    published_at: "2026-04-05T10:00:00Z",
    created_at: "2026-04-01T14:00:00Z",
    updated_at: "2026-04-05T09:30:00Z",
    views: 2456,
    unique_views: 1890,
    average_read_time_seconds: 345,
    likes: 89,
    shares: 34,
    comments_count: 12,
    seo_score: 92,
    readability_score: 87,
    is_featured: true,
    is_premium: false,
    allow_comments: true,
    read_time_minutes: 8
  },
  {
    id: 2,
    author_id: 102,
    author_name: "Dra. Maria Santos",
    author_email: "maria.jurista@email.com",
    title: "Guarda Compartilhada: Direitos e Deveres dos Pais",
    slug: "guarda-compartilhada-direitos-deveres",
    excerpt: "Saiba tudo sobre guarda compartilhada após as recentes mudanças no Código Civil.",
    content: "Conteúdo completo do artigo...",
    category: "Direito de Família",
    tags: ["guarda", "família", "filhos"],
    related_specialties: ["Direito de Família"],
    status: "published",
    published_at: "2026-04-07T15:00:00Z",
    created_at: "2026-04-03T10:00:00Z",
    updated_at: "2026-04-07T14:30:00Z",
    views: 1678,
    unique_views: 1234,
    average_read_time_seconds: 280,
    likes: 67,
    shares: 23,
    comments_count: 8,
    seo_score: 88,
    readability_score: 91,
    is_featured: false,
    is_premium: false,
    allow_comments: true,
    read_time_minutes: 6
  },
  {
    id: 3,
    author_id: 101,
    author_name: "Dr. Ricardo Almeida",
    author_email: "dr.ricardo@advocacia.com",
    title: "Planejamento Tributário para Startups",
    slug: "planejamento-tributario-startups",
    excerpt: "Estratégias essenciais para otimizar a carga tributária da sua startup.",
    content: "Conteúdo completo do artigo...",
    status: "draft",
    created_at: "2026-04-08T16:00:00Z",
    updated_at: "2026-04-08T16:00:00Z",
    views: 0,
    unique_views: 0,
    average_read_time_seconds: 0,
    likes: 0,
    shares: 0,
    comments_count: 0,
    seo_score: 75,
    readability_score: 82,
    is_featured: false,
    is_premium: true,
    allow_comments: true,
    read_time_minutes: 10
  }
];

const generateMockArticleMetrics = (): ArticleMetrics => ({
  total_articles: 234,
  published_articles: 189,
  draft_articles: 45,
  total_views: 456789,
  total_likes: 12345,
  total_shares: 5678,
  average_views_per_article: 2417,
  top_articles: [],
  views_this_month: 34567,
  growth_rate: 12.5,
  engagement_rate: 8.7
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
};

const getScoreBg = (score: number): string => {
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800';
  if (score >= 40) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
};

const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  const statusMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    'new': 'default',
    'contacted': 'secondary',
    'qualified': 'default',
    'proposal_sent': 'secondary',
    'negotiation': 'default',
    'converted': 'outline',
    'lost': 'destructive',
    'active': 'default',
    'suspended': 'destructive',
    'pending': 'secondary',
    'trial': 'outline',
    'expired': 'destructive',
    'draft': 'secondary',
    'published': 'default',
    'archived': 'outline'
  };
  return statusMap[status] || 'default';
};

// ========================================
// MAIN DASHBOARD COMPONENT
// ========================================

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadMetrics, setLeadMetrics] = useState<LeadMetrics | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [memberMetrics, setMemberMetrics] = useState<MemberMetrics | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [planMetrics, setPlanMetrics] = useState<PlanMetrics | null>(null);
  const [sponsored, setSponsored] = useState<Sponsored[]>([]);
  const [sponsoredMetrics, setSponsoredMetrics] = useState<SponsoredMetrics | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [articleMetrics, setArticleMetrics] = useState<ArticleMetrics | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Load mock data
  useEffect(() => {
    setTimeout(() => {
      setLeads(generateMockLeads());
      setLeadMetrics(generateMockLeadMetrics());
      setMembers(generateMockMembers());
      setMemberMetrics(generateMockMemberMetrics());
      setPlans(generateMockPlans());
      setPlanMetrics(generateMockPlanMetrics());
      setSponsored(generateMockSponsored());
      setSponsoredMetrics(generateMockSponsoredMetrics());
      setArticles(generateMockArticles());
      setArticleMetrics(generateMockArticleMetrics());
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Carregando dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Enterprise</h1>
          <p className="text-gray-600 mt-2">Plataforma Jurídica SaaS - Gestão Completa</p>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:inline-flex">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="members">Membros</TabsTrigger>
            <TabsTrigger value="plans">Planos</TabsTrigger>
            <TabsTrigger value="sponsored">Patrocinados</TabsTrigger>
            <TabsTrigger value="leads-crm">CRM Leads</TabsTrigger>
            <TabsTrigger value="articles">Artigos</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{leadMetrics?.total_leads || 0}</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                    +{leadMetrics?.new_leads_this_month || 0} este mês
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Membros Ativos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{memberMetrics?.active_members || 0}</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                    +{memberMetrics?.new_members_this_month || 0} este mês
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">MRR</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(memberMetrics?.mrr || 0)}</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                    +{memberMetrics?.growth_rate || 0}% crescimento
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Artigos Publicados</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{articleMetrics?.published_articles || 0}</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <Eye className="h-3 w-3 text-blue-500 mr-1" />
                    {articleMetrics?.views_this_month || 0} views este mês
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Próximos Agendamentos</CardTitle>
                  <CardDescription>Seus compromissos futuros</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>Nenhum agendamento próximo</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Campanhas Ativas</CardTitle>
                  <CardDescription>Patrocínios em execução</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sponsored.filter(s => s.status === 'active').slice(0, 3).map(campaign => (
                      <div key={campaign.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{campaign.campaign_name}</h4>
                            <p className="text-sm text-gray-500">{campaign.sponsor_name}</p>
                          </div>
                          <Badge>{campaign.status}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Impressões</p>
                            <p className="font-medium">{campaign.impressions.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Cliques</p>
                            <p className="font-medium">{campaign.clicks.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">CTR</p>
                            <p className="font-medium">{campaign.ctr}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* LEADS TAB */}
          <TabsContent value="leads" className="space-y-6">
            <LeadsTab leads={leads} metrics={leadMetrics} />
          </TabsContent>

          {/* MEMBERS TAB */}
          <TabsContent value="members" className="space-y-6">
            <MembersTab members={members} metrics={memberMetrics} />
          </TabsContent>

          {/* PLANS TAB */}
          <TabsContent value="plans" className="space-y-6">
            <PlansTab plans={plans} metrics={planMetrics} />
          </TabsContent>

          {/* SPONSORED TAB */}
          <TabsContent value="sponsored" className="space-y-6">
            <SponsoredTab campaigns={sponsored} metrics={sponsoredMetrics} />
          </TabsContent>

          {/* LEADS CRM TAB */}
          <TabsContent value="leads-crm" className="space-y-6">
            <LeadsCRMTab leads={leads} />
          </TabsContent>

          {/* ARTICLES TAB */}
          <TabsContent value="articles" className="space-y-6">
            <ArticlesTab articles={articles} metrics={articleMetrics} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

// ========================================
// LEADS TAB COMPONENT
// ========================================

function LeadsTab({ leads, metrics }: { leads: Lead[]; metrics: LeadMetrics | null }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.total_leads || 0}</div>
            <p className="text-xs text-muted-foreground">+{metrics?.new_leads_this_month || 0} este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.conversion_rate || 0}%</div>
            <p className="text-xs text-muted-foreground">{metrics?.converted_leads || 0} convertidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score Médio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.average_score || 0}/100</div>
            <p className="text-xs text-muted-foreground">{metrics?.average_time_to_conversion || 0} dias p/ conversão</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Gerada</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics?.revenue_generated || 0)}</div>
            <p className="text-xs text-muted-foreground">ROI: {metrics?.roi || 0}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Leads</CardTitle>
              <CardDescription>Gestão e acompanhamento de leads</CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Lead
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="new">Novo</SelectItem>
                <SelectItem value="contacted">Contatado</SelectItem>
                <SelectItem value="qualified">Qualificado</SelectItem>
                <SelectItem value="proposal_sent">Proposta Enviada</SelectItem>
                <SelectItem value="negotiation">Negociação</SelectItem>
                <SelectItem value="converted">Convertido</SelectItem>
                <SelectItem value="lost">Perdido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fonte</TableHead>
                  <TableHead>Interesse</TableHead>
                  <TableHead>Valor Est.</TableHead>
                  <TableHead>Engajamento</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-sm text-gray-500">{lead.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getScoreBg(lead.score)}>
                        {lead.score}/100
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(lead.status)}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{lead.source}</TableCell>
                    <TableCell className="text-sm">{lead.specialty_interest}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(lead.estimated_case_value || 0)}</TableCell>
                    <TableCell>
                      <Badge variant={
                        lead.engagement_level === 'very_high' ? 'default' :
                        lead.engagement_level === 'high' ? 'secondary' :
                        lead.engagement_level === 'medium' ? 'outline' : 'destructive'
                      }>
                        {lead.engagement_level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Enviar Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="h-4 w-4 mr-2" />
                            Ligar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ========================================
// MEMBERS TAB COMPONENT
// ========================================

function MembersTab({ members, metrics }: { members: Member[]; metrics: MemberMetrics | null }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    const matchesPlan = planFilter === "all" || member.plan_type === planFilter;
    return matchesSearch && matchesRole && matchesPlan;
  });

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.total_members || 0}</div>
            <p className="text-xs text-muted-foreground">{metrics?.active_members || 0} ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MRR</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics?.mrr || 0)}</div>
            <p className="text-xs text-muted-foreground">ARR: {formatCurrency(metrics?.arr || 0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.churn_rate || 0}%</div>
            <p className="text-xs text-muted-foreground">Vida média: {metrics?.average_lifetime || 0} dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos este Mês</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.new_members_this_month || 0}</div>
            <p className="text-xs text-muted-foreground">Crescimento: +{metrics?.growth_rate || 0}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Membros</CardTitle>
              <CardDescription>Gestão de membros da plataforma</CardDescription>
            </div>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Membro
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar membros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="client">Cliente</SelectItem>
                <SelectItem value="lawyer">Advogado</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Plano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="free">Grátis</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="escritorio">Escritório</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Membro</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contatos</TableHead>
                  <TableHead>Armazenamento</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{member.full_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.full_name}</p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{member.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge>{member.plan_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(member.status)}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {member.contacts_used}/{member.contacts_limit}
                      </div>
                      <Progress value={(member.contacts_used / member.contacts_limit) * 100} className="h-1 mt-1" />
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {(member.storage_used_mb / 1024).toFixed(1)}/{(member.storage_limit_mb / 1024).toFixed(0)} GB
                      </div>
                      <Progress value={(member.storage_used_mb / member.storage_limit_mb) * 100} className="h-1 mt-1" />
                    </TableCell>
                    <TableCell className="text-sm">
                      {member.last_login_at ? formatDateTime(member.last_login_at) : 'Nunca'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Perfil
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Enviar Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <UserX className="h-4 w-4 mr-2" />
                            Suspender
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ========================================
// PLANS TAB COMPONENT
// ========================================

function PlansTab({ plans, metrics }: { plans: Plan[]; metrics: PlanMetrics | null }) {
  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.active_subscriptions || 0}</div>
            <p className="text-xs text-muted-foreground">Total: {metrics?.total_subscriptions || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MRR</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics?.mrr || 0)}</div>
            <p className="text-xs text-muted-foreground">ARPU: {formatCurrency(metrics?.average_revenue_per_user || 0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upgrades</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.upgrades_this_month || 0}</div>
            <p className="text-xs text-muted-foreground">Downgrades: {metrics?.downgrades_this_month || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelamentos</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.cancellations_this_month || 0}</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={plan.is_popular ? "border-2 border-blue-500" : ""}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {plan.name}
                    {plan.is_popular && <Badge className="bg-blue-500">Popular</Badge>}
                  </CardTitle>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{formatCurrency(plan.price_monthly)}</div>
                  <div className="text-sm text-gray-500">/mês</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Limites</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500">Contatos/mês:</div>
                    <div className="font-medium">{plan.max_contacts_per_month?.toLocaleString() || 'Ilimitado'}</div>
                    <div className="text-gray-500">Especialidades:</div>
                    <div className="font-medium">{plan.max_specialties || 'Ilimitado'}</div>
                    <div className="text-gray-500">Advogados:</div>
                    <div className="font-medium">{plan.max_lawyers || 'Ilimitado'}</div>
                    <div className="text-gray-500">Armazenamento:</div>
                    <div className="font-medium">{plan.max_storage_gb || 'Ilimitado'} GB</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">Recursos</h4>
                  <div className="space-y-2">
                    {plan.features.map((feature) => (
                      <div key={feature.id} className="flex items-center gap-2 text-sm">
                        {feature.included ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className={feature.included ? '' : 'text-gray-400'}>{feature.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ========================================
// SPONSORED TAB COMPONENT
// ========================================

function SponsoredTab({ campaigns, metrics }: { campaigns: Sponsored[]; metrics: SponsoredMetrics | null }) {
  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campanhas Ativas</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.active_campaigns || 0}</div>
            <p className="text-xs text-muted-foreground">Total: {metrics?.total_campaigns || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics?.total_revenue || 0)}</div>
            <p className="text-xs text-muted-foreground">ROI Médio: {metrics?.average_roi || 0}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressões (Mês)</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(metrics?.impressions_this_month || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Cliques: {(metrics?.clicks_this_month || 0).toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CTR Médio</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.ctr_average || 0}%</div>
            <p className="text-xs text-muted-foreground">Taxa de conversão</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Campanhas Patrocinadas</CardTitle>
              <CardDescription>Gestão de campanhas de marketing</CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Campanha
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campanha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Orçamento</TableHead>
                  <TableHead>Gasto</TableHead>
                  <TableHead>Impressões</TableHead>
                  <TableHead>Cliques</TableHead>
                  <TableHead>CTR</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{campaign.campaign_name}</p>
                        <p className="text-sm text-gray-500">{campaign.sponsor_name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{campaign.campaign_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(campaign.budget_total)}</TableCell>
                    <TableCell>
                      <div className="text-sm">{formatCurrency(campaign.budget_spent)}</div>
                      <Progress value={(campaign.budget_spent / campaign.budget_total) * 100} className="h-1 mt-1" />
                    </TableCell>
                    <TableCell>{campaign.impressions.toLocaleString()}</TableCell>
                    <TableCell>{campaign.clicks.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={campaign.ctr > 5 ? 'default' : campaign.ctr > 2 ? 'secondary' : 'outline'}>
                        {campaign.ctr}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Analytics
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <X className="h-4 w-4 mr-2" />
                            Pausar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ========================================
// LEADS CRM TAB COMPONENT
// ========================================

function LeadsCRMTab({ leads }: { leads: Lead[] }) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>CRM de Leads - Funil de Vendas</CardTitle>
          <CardDescription>Acompanhe o funil de conversão e atividades</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Sales Funnel */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            {[
              { status: 'new', label: 'Novos', color: 'bg-blue-100 border-blue-500', count: leads.filter(l => l.status === 'new').length },
              { status: 'contacted', label: 'Contatados', color: 'bg-purple-100 border-purple-500', count: leads.filter(l => l.status === 'contacted').length },
              { status: 'qualified', label: 'Qualificados', color: 'bg-yellow-100 border-yellow-500', count: leads.filter(l => l.status === 'qualified').length },
              { status: 'proposal_sent', label: 'Propostas', color: 'bg-orange-100 border-orange-500', count: leads.filter(l => l.status === 'proposal_sent').length },
              { status: 'negotiation', label: 'Negociação', color: 'bg-pink-100 border-pink-500', count: leads.filter(l => l.status === 'negotiation').length },
              { status: 'converted', label: 'Convertidos', color: 'bg-green-100 border-green-500', count: leads.filter(l => l.status === 'converted').length },
              { status: 'lost', label: 'Perdidos', color: 'bg-red-100 border-red-500', count: leads.filter(l => l.status === 'lost').length }
            ].map((stage) => (
              <div key={stage.status} className={`p-4 rounded-lg border-l-4 ${stage.color}`}>
                <div className="text-2xl font-bold">{stage.count}</div>
                <div className="text-sm text-gray-600">{stage.label}</div>
              </div>
            ))}
          </div>

          {/* Lead Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.map((lead) => (
              <Card key={lead.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedLead(lead)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{lead.name}</h4>
                        <p className="text-sm text-gray-500">{lead.email}</p>
                      </div>
                    </div>
                    <Badge className={getScoreBg(lead.score)}>{lead.score}</Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    {lead.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{lead.phone}</span>
                      </div>
                    )}
                    {lead.company && (
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span>{lead.company}</span>
                      </div>
                    )}
                    {lead.specialty_interest && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <span>{lead.specialty_interest}</span>
                      </div>
                    )}
                    {lead.estimated_case_value && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{formatCurrency(lead.estimated_case_value)}</span>
                      </div>
                    )}
                  </div>

                  <Separator className="my-3" />

                  <div className="flex justify-between items-center">
                    <Badge variant={getStatusBadgeVariant(lead.status)}>{lead.status}</Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Mail className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lead Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-3xl">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{selectedLead.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div>{selectedLead.name}</div>
                    <div className="text-sm font-normal text-gray-500">{selectedLead.email}</div>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label className="text-sm text-gray-500">Telefone</Label>
                  <p className="font-medium">{selectedLead.phone || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Empresa</Label>
                  <p className="font-medium">{selectedLead.company || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Score</Label>
                  <p className={`font-medium text-lg ${getScoreColor(selectedLead.score)}`}>{selectedLead.score}/100</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Valor Estimado</Label>
                  <p className="font-medium">{formatCurrency(selectedLead.estimated_case_value || 0)}</p>
                </div>
              </div>

              {selectedLead.score_factors && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Fatores de Score</Label>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Demográfico</span>
                          <span>{selectedLead.score_factors.demographic_score}/30</span>
                        </div>
                        <Progress value={(selectedLead.score_factors.demographic_score / 30) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Comportamental</span>
                          <span>{selectedLead.score_factors.behavioral_score}/30</span>
                        </div>
                        <Progress value={(selectedLead.score_factors.behavioral_score / 30) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Firmográfico</span>
                          <span>{selectedLead.score_factors.firmographic_score}/20</span>
                        </div>
                        <Progress value={(selectedLead.score_factors.firmographic_score / 20) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Intenção</span>
                          <span>{selectedLead.score_factors.intent_score}/20</span>
                        </div>
                        <Progress value={(selectedLead.score_factors.intent_score / 20) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setSelectedLead(null)}>Fechar</Button>
                <Button>
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Email
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ========================================
// ARTICLES TAB COMPONENT
// ========================================

function ArticlesTab({ articles, metrics }: { articles: Article[]; metrics: ArticleMetrics | null }) {
  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Artigos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.total_articles || 0}</div>
            <p className="text-xs text-muted-foreground">{metrics?.published_articles || 0} publicados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações Totais</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(metrics?.total_views || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{metrics?.views_this_month?.toLocaleString() || 0} este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engajamento</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.engagement_rate || 0}%</div>
            <p className="text-xs text-muted-foreground">{metrics?.total_likes?.toLocaleString() || 0} likes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{metrics?.growth_rate || 0}%</div>
            <p className="text-xs text-muted-foreground">Média: {metrics?.average_views_per_article?.toLocaleString() || 0} views/artigo</p>
          </CardContent>
        </Card>
      </div>

      {/* Articles Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Artigos</CardTitle>
              <CardDescription>Gestão de conteúdo e artigos</CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Artigo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Artigo</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Visualizações</TableHead>
                  <TableHead>Likes</TableHead>
                  <TableHead>SEO Score</TableHead>
                  <TableHead>Publicado</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="max-w-xs">
                      <div>
                        <p className="font-medium truncate">{article.title}</p>
                        <p className="text-sm text-gray-500 truncate">{article.excerpt}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{article.author_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{article.author_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{article.category}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(article.status)}>
                        {article.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{article.views.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4 text-gray-400" />
                        <span>{article.likes}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={article.seo_score >= 90 ? 'default' : article.seo_score >= 70 ? 'secondary' : 'destructive'}>
                        {article.seo_score}/100
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {article.published_at ? formatDate(article.published_at) : '-'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Analytics
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Comentários ({article.comments_count})
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
