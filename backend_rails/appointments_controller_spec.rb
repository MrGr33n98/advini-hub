require 'rails_helper'

RSpec.describe 'Api::V1::AppointmentsController', type: :request do
  let(:user) { create(:user, role: :client) }
  let(:lawyer) { create(:lawyer) }
  let(:valid_params) do
    {
      appointment: {
        lawyer_id: lawyer.id,
        client_name: 'Test Client',
        client_email: 'test@example.com',
        appointment_date: 5.days.from_now,
        service_type: 'Consultation'
      }
    }
  end

  describe 'POST /api/v1/appointments' do
    it 'creates an appointment' do
      post '/api/v1/appointments', params: valid_params
      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json['data']['client_name']).to eq('Test Client')
    end

    it 'fails without required parameters' do
      post '/api/v1/appointments', params: {
        appointment: {
          lawyer_id: lawyer.id
        }
      }
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end
