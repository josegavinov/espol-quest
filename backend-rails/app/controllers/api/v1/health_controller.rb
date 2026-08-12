module Api
  module V1
    class HealthController < ApplicationController
      # GET /api/v1/health
      def show
        render json: {
          service: "espol-quest-admin-service",
          version: "0.1.0",
          status: "ok",
          database: ActiveRecord::Base.connection_db_config.adapter,
          rails: Rails.version,
          ruby: RUBY_VERSION
        }
      end
    end
  end
end
