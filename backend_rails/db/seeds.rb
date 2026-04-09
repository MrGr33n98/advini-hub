# Clear existing data (optional - comment out if you want to preserve)
# AdminUser.delete_all
# Lawyer.delete_all
# Specialty.delete_all
# Office.delete_all
# Review.delete_all
# Appointment.delete_all

puts "Seeding AdvocaciaHub database..."

# 1. Create default AdminUser
admin_user = AdminUser.find_or_create_by(email: 'admin@advocaciahub.com') do |user|
  user.password = 'temporary123'
  user.password_confirmation = 'temporary123'
end
puts "✓ Created AdminUser: #{admin_user.email}"

# 2. Create 15 legal specialties
specialties_data = [
  { name: 'Direito Civil', slug: 'direito-civil', description: 'Casos de direito civil, contratos, propriedade e responsabilidade civil', icon: 'scales', color: '#1e40af', position: 1, is_active: true },
  { name: 'Direito Trabalhista', slug: 'direito-trabalhista', description: 'Questões trabalhistas, direitos do trabalhador, CLT e demissões', icon: 'briefcase', color: '#dc2626', position: 2, is_active: true },
  { name: 'Direito Penal', slug: 'direito-penal', description: 'Defesa em processos criminais, crimes e investigação', icon: 'shield', color: '#7c3aed', position: 3, is_active: true },
  { name: 'Direito de Família', slug: 'direito-familia', description: 'Divorcios, pensão alimentícia, guarda de menores e casamento', icon: 'heart', color: '#be123c', position: 4, is_active: true },
  { name: 'Direito Tributário', slug: 'direito-tributario', description: 'Questões fiscais, impostos e legislação tributária', icon: 'calculator', color: '#ea580c', position: 5, is_active: true },
  { name: 'Direito Imobiliário', slug: 'direito-imobiliario', description: 'Compra, venda e aluguel de imóveis, contratos imobiliários', icon: 'home', color: '#0891b2', position: 6, is_active: true },
  { name: 'Direito Ambiental', slug: 'direito-ambiental', description: 'Legislação ambiental, sustentabilidade e proteção do meio ambiente', icon: 'leaf', color: '#15803d', position: 7, is_active: true },
  { name: 'Direito Administrativo', slug: 'direito-administrativo', description: 'Direito administrativo, direito público e regulamentações governamentais', icon: 'building', color: '#6b21a8', position: 8, is_active: true },
  { name: 'Direito Comercial', slug: 'direito-comercial', description: 'Direito comercial, empresarial e transações comerciais', icon: 'store', color: '#1e3a8a', position: 9, is_active: true },
  { name: 'Direito Constitucional', slug: 'direito-constitucional', description: 'Questões constitucionais, direitos fundamentais e habeas corpus', icon: 'book', color: '#4c0519', position: 10, is_active: true },
  { name: 'Direito Previdenciário', slug: 'direito-previdenciario', description: 'Benefícios previdenciários, INSS e pensões', icon: 'user-check', color: '#0d47a1', position: 11, is_active: true },
  { name: 'Direito Imigração', slug: 'direito-imigracao', description: 'Questões de imigração, naturalização e direitos de estrangeiros', icon: 'globe', color: '#2c5aa0', position: 12, is_active: true },
  { name: 'Direito Financeiro', slug: 'direito-financeiro', description: 'Direito bancário, financeiro e operações de crédito', icon: 'credit-card', color: '#1a5f3b', position: 13, is_active: true },
  { name: 'Direito Propriedade Intelectual', slug: 'direito-pi', description: 'Patentes, marcas, direitos autorais e propriedade intelectual', icon: 'lightbulb', color: '#f59e0b', position: 14, is_active: true },
  { name: 'Direito Consumidor', slug: 'direito-consumidor', description: 'Proteção dos direitos do consumidor e defesa em relações de consumo', icon: 'shopping-cart', color: '#059669', position: 15, is_active: true }
]

specialties = specialties_data.map do |spec_data|
  Specialty.find_or_create_by(slug: spec_data[:slug]) do |specialty|
    specialty.name = spec_data[:name]
    specialty.description = spec_data[:description]
    specialty.icon = spec_data[:icon]
    specialty.color = spec_data[:color]
    specialty.position = spec_data[:position]
    specialty.is_active = spec_data[:is_active]
  end
