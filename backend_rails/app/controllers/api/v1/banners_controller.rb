class Api::V1::BannersController < ApplicationController
  def index
    # Retorna uma lista vazia de banners para não quebrar o frontend
    render json: []
  end
end
