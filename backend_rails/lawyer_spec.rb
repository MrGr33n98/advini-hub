require 'rails_helper'

RSpec.describe Lawyer, type: :model do
  subject { build(:lawyer) }

  describe 'validations' do
    it { is_expected.to validate_presence_of(:full_name) }
    it { is_expected.to validate_presence_of(:oab_number) }
    it { is_expected.to validate_presence_of(:city) }
    it { is_expected.to validate_presence_of(:state) }
    it { is_expected.to validate_uniqueness_of(:oab_number) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:office).optional }
    it { is_expected.to have_many(:reviews).dependent(:destroy) }
    it { is_expected.to have_many(:contact_messages).dependent(:destroy) }
    it { is_expected.to have_many(:appointments).dependent(:destroy) }
    it { is_expected.to have_and_belong_to_many(:specialties) }
    it { is_expected.to belong_to(:user).optional }
  end

  describe '#email' do
    it 'returns user email if user exists' do
      user = create(:user)
      lawyer = create(:lawyer, user: user)
      expect(lawyer.email).to eq(user.email)
    end

    it 'returns nil if user does not exist' do
      lawyer = create(:lawyer, user: nil)
      expect(lawyer.email).to be_nil
    end
  end

  describe '#ransackable_attributes' do
    it 'returns expected attributes' do
      attrs = Lawyer.ransackable_attributes
      expect(attrs).to include('id', 'full_name', 'oab_number', 'city', 'state', 'avg_rating')
    end
  end

  describe '#ransackable_associations' do
    it 'returns expected associations' do
      assocs = Lawyer.ransackable_associations
      expect(assocs).to include('specialties', 'office', 'reviews', 'appointments')
    end
  end
end