end
puts "✓ Created #{specialties.count} specialties"

# 3. Create 3 example offices
offices_data = [
  { trade_name: 'Silva & Associados Advogados', city: 'São Paulo', state: 'SP' },
  { trade_name: 'Costa Pereira Consultoria Jurídica', city: 'Rio de Janeiro', state: 'RJ' },
  { trade_name: 'Ferreira Legal Solutions', city: 'Belo Horizonte', state: 'MG' }
]

offices = offices_data.map do |office_data|
  Office.find_or_create_by(trade_name: office_data[:trade_name]) do |office|
    office.city = office_data[:city]
    office.state = office_data[:state]
  end
end
puts "✓ Created #{offices.count} offices"

# 4. Create 10 example lawyers with diverse specialties
lawyers_data = [
  { full_name: 'Dr. João Silva', oab_number: 'SP123456', oab_state: 'SP', city: 'São Paulo', state: 'SP', bio: 'Especialista em direito civil com 15 anos de experiência', years_experience: 15, hourly_rate_min: 150.0, hourly_rate_max: 250.0, office_id: offices[0].id, specialties: [specialties[0], specialties[4]] },
  { full_name: 'Dra. Maria Costa', oab_number: 'RJ234567', oab_state: 'RJ', city: 'Rio de Janeiro', state: 'RJ', bio: 'Advogada trabalhista com 10 anos de atuação', years_experience: 10, hourly_rate_min: 120.0, hourly_rate_max: 200.0, office_id: offices[1].id, specialties: [specialties[1], specialties[3]] },
  { full_name: 'Dr. Carlos Pereira', oab_number: 'MG345678', oab_state: 'MG', city: 'Belo Horizonte', state: 'MG', bio: 'Defensor criminal experiente', years_experience: 20, hourly_rate_min: 200.0, hourly_rate_max: 300.0, office_id: offices[2].id, specialties: [specialties[2], specialties[9]] },
  { full_name: 'Dra. Ana Santos', oab_number: 'SP456789', oab_state: 'SP', city: 'São Paulo', state: 'SP', bio: 'Especialista em direito de família', years_experience: 12, hourly_rate_min: 130.0, hourly_rate_max: 220.0, office_id: offices[0].id, specialties: [specialties[3], specialties[5]] },
  { full_name: 'Dr. Roberto Oliveira', oab_number: 'RJ567890', oab_state: 'RJ', city: 'Rio de Janeiro', state: 'RJ', bio: 'Consultor tributário e fiscal', years_experience: 18, hourly_rate_min: 180.0, hourly_rate_max: 280.0, office_id: offices[1].id, specialties: [specialties[4], specialties[7]] },
  { full_name: 'Dra. Fernanda Lima', oab_number: 'MG678901', oab_state: 'MG', city: 'Belo Horizonte', state: 'MG', bio: 'Advogada imobiliária especializada', years_experience: 8, hourly_rate_min: 100.0, hourly_rate_max: 180.0, office_id: offices[2].id, specialties: [specialties[5], specialties[8]] },
  { full_name: 'Dr. Miguel Gomes', oab_number: 'SP789012', oab_state: 'SP', city: 'São Paulo', state: 'SP', bio: 'Especialista em direito ambiental', years_experience: 14, hourly_rate_min: 140.0, hourly_rate_max: 240.0, office_id: offices[0].id, specialties: [specialties[6], specialties[12]] },
  { full_name: 'Dra. Patricia Martins', oab_number: 'RJ890123', oab_state: 'RJ', city: 'Rio de Janeiro', state: 'RJ', bio: 'Advogada previdenciária renomada', years_experience: 16, hourly_rate_min: 160.0, hourly_rate_max: 260.0, office_id: offices[1].id, specialties: [specialties[10], specialties[11]] },
  { full_name: 'Dr. Thiago Alves', oab_number: 'MG901234', oab_state: 'MG', city: 'Belo Horizonte', state: 'MG', bio: 'Consultor empresarial e comercial', years_experience: 11, hourly_rate_min: 150.0, hourly_rate_max: 250.0, office_id: offices[2].id, specialties: [specialties[8], specialties[13]] },
  { full_name: 'Dra. Lucia Ferreira', oab_number: 'SP012345', oab_state: 'SP', city: 'São Paulo', state: 'SP', bio: 'Especialista em direito do consumidor', years_experience: 9, hourly_rate_min: 110.0, hourly_rate_max: 190.0, office_id: offices[0].id, specialties: [specialties[14], specialties[1]] }
]

