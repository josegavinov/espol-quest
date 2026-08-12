# Tabla de clasificación global y por facultad.
# Responsable: Jorge del Campo
# RF-06 Consultar tabla de clasificación (ranking) (lectura)
module Api
  module V1
    class RankingController < ApplicationController
      DEFAULT_LIMIT = 10
      MAX_LIMIT = 100

      # GET /api/v1/ranking?facultad=FIEC&limit=10
      def index
        scope = Profile.all
        facultad = params[:facultad].presence&.upcase
        scope = scope.where(facultad: facultad) if facultad

        limit = params[:limit].to_i
        limit = DEFAULT_LIMIT if limit <= 0
        limit = MAX_LIMIT if limit > MAX_LIMIT

        profiles = scope.order(total_score: :desc, levels_completed: :desc, nickname: :asc)
                        .limit(limit)

        tabla = profiles.each_with_index.map do |profile, index|
          profile.as_summary.merge(posicion: index + 1)
        end

        render json: {
          alcance: facultad ? "facultad:#{facultad}" : "global",
          total_jugadores: scope.count,
          mostrados: tabla.size,
          tabla: tabla
        }
      end
    end
  end
end
