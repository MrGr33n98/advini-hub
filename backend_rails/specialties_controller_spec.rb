require 'rails_helper'

RSpec.describe "GET /api/v1/specialties", type: :request do
  before do
    @specialty1 = create(:specialty, name: "Direito Civil", icon: 'scales', color: '#1e40af', position: 1, is_active: true)
    @specialty2 = create(:specialty, name: "Direito Penal", icon: 'shield', color: '#7c3aed', position: 2, is_active: true)
    @specialty3 = create(:specialty, name: "Direito Trabalhista", icon: 'briefcase', color: '#dc2626', position: 3, is_active: false, parent_id: @specialty1.id)
  end

  describe 'index' do
    it 'returns all top-level active specialties' do
      get '/api/v1/specialties'
      expect(response).to have_http_status(:success)
      data = JSON.parse(response.body)
      
      expect(data).to be_an(Array)
      expect(data.length).to eq(2)
      expect(data.map { |s| s['name'] }).to contain_exactly("Direito Civil", "Direito Penal")
    end

    it 'returns specialty with icon, color, position, and is_active' do
      get '/api/v1/specialties'
      data = JSON.parse(response.body)
      
      specialty_data = data.find { |s| s['name'] == 'Direito Civil' }
      expect(specialty_data).to include(
        'icon' => 'scales',
        'color' => '#1e40af',
        'position' => 1,
        'is_active' => true
      )
    end

    it 'filters by search term' do
      get '/api/v1/specialties', params: { search: 'Civil' }
      data = JSON.parse(response.body)
      
      expect(data.length).to eq(1)
      expect(data[0]['name']).to eq("Direito Civil")
    end

    it 'filters by parent_id to show children' do
      get '/api/v1/specialties', params: { parent_id: @specialty1.id }
      data = JSON.parse(response.body)
      
      expect(data.map { |s| s['name'] }).to include("Direito Trabalhista")
    end
  end

  describe 'show' do
    it 'returns a single specialty with details' do
      get "/api/v1/specialties/#{@specialty1.id}"
      expect(response).to have_http_status(:success)
      data = JSON.parse(response.body)
      
      expect(data).to include(
        'id' => @specialty1.id,
        'name' => 'Direito Civil',
        'icon' => 'scales',
        'color' => '#1e40af',
        'position' => 1,
        'is_active' => true
      )
    end

    it 'includes children in the response' do
      get "/api/v1/specialties/#{@specialty1.id}"
      data = JSON.parse(response.body)
      
      expect(data).to have_key('children')
      expect(data['children']).to be_an(Array)
      expect(data['children'].map { |c| c['name'] }).to include("Direito Trabalhista")
    end

    it 'includes lawyer_count in the response' do
      lawyer = create(:lawyer)
      @specialty1.lawyers << lawyer
      
      get "/api/v1/specialties/#{@specialty1.id}"
      data = JSON.parse(response.body)
      
      expect(data).to have_key('lawyer_count')
      expect(data['lawyer_count']).to eq(1)
    end
  end
end