lawyers = lawyers_data.map do |lawyer_data|
  specialties_for_lawyer = lawyer_data.delete(:specialties)
  office = lawyer_data.delete(:office_id)
  
  lawyer = Lawyer.find_or_create_by(oab_number: lawyer_data[:oab_number]) do |l|
    lawyer_data.each { |key, value| l.send("#{key}=", value) }
    l.office_id = office
    l.is_verified = true
  end
  
  lawyer.specialties = specialties_for_lawyer if lawyer.specialties.empty?
  lawyer
end
puts "✓ Created #{lawyers.count} lawyers"

# 5. Create 10 approved reviews for lawyers
lawyers.each_with_index do |lawyer, index|
  Review.find_or_create_by(lawyer_id: lawyer.id, client_name: "Client #{index + 1}") do |review|
    review.rating = 4 + (index % 2)
    review.comment = "Excellent legal service. Very professional and attentive to details. #{lawyer.full_name} provided outstanding support for my case."
    review.case_type = 'General Consultation'
    review.case_outcome = 'Favorable'
    review.moderation_status = 'approved'
  end
end
puts "✓ Created reviews for lawyers"

# Update lawyer ratings based on reviews
lawyers.each do |lawyer|
  reviews = lawyer.reviews.where(moderation_status: 'approved')
  if reviews.any?
    lawyer.avg_rating = reviews.average(:rating).round(2)
    lawyer.total_reviews = reviews.count
    lawyer.save
  end
end
puts "✓ Updated lawyer ratings"

# 6. Create 3 example appointments on varied dates
appointments_data = [
  { 
    lawyer_id: lawyers[0].id, 
    client_name: 'Cliente 1', 
    client_email: 'cliente1@email.com', 
    appointment_date: 5.days.from_now, 
    service_type: 'Consultation',
    status: 'scheduled'
  },
  { 
    lawyer_id: lawyers[1].id, 
    client_name: 'Cliente 2', 
    client_email: 'cliente2@email.com', 
    appointment_date: 10.days.from_now, 
    service_type: 'Document Review',
    status: 'confirmed'
  },
  { 
    lawyer_id: lawyers[2].id, 
    client_name: 'Cliente 3', 
    client_email: 'cliente3@email.com', 
    appointment_date: 15.days.from_now, 
    service_type: 'Meeting',
    status: 'scheduled'
  }
]

appointments_data.each do |appt_data|
  Appointment.find_or_create_by(
    lawyer_id: appt_data[:lawyer_id],
    client_email: appt_data[:client_email],
    appointment_date: appt_data[:appointment_date]
  ) do |appointment|
    appt_data.each { |key, value| appointment.send("#{key}=", value) if key != :lawyer_id }
  end
end
puts "✓ Created 3 example appointments"

puts "\n✅ Seeding completed successfully!"
puts "Admin User: admin@advocaciahub.com / temporary123"

# ========================================
# SAAS SEED DATA
# ========================================

puts "\n🚀 Seeding SaaS data..."

