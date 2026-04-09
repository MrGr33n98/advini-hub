class CreateSaasTables < ActiveRecord::Migration[7.0]
  def change
    # ========================================
    # LEADS TABLE
    # ========================================
    create_table :leads do |t|
      t.string :email, null: false, index: { unique: true }
      t.string :name, null: false
      t.string :phone
      t.string :company
      t.string :job_title
      t.integer :source, default: 0, null: false # enum
      t.integer :status, default: 0, null: false # enum
      t.integer :score, default: 0
      t.integer :demographic_score, default: 0
      t.integer :behavioral_score, default: 0
      t.integer :firmographic_score, default: 0
      t.integer :intent_score, default: 0
      t.integer :engagement_score, default: 0
      t.integer :recency_score, default: 0
      t.string :specialty_interest
      t.decimal :estimated_case_value, precision: 12, scale: 2
      t.string :location_city
      t.string :location_state
      t.string :location_country, default: 'Brasil'
      t.text :tags, array: true, default: []
      t.text :notes
      t.references :assigned_lawyer, foreign_key: { to_table: :lawyers }
      t.datetime :last_contacted_at
      t.datetime :converted_at
      t.decimal :conversion_value, precision: 12, scale: 2
      t.integer :email_opened_count, default: 0
      t.integer :email_clicked_count, default: 0
      t.datetime :last_email_opened_at
      t.integer :engagement_level, default: 0 # enum: low/medium/high/very_high

      t.timestamps
    end

    add_index :leads, :source
    add_index :leads, :status
    add_index :leads, :score
    add_index :leads, :engagement_level
    add_index :leads, [:location_city, :location_state]
    add_index :leads, :created_at

    # ========================================
    # LEAD ACTIVITIES TABLE
    # ========================================
    create_table :lead_activities do |t|
      t.references :lead, null: false, foreign_key: true
      t.integer :activity_type, null: false # enum
      t.string :description
      t.jsonb :metadata, default: {}
      t.datetime :occurred_at

      t.timestamps
    end

    add_index :lead_activities, :activity_type
    add_index :lead_activities, :occurred_at

    # ========================================
    # SUBSCRIPTIONS TABLE (for Members)
    # ========================================
    create_table :subscriptions do |t|
      t.references :user, null: false, foreign_key: true
      t.references :plan, null: false, foreign_key: true
      t.integer :status, default: 0, null: false # enum
      t.datetime :current_period_start
      t.datetime :current_period_end
      t.boolean :cancel_at_period_end, default: false
      t.datetime :canceled_at
      t.datetime :trial_start
      t.datetime :trial_end
      t.decimal :amount, precision: 10, scale: 2
      t.string :currency, default: 'BRL'
      t.string :payment_method
      t.datetime :last_payment_date
      t.datetime :next_payment_date
      t.string :stripe_subscription_id
      t.string :stripe_customer_id

      t.timestamps
    end

    add_index :subscriptions, :status
    add_index :subscriptions, :current_period_end
    add_index :subscriptions, :stripe_subscription_id, unique: true

    # ========================================
    # PLANS TABLE
    # ========================================
    create_table :plans do |t|
      t.string :name, null: false
      t.string :slug, null: false, index: { unique: true }
      t.text :description
      t.decimal :price_monthly, precision: 10, scale: 2, default: 0
      t.decimal :price_yearly, precision: 10, scale: 2, default: 0
      t.string :currency, default: 'BRL'
      t.boolean :is_active, default: true
      t.boolean :is_popular, default: false
      t.integer :display_order, default: 0
      t.integer :max_contacts_per_month
      t.integer :max_specialties
      t.integer :max_lawyers
      t.integer :max_storage_gb
      t.integer :max_api_calls_per_month
      t.boolean :has_analytics, default: false
      t.boolean :has_blog_access, default: false
      t.boolean :has_priority_support, default: false
      t.boolean :has_api_access, default: false
      t.boolean :has_custom_branding, default: false
      t.boolean :has_white_label, default: false
      t.jsonb :features, default: []
      t.string :stripe_price_id_monthly
      t.string :stripe_price_id_yearly

      t.timestamps
    end

    add_index :plans, :is_active
    add_index :plans, :display_order

    # ========================================
    # SPONSORED CAMPAIGNS TABLE
    # ========================================
    create_table :sponsored_campaigns do |t|
      t.string :sponsor_type, null: false # 'Lawyer' or 'Office'
      t.integer :sponsor_id, null: false
      t.string :sponsor_name, null: false
      t.string :sponsor_email, null: false
      t.string :campaign_name, null: false
      t.integer :campaign_type, null: false # enum
      t.integer :status, default: 0, null: false # enum
      t.decimal :budget_total, precision: 12, scale: 2
      t.decimal :budget_spent, precision: 12, scale: 2, default: 0
      t.decimal :budget_remaining, precision: 12, scale: 2
      t.decimal :cost_per_click, precision: 10, scale: 2
      t.decimal :daily_budget, precision: 10, scale: 2
      t.integer :billing_type, default: 0 # enum
      t.bigint :impressions, default: 0
      t.bigint :clicks, default: 0
      t.decimal :ctr, precision: 5, scale: 2, default: 0
      t.integer :conversions, default: 0
      t.decimal :conversion_rate, precision: 5, scale: 2, default: 0
      t.decimal :cost_per_conversion, precision: 10, scale: 2
      t.string :target_specialties, array: true, default: []
      t.string :target_locations, array: true, default: []
      t.string :target_keywords, array: true, default: []
      t.datetime :start_date
      t.datetime :end_date
      t.integer :schedule_type, default: 0 # enum
      t.string :banner_url
      t.string :landing_page_url
      t.text :custom_html
      t.references :approved_by, foreign_key: { to_table: :admin_users }
      t.datetime :approved_at
      t.text :rejection_reason

      t.timestamps
    end

    add_index :sponsored_campaigns, :sponsor_type
    add_index :sponsored_campaigns, [:sponsor_type, :sponsor_id]
    add_index :sponsored_campaigns, :status
    add_index :sponsored_campaigns, :campaign_type
    add_index :sponsored_campaigns, :start_date
    add_index :sponsored_campaigns, :end_date

    # ========================================
    # ARTICLES TABLE
    # ========================================
    create_table :articles do |t|
      t.references :author, null: false, foreign_key: { to_table: :lawyers }
      t.string :title, null: false
      t.string :slug, null: false, index: { unique: true }
      t.text :excerpt
      t.text :content
      t.string :cover_image_url
      t.string :meta_title
      t.text :meta_description
      t.string :meta_keywords, array: true, default: []
      t.string :category
      t.string :tags, array: true, default: []
      t.string :related_specialties, array: true, default: []
      t.integer :status, default: 0, null: false # enum
      t.datetime :published_at
      t.datetime :scheduled_for
      t.bigint :views, default: 0
      t.bigint :unique_views, default: 0
      t.integer :average_read_time_seconds, default: 0
      t.integer :likes, default: 0
      t.integer :shares, default: 0
      t.integer :comments_count, default: 0
      t.integer :seo_score, default: 0
      t.integer :readability_score, default: 0
      t.boolean :is_featured, default: false
      t.boolean :is_premium, default: false
      t.boolean :allow_comments, default: true
      t.string :featured_image_url
      t.integer :read_time_minutes, default: 0

      t.timestamps
    end

    add_index :articles, :status
    add_index :articles, :category
    add_index :articles, :published_at
    add_index :articles, :is_featured
    add_index :articles, :views

    # ========================================
    # ARTICLE COMMENTS TABLE
    # ========================================
    create_table :article_comments do |t|
      t.references :article, null: false, foreign_key: true
      t.references :user, foreign_key: true # optional
      t.string :user_name, null: false
      t.string :user_email, null: false
      t.text :content, null: false
      t.integer :status, default: 0, null: false # enum
      t.references :parent, foreign_key: { to_table: :article_comments } # for nested comments

      t.timestamps
    end

    add_index :article_comments, :status
    add_index :article_comments, :created_at

    # ========================================
    # ADD SUBSCRIPTION REFERENCES TO USERS
    # ========================================
    add_reference :users, :subscription, foreign_key: true
    add_column :users, :member_status, :integer, default: 0 # enum: active/suspended/pending/trial/expired
    add_column :users, :trial_ends_at, :datetime
    add_column :users, :last_login_at, :datetime
    add_column :users, :login_count, :integer, default: 0
    add_column :users, :storage_used_mb, :integer, default: 0
    add_column :users, :api_calls_this_month, :integer, default: 0

    add_index :users, :member_status
  end
end
