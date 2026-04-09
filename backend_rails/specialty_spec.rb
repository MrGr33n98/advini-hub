require 'rails_helper'

RSpec.describe Specialty, type: :model do
  subject { build(:specialty) }

  describe 'validations' do
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_uniqueness_of(:name) }
    it { is_expected.to validate_presence_of(:description) }
    it { is_expected.to validate_presence_of(:icon) }
    it { is_expected.to validate_presence_of(:color) }
    it { is_expected.to validate_presence_of(:position) }

    describe "color format validation" do
      it "accepts valid hex colors" do
        specialty = build(:specialty, color: '#FF5733')
        expect(specialty).to be_valid
      end

      it "accepts lowercase hex colors" do
        specialty = build(:specialty, color: '#ff5733')
        expect(specialty).to be_valid
      end

      it "rejects invalid hex colors" do
        specialty = build(:specialty, color: 'FF5733')
        expect(specialty).not_to be_valid
        expect(specialty.errors[:color]).to include("deve ser um hexadecimal válido (ex: #FF5733)")
      end

      it "rejects invalid hex format" do
        specialty = build(:specialty, color: '#GGG000')
        expect(specialty).not_to be_valid
      end
    end

    describe "position numericality" do
      it "accepts integer positions" do
        specialty = build(:specialty, position: 5)
        expect(specialty).to be_valid
      end

      it "rejects non-integer positions" do
        specialty = build(:specialty, position: 5.5)
        expect(specialty).not_to be_valid
      end
    end
  end

  describe 'associations' do
    it { is_expected.to have_and_belong_to_many(:lawyers).join_table('lawyer_specialties') }
    it { is_expected.to have_many(:children).class_name('Specialty') }
    it { is_expected.to belong_to(:parent).class_name('Specialty').optional }
  end

  describe '#slug generation' do
    it "generates slug from name on save" do
      specialty = create(:specialty, name: "Direito Civil")
      expect(specialty.slug).to eq("direito-civil")
    end

    it "updates slug when name changes" do
      specialty = create(:specialty, name: "Direito Civil")
      specialty.update(name: "Direito Penal")
      expect(specialty.slug).to eq("direito-penal")
    end

    it "handles special characters in slug" do
      specialty = create(:specialty, name: "Direito de Família")
      expect(specialty.slug).to eq("direito-de-familia")
    end
  end

  describe 'scopes' do
    before do
      @active_spec = create(:specialty, name: "Direito Civil", is_active: true)
      @inactive_spec = create(:specialty, name: "Direito Penal", is_active: false)
      @lawyer = create(:lawyer)
      @active_spec.lawyers << @lawyer
    end

    describe '.active' do
      it 'returns only active specialties' do
        expect(Specialty.active).to include(@active_spec)
        expect(Specialty.active).not_to include(@inactive_spec)
      end
    end

    describe '.alphabetical' do
      it 'returns specialties ordered by name' do
        create(:specialty, name: "Zebra")
        create(:specialty, name: "Apple")
        specialties = Specialty.alphabetical
        names = specialties.pluck(:name)
        expect(names).to eq(names.sort)
      end
    end

    describe '.popular' do
      it 'returns specialties ordered by lawyer count (desc)' do
        spec1 = create(:specialty, name: "Spec 1")
        spec2 = create(:specialty, name: "Spec 2")
        
        2.times { spec1.lawyers << create(:lawyer) }
        3.times { spec2.lawyers << create(:lawyer) }
        
        popular = Specialty.popular
        expect(popular.first).to eq(spec2)
        expect(popular.last).to eq(spec1)
      end
    end
  end

  describe 'ransackable attributes and associations' do
    it 'includes searchable attributes' do
      attrs = Specialty.ransackable_attributes
      expect(attrs).to include('name', 'description', 'icon', 'color', 'position', 'is_active')
    end

    it 'includes searchable associations' do
      assocs = Specialty.ransackable_associations
      expect(assocs).to include('lawyers', 'parent', 'children')
    end
  end
end
