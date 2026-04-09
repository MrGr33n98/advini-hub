// hooks/useDashboard.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

// ========================================
// TYPES
// ========================================

export interface DashboardMetrics {
  leads: {
    total: number;
    new_this_week: number;
    converted: number;
    conversion_rate: number;
  };
  appointments: {
    total: number;
    upcoming: number;
    this_week: number;
    completed_this_month: number;
  };
  messages: {
    total: number;
    unread: number;
    this_week: number;
  };
  profile: {
    views: number;
    contacts_this_month: number;
    avg_rating: number;
    total_reviews: number;
  };
  revenue: {
    estimated_this_month: number;
    estimated_total: number;
  };
}

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  job_title?: string;
  source: string;
  status: string;
  score: number;
  specialty_interest?: string;
  estimated_case_value?: number;
  engagement_level: string;
  created_at: string;
  last_contacted_at?: string;
}

export interface Appointment {
  id: number;
  client_name: string;
  client_email: string;
  client_phone?: string;
  appointment_date: string;
  appointment_type: string;
  status: string;
  fee_amount?: number;
  notes?: string;
  meeting_link?: string;
}

export interface ContactMessage {
  id: number;
  client_name: string;
  client_email: string;
  client_phone?: string;
  message: string;
  case_type?: string;
  status: string;
  created_at: string;
}

export interface PaginationMeta {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ========================================
// LAWYER DASHBOARD HOOKS
// ========================================

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: async () => {
      const { data } = await api.get<DashboardMetrics>('/dashboard/metrics');
      return data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useLawyerLeads(params = {}) {
  return useQuery({
    queryKey: ['dashboard', 'leads', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Lead>>('/dashboard/leads', { params });
      return data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useLawyerAppointments(params = {}) {
  return useQuery({
    queryKey: ['dashboard', 'appointments', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Appointment>>('/dashboard/appointments', { params });
      return data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useLawyerMessages(params = {}) {
  return useQuery({
    queryKey: ['dashboard', 'messages', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<ContactMessage>>('/dashboard/messages', { params });
      return data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

// ========================================
// OFFICE DASHBOARD HOOKS
// ========================================

export interface OfficeMetrics {
  office: {
    id: number;
    name: string;
    city: string;
    state: string;
    total_lawyers: number;
    active_lawyers: number;
  };
  lawyers: {
    total: number;
    verified: number;
    avg_experience: number;
  };
  appointments: {
    total: number;
    this_month: number;
    upcoming: number;
    completed_this_month: number;
  };
  leads: {
    total: number;
    new_this_week: number;
    converted: number;
  };
  campaigns: {
    active: number;
    total_spent: number;
    total_impressions: number;
    total_clicks: number;
  };
  revenue: {
    monthly: number;
    yearly: number;
  };
}

export interface OfficeLawyer {
  id: number;
  full_name: string;
  oab_number: string;
  oab_state: string;
  city: string;
  state: string;
  years_experience: number;
  is_verified: boolean;
  avg_rating: number;
  total_reviews: number;
  specialties: Array<{ id: number; name: string }>;
  appointments_count: number;
  leads_count: number;
}

export interface OfficeCampaign {
  id: number;
  campaign_name: string;
  campaign_type: string;
  status: string;
  budget_total: number;
  budget_spent: number;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  start_date: string;
  end_date: string;
}

export function useOfficeMetrics() {
  return useQuery({
    queryKey: ['office', 'metrics'],
    queryFn: async () => {
      const { data } = await api.get<OfficeMetrics>('/office/dashboard/metrics');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useOfficeLawyers(params = {}) {
  return useQuery({
    queryKey: ['office', 'lawyers', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<OfficeLawyer>>('/office/lawyers', { params });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useOfficeCampaigns(params = {}) {
  return useQuery({
    queryKey: ['office', 'campaigns', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<OfficeCampaign>>('/office/campaigns', { params });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useOfficeRevenue() {
  return useQuery({
    queryKey: ['office', 'revenue'],
    queryFn: async () => {
      const { data } = await api.get('/office/revenue');
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

// ========================================
// CLIENT DASHBOARD HOOKS
// ========================================

export interface ClientMetrics {
  appointments: {
    total: number;
    upcoming: number;
    completed: number;
    next_appointment?: {
      id: number;
      lawyer_name: string;
      appointment_date: string;
      appointment_type: string;
      status: string;
      meeting_link?: string;
    };
  };
  messages: {
    total: number;
    sent_this_month: number;
  };
  subscription: {
    plan: string;
    status: string;
    renewal_date?: string;
  };
}

export interface ClientAppointment {
  id: number;
  lawyer: {
    id: number;
    name: string;
    photo_url?: string;
  };
  appointment_date: string;
  appointment_type: string;
  status: string;
  fee_amount?: number;
  notes?: string;
  meeting_link?: string;
}

export function useClientMetrics() {
  return useQuery({
    queryKey: ['client', 'metrics'],
    queryFn: async () => {
      const { data } = await api.get<ClientMetrics>('/client/dashboard/metrics');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useClientAppointments(params = {}) {
  return useQuery({
    queryKey: ['client', 'appointments', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<ClientAppointment>>('/client/appointments', { params });
      return data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useClientSubscription() {
  return useQuery({
    queryKey: ['client', 'subscription'],
    queryFn: async () => {
      const { data } = await api.get('/client/subscription');
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
}
