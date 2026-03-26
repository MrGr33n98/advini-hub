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