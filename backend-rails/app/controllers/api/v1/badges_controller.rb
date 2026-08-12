# Catálogo de insignias del juego.
# Responsable: Jorge del Campo
module Api
  module V1
    class BadgesController < ApplicationController
      # GET /api/v1/badges
      def index
        badges = Badge.order(:key)
        render json: { count: badges.size, insignias: badges.map(&:as_json_public) }
      end
    end
  end
end
