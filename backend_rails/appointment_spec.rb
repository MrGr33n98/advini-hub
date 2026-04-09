require 'rails_helper'

RSpec.describe Appointment, type: :model do
  describe 'validations' do
    subject { build(:appointment) }
    it { is_expected.to validate_presence_of(:client_name) }
    it { is_expected.to validate_presence_of(:client_email) }
    it { is_expected.to validate_presence_of(:appointment_date) }
    it { is_expected.to validate_presence_of(:service_type) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:lawyer) }
    it { is_expected.to belong_to(:client).class_name('User').optional }
    it { is_expected.to belong_to(:office).optional }
  end

  describe 'enums' do
    it { is_expected.to define_enum_for(:status) }
    it { is_expected.to define_enum_for(:appointment_type) }
  end

  describe '#appointment_date_future' do
    it 'fails when appointment_date is in the past' do
      appointment = build(:appointment, appointment_date: 1.day.ago)
      expect(appointment).not_to be_valid
      expect(appointment.errors[:appointment_date]).to include('must be in the future')
    end

    it 'succeeds when appointment_date is in the future' do
      appointment = build(:appointment, appointment_date: 5.days.from_now)
      expect(appointment).to be_valid
    end
  end

  describe 'scopes' do
    let(:lawyer) { create(:lawyer) }

    describe '.upcoming' do
      it 'returns only upcoming appointments' do
        upcoming = create(:appointment, lawyer: lawyer, appointment_date: 5.days.from_now)
        past = create(:appointment, lawyer: lawyer, appointment_date: 1.day.ago)
        
        # Need to bypass future date validation for past appointment
        past.update_column(:appointment_date, 1.day.ago)
        
        expect(Appointment.upcoming).to include(upcoming)
        expect(Appointment.upcoming).not_to include(past)
      end
    end

    describe '.by_lawyer' do
      it 'returns only appointments for specific lawyer' do
        appointment = create(:appointment, lawyer: lawyer)
        other_lawyer = create(:lawyer)
        other_appointment = create(:appointment, lawyer: other_lawyer)
        
        expect(Appointment.by_lawyer(lawyer.id)).to include(appointment)
        expect(Appointment.by_lawyer(lawyer.id)).not_to include(other_appointment)
      end
    end
  end

  describe '#ransackable_attributes' do
    it 'returns expected attributes' do
      attrs = Appointment.ransackable_attributes
      expect(attrs).to include('id', 'client_name', 'client_email', 'appointment_date', 'status')
    end
  end
end
