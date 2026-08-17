# Administracion de misiones (CMS).
# Responsable: Jose Gavino
module Api
  module V1
    module Admin
      class MissionsController < ApplicationController
        # GET /api/v1/admin/missions
        def index
          missions = Mission.order(:code)
          render json: { count: missions.size, missions: missions.map(&:as_admin) }
        end

        # POST /api/v1/admin/missions
        def create
          mission = Mission.create!(mission_attributes)
          render json: { message: "mision_creada", mission: mission.as_admin }, status: 201
        end

        # PATCH /api/v1/admin/missions/:code
        def update
          mission = find_mission!(params[:code])
          mission.update!(mission_attributes)
          render json: { message: "mision_actualizada", mission: mission.as_admin }
        end

        # DELETE /api/v1/admin/missions/:code
        def destroy
          find_mission!(params[:code]).destroy!
          render json: { message: "mision_eliminada" }
        end

        private

        def mission_attributes
          datos = mission_params.to_h.symbolize_keys
          nivel = datos.delete(:level_code)
          checkpoint = datos.delete(:checkpoint_code)
          insignia = datos.delete(:badge_key)

          datos[:level] = find_level!(nivel) if nivel.present?
          datos[:checkpoint] = Checkpoint.find_by(code: checkpoint) if checkpoint
          datos[:badge] = Badge.find_by(key: insignia) if insignia
          datos
        end

        def mission_params
          params.permit(:code, :level_code, :checkpoint_code, :badge_key, :title,
                        :description, :kind, :order_index, :active)
        end
      end
    end
  end
end
