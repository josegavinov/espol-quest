# Administracion de niveles del campus (CMS).
# Responsable: Kevin Galvez
module Api
  module V1
    module Admin
      class LevelsController < ApplicationController
        # GET /api/v1/admin/levels
        def index
          levels = Level.order(:order_index)
          render json: { count: levels.size, levels: levels.map(&:as_admin) }
        end

        # POST /api/v1/admin/levels
        def create
          level = Level.create!(level_params)
          render json: { message: "nivel_creado", level: level.as_admin }, status: 201
        end

        # PATCH /api/v1/admin/levels/:code
        def update
          level = find_level!(params[:code])
          level.update!(level_params)
          render json: { message: "nivel_actualizado", level: level.as_admin }
        end

        # DELETE /api/v1/admin/levels/:code
        def destroy
          find_level!(params[:code]).destroy!
          render json: { message: "nivel_eliminado" }
        end

        private

        def level_params
          datos = params.permit(:code, :name, :zone, :world, :order_index, :description,
                                :difficulty, :required_score, :active, :width, :height,
                                :gravity_y, :spawn_x, :spawn_y, :background_key, :badge_key)
                        .to_h.symbolize_keys
          insignia = datos.delete(:badge_key)
          datos[:badge] = Badge.find_by(key: insignia) if insignia
          datos
        end
      end
    end
  end
end
