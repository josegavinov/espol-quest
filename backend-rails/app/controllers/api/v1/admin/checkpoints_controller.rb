# Administracion de puntos de interes y edificios del campus (CMS).
# Responsable: Kevin Galvez
module Api
  module V1
    module Admin
      class CheckpointsController < ApplicationController
        # GET /api/v1/admin/levels/:level_code/checkpoints
        def index
          checkpoints = find_level!(params[:level_code]).checkpoints
          render json: { count: checkpoints.size, checkpoints: checkpoints.map(&:as_admin) }
        end

        # POST /api/v1/admin/levels/:level_code/checkpoints
        def create
          level = find_level!(params[:level_code])
          checkpoint = level.checkpoints.create!(checkpoint_params)
          render json: { message: "punto_de_interes_creado", checkpoint: checkpoint.as_admin },
                 status: 201
        end

        # PATCH /api/v1/admin/checkpoints/:checkpoint_code
        def update
          checkpoint = Checkpoint.find_by!(code: params[:checkpoint_code].to_s.upcase)
          checkpoint.update!(checkpoint_params)
          render json: { message: "punto_de_interes_actualizado", checkpoint: checkpoint.as_admin }
        end

        # DELETE /api/v1/admin/checkpoints/:checkpoint_code
        def destroy
          Checkpoint.find_by!(code: params[:checkpoint_code].to_s.upcase).destroy!
          render json: { message: "punto_de_interes_eliminado" }
        end

        private

        def checkpoint_params
          params.permit(:code, :name, :x, :y, :kind, :info_text, :order_index)
        end
      end
    end
  end
end