# 1. Create SaaS Plans
plans_data = [
  {
    name: 'Grátis',
    slug: 'gratis',
    description: 'Para quem está começando e quer conhecer a plataforma',
    price_monthly: 0,
    price_yearly: 0,
    is_active: true,
    is_popular: false,
    display_order: 1,
    max_contacts_per_month: 5,
    max_specialties: 1,
    max_lawyers: 1,
    max_storage_gb: 0,
    max_api_calls_per_month: 0,
    has_analytics: false,
    has_blog_access: false,
    has_priority_support: false,
    has_api_access: false,
    has_custom_branding: false,
    has_white_label: false
  },
  {
    name: 'Pro',
    slug: 'pro',
    description: 'Para advogados autônomos que querem crescer',
    price_monthly: 99,
    price_yearly: 990,
    is_active: true,
    is_popular: true,
    display_order: 2,
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
    has_white_label: false
  },
  {
    name: 'Escritório',
    slug: 'escritorio',
    description: 'Para escritórios com múltiplos advogados',
    price_monthly: 299,
    price_yearly: 2990,
    is_active: true,
    is_popular: false,
    display_order: 3,
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
    has_white_label: false
  },
  {
    name: 'Enterprise',
    slug: 'enterprise',
    description: 'Solução personalizada para grandes bancas',
    price_monthly: 999,
    price_yearly: 9990,
    is_active: true,
    is_popular: false,
    display_order: 4,
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
    has_white_label: true
  }
]

plans = plans_data.map do |plan_data|
  Plan.find_or_create_by(slug: plan_data[:slug]) do |plan|
    plan_data.each { |key, value| plan.send("#{key}=", value) }
  end
end
puts "✓ Created #{plans.count} SaaS plans"

# 2. Create Sample Leads
leads_data = [
  {
    email: 'maria.silva@techsolutions.com',
    name: 'Maria Silva',
    phone: '+55 11 98765-4321',
    company: 'Tech Solutions Ltda',
    job_title: 'CEO',
    source: :google_ads,
    status: :qualified,
    demographic_score: 25,
    behavioral_score: 28,
    firmographic_score: 18,
    intent_score: 16,
    engagement_score: 85,
    recency_score: 92,
    specialty_interest: 'Direito Comercial',
    estimated_case_value: 15000,
    location_city: 'São Paulo',
    location_state: 'SP',
    tags: ['high-value', 'enterprise', 'urgent'],
    notes: 'Cliente interessado em reestruturação societária',
    email_opened_count: 12,
    email_clicked_count: 8,
    engagement_level: :very_high
  },
  {
    email: 'joao.santos@gmail.com',
    name: 'João Santos',
    phone: '+55 21 97654-3210',
    source: :facebook,
    status: :contacted,
    demographic_score: 18,
    behavioral_score: 20,
    firmographic_score: 12,
    intent_score: 15,
    engagement_score: 68,
    recency_score: 75,
    specialty_interest: 'Direito Trabalhista',
    estimated_case_value: 8000,
    location_city: 'Rio de Janeiro',
    location_state: 'RJ',
    tags: ['individual', 'trabalhista'],
    email_opened_count: 5,
    email_clicked_count: 3,
    engagement_level: :high
  },
  {
    email: 'ana.costa@industria.com.br',
    name: 'Ana Costa',
    phone: '+55 31 96543-2109',
    company: 'Indústria Brasil',
    job_title: 'Diretora de RH',
    source: :linkedin,
    status: :proposal_sent,
    demographic_score: 28,
    behavioral_score: 30,
    firmographic_score: 20,
    intent_score: 14,
    engagement_score: 95,
    recency_score: 88,
    specialty_interest: 'Direito Trabalhista',
    estimated_case_value: 25000,
    location_city: 'Belo Horizonte',
    location_state: 'MG',
    tags: ['corporate', 'high-value', 'recorrente'],
    email_opened_count: 18,
    email_clicked_count: 14,
    engagement_level: :very_high
  },
  {
    email: 'carlos.oliveira@hotmail.com',
    name: 'Carlos Oliveira',
    source: :organic,
    status: :new,
    demographic_score: 12,
    behavioral_score: 15,
    firmographic_score: 8,
    intent_score: 10,
    engagement_score: 42,
    recency_score: 55,
    specialty_interest: 'Direito Civil',
    estimated_case_value: 5000,
    location_city: 'Curitiba',
    location_state: 'PR',
    tags: ['individual'],
    email_opened_count: 0,
    email_clicked_count: 0,
    engagement_level: :low
  },
  {
    email: 'fernanda.lima@startup.com',
    name: 'Fernanda Lima',
    company: 'StartupTech',
    job_title: 'CTO',
    source: :referral,
    status: :negotiation,
    demographic_score: 22,
    behavioral_score: 25,
    firmographic_score: 16,
    intent_score: 15,
    engagement_score: 78,
    recency_score: 82,
    specialty_interest: 'Direito Comercial',
    estimated_case_value: 18000,
    location_city: 'Florianópolis',
    location_state: 'SC',
    tags: ['startup', 'tech', 'medium-value'],
    email_opened_count: 9,
    email_clicked_count: 6,
    engagement_level: :high
  }
]

