# Tabla de clasificacion global y por facultad.
# Responsable: Jorge del Campo
# RF-06 Consultar tabla de clasificacion (ranking)
module Api
  module V1
    class RankingController < ApplicationController
      DEFAULT_LIMIT = 10
      MAX_LIMIT = 100

      # GET /api/v1/ranking?facultad=FIEC&limit=10
      def index
        facultad = params[:facultad].presence&.upcase
        scope = facultad ? Player.where(facultad: facultad) : Player.all

        tabla = scope.order(total_score: :desc, levels_completed: :desc, nickname: :asc)
                     .limit(page_limit)
                     .each_with_index
                     .map { |player, index| player.as_summary.merge(posicion: index + 1) }

        render json: {
          alcance: facultad ? "facultad:#{facultad}" : "global",
          total_jugadores: scope.count,
          mostrados: tabla.size,
          tabla: tabla
        }
      end

      private

      def page_limit
        limit = params[:limit].to_i
        return DEFAULT_LIMIT if limit <= 0

        [limit, MAX_LIMIT].min
      end
    end
  end
end
