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
