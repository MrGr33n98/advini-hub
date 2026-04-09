require 'rails_helper'

RSpec.describe 'Api::V1::LawyersController', type: :request do
  describe 'GET /api/v1/lawyers' do
    let!(:lawyer1) { create(:lawyer, full_name: 'João Silva') }
    let!(:lawyer2) { create(:lawyer, full_name: 'Maria Costa') }

    it 'returns all lawyers' do
      get '/api/v1/lawyers'
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json['data'].count).to be >= 2
    end

    it 'filters lawyers by city' do
      lawyer_sp = create(:lawyer, city: 'São Paulo')
      lawyer_rj = create(:lawyer, city: 'Rio de Janeiro')
      
      get '/api/v1/lawyers', params: { city: 'São Paulo' }
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json['data'].map { |l| l['city'] }).to all(eq('São Paulo'))
    end

    it 'paginates results' do
      get '/api/v1/lawyers', params: { page: 1, limit: 1 }
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json['data'].count).to eq(1)
      expect(json['page']).to eq(1)
      expect(json['limit']).to eq(1)
    end
  end

  describe 'GET /api/v1/lawyers/:id' do
    let!(:lawyer) { create(:lawyer) }

    it 'returns a specific lawyer' do
      get "/api/v1/lawyers/#{lawyer.id}"
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json['data']['id']).to eq(lawyer.id)
      expect(json['data']['full_name']).to eq(lawyer.full_name)
    end

    it 'returns 404 for non-existent lawyer' do
      get '/api/v1/lawyers/9999'
      expect(response).to have_http_status(:not_found)
    end
  end
end
