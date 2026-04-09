FactoryBot.define do
  factory :admin_user do
    email { Faker::Internet.unique.email }
    password { 'password123' }
    password_confirmation { 'password123' }
  end

  factory :user do
    email { Faker::Internet.unique.email }
    password { 'password123' }
    password_confirmation { 'password123' }
    role { :client }
  end

  factory :office do
    trade_name { Faker::Company.name }
    city { Faker::Address.city }
    state { 'SP' }
  end

  factory :specialty do
    name { Faker::Hacker.adjective }
    description { Faker::Lorem.paragraph }
    slug { name.downcase.gsub(' ', '-') }
    icon { %w[scales briefcase shield heart calculator home leaf building store book user-check globe credit-card lightbulb shopping-cart].sample }
    color { ['#1e40af', '#dc2626', '#7c3aed', '#be123c', '#ea580c', '#0891b2', '#15803d', '#6b21a8', '#1e3a8a', '#4c0519', '#0d47a1', '#2c5aa0', '#1a5f3b', '#f59e0b', '#059669'].sample }
    position { rand(1..20) }
    is_active { true }
  end

  factory :lawyer do
    full_name { Faker::Name.name }
    oab_number { Faker::Number.unique.number(digits: 6) }
    oab_state { 'SP' }
    city { Faker::Address.city }
    state { 'SP' }
    bio { Faker::Lorem.paragraph }
    years_experience { rand(1..30) }
    hourly_rate_min { 100.0 }
    hourly_rate_max { 300.0 }
    is_verified { true }
    office { association :office }

    after(:create) do |lawyer|
      lawyer.specialties << create(:specialty) if lawyer.specialties.empty?
    end
  end

  factory :review do
    lawyer { association :lawyer }
    rating { rand(1..5) }
    comment { Faker::Lorem.paragraphs(number: 2).join(' ') }
    case_type { 'General Consultation' }
    case_outcome { 'Favorable' }
    client_name { Faker::Name.name }
    moderation_status { 'approved' }
  end

  factory :appointment do
    lawyer { association :lawyer }
    client { association :user, role: :client }
    client_name { Faker::Name.name }
    client_email { Faker::Internet.email }
    client_phone { Faker::PhoneNumber.phone_number }
    appointment_date { 5.days.from_now }
    service_type { 'Consultation' }
    status { 'scheduled' }
    appointment_type { 'consultation' }
  end

  factory :contact_message do
    lawyer { association :lawyer }
    client_name { Faker::Name.name }
    client_email { Faker::Internet.email }
    client_phone { Faker::PhoneNumber.phone_number }
    message { Faker::Lorem.paragraph }
    case_type { 'General Inquiry' }
    status { 'pending' }
  end
end