leads_data.each do |lead_data|
  lead = Lead.find_or_create_by(email: lead_data[:email]) do |lead|
    lead_data.each { |key, value| lead.send("#{key}=", value) }
    lead.calculate_score
  end
end
puts "✓ Created #{leads_data.count} sample leads"

# 3. Create Sample Sponsored Campaigns
if offices.any? && lawyers.any?
  sponsored_data = [
    {
      sponsor_type: 'Lawyer',
      sponsor: lawyers[0],
      sponsor_name: lawyers[0].full_name,
      sponsor_email: 'joao.silva@email.com',
      campaign_name: 'Campanha Direito Comercial Q2',
      campaign_type: :featured_profile,
      status: :active,
      budget_total: 5000,
      budget_spent: 2340,
      cost_per_click: 2.5,
      daily_budget: 100,
      billing_type: :cpc,
      impressions: 15678,
      clicks: 936,
      conversions: 47,
      target_specialties: ['Direito Comercial', 'Direito Tributário'],
      target_locations: ['São Paulo', 'Campinas', 'Santos'],
      start_date: 10.days.ago,
      end_date: 3.months.from_now,
      schedule_type: :continuous,
      approved_by: admin_user,
      approved_at: 11.days.ago
    },
    {
      sponsor_type: 'Office',
      sponsor: offices[0],
      sponsor_name: offices[0].trade_name,
      sponsor_email: 'marketing@silva.com',
      campaign_name: 'Banner Homepage Abril',
      campaign_type: :banner_ad,
      status: :active,
      budget_total: 3000,
      budget_spent: 1800,
      cost_per_click: 3.0,
      daily_budget: 150,
      billing_type: :cpm,
      impressions: 45000,
      clicks: 600,
      conversions: 28,
      start_date: 5.days.ago,
      end_date: 25.days.from_now,
      schedule_type: :continuous,
      approved_by: admin_user,
      approved_at: 6.days.ago
    }
  ]

  sponsored_data.each do |camp_data|
    SponsoredCampaign.find_or_create_by(campaign_name: camp_data[:campaign_name]) do |camp|
      camp_data.each { |key, value| camp.send("#{key}=", value) }
    end
  end
  puts "✓ Created #{sponsored_data.count} sponsored campaigns"
end

# 4. Create Sample Articles
if lawyers.any?
  articles_data = [
    {
      title: 'Novas Regras para Reestruturação Societária em 2026',
      author: lawyers[0],
      excerpt: 'Entenda as mudanças na legislação e como elas impactam as empresas brasileiras.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      category: 'Direito Comercial',
      tags: ['reestruturação', 'societário', 'legislação'],
      status: :published,
      published_at: 5.days.ago,
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
      title: 'Guarda Compartilhada: Direitos e Deveres dos Pais',
      author: lawyers[1],
      excerpt: 'Saiba tudo sobre guarda compartilhada após as recentes mudanças no Código Civil.',
      content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.\n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
      category: 'Direito de Família',
      tags: ['guarda', 'família', 'filhos'],
      status: :published,
      published_at: 3.days.ago,
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
      title: 'Planejamento Tributário para Startups',
      author: lawyers[0],
      excerpt: 'Estratégias essenciais para otimizar a carga tributária da sua startup.',
      content: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.\n\nSimilique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
      status: :draft,
      views: 0,
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
  ]

  articles_data.each do |article_data|
    Article.find_or_create_by(title: article_data[:title]) do |article|
      article_data.each { |key, value| article.send("#{key}=", value) }
    end
  end
  puts "✓ Created #{articles_data.count} sample articles"
end

puts "\n✅✅✅ SaaS seeding completed successfully!"
