# Add caching concerns
module Cacheable
  extend ActiveSupport::Concern

  def cache_key_with_version(model_instance)
    "#{model_instance.class.model_name.cache_key}/" \
    "#{model_instance.id}-#{model_instance.updated_at.to_i}"
  end
end