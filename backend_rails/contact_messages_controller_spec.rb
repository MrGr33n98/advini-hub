require 'rails_helper'

RSpec.describe 'Api::V1::ContactMessagesController', type: :request do
  let(:lawyer) { create(:lawyer) }

  describe 'POST /api/v1/contact_messages' do
    let(:valid_params) do
      {
        contact_message: {
          lawyer_id: lawyer.id,
          client_name: 'Test Client',
          client_email: 'test@example.com',
          message: 'I need legal advice about a contract.'
        }
      }
    end

    it 'creates a contact message' do
      post '/api/v1/contact_messages', params: valid_params
      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json['data']['client_name']).to eq('Test Client')
      expect(json['data']['status']).to eq('pending')
    end

    it 'allows anonymous messages' do
      post '/api/v1/contact_messages', params: valid_params
      expect(response).to have_http_status(:created)
    end

    it 'fails without required parameters' do
      post '/api/v1/contact_messages', params: {
        contact_message: {
          lawyer_id: lawyer.id,
          client_name: 'Test'
        }
      }
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end
