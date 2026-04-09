require 'rails_helper'

RSpec.describe ContactMessage, type: :model do
  describe 'validations' do
    subject { build(:contact_message) }
    it { is_expected.to validate_presence_of(:client_name) }
    it { is_expected.to validate_presence_of(:client_email) }
    it { is_expected.to validate_presence_of(:message) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:lawyer) }
    it { is_expected.to belong_to(:sender).optional }
  end

  describe 'enums' do
    it { is_expected.to define_enum_for(:status) }
  end

  describe 'scopes' do
    let(:lawyer) { create(:lawyer) }

    describe '.unread' do
      it 'returns only pending messages' do
        pending = create(:contact_message, lawyer: lawyer, status: 'pending')
        read = create(:contact_message, lawyer: lawyer, status: 'read')
        
        expect(ContactMessage.unread).to include(pending)
        expect(ContactMessage.unread).not_to include(read)
      end
    end

    describe '.by_lawyer' do
      it 'returns only messages for specific lawyer' do
        message = create(:contact_message, lawyer: lawyer)
        other_lawyer = create(:lawyer)
        other_message = create(:contact_message, lawyer: other_lawyer)
        
        expect(ContactMessage.by_lawyer(lawyer.id)).to include(message)
        expect(ContactMessage.by_lawyer(lawyer.id)).not_to include(other_message)
      end
    end
  end

  describe 'anonymous messages' do
    it 'allows messages without a sender' do
      message = build(:contact_message, sender: nil)
      expect(message).to be_valid
    end
  end

  describe '#ransackable_attributes' do
    it 'returns expected attributes' do
      attrs = ContactMessage.ransackable_attributes
      expect(attrs).to include('id', 'client_name', 'client_email', 'status')
    end
  end
end
