# Registro y consulta del progreso e insignias del jugador.
# Responsable: Jorge del Campo
# RF-05 Registrar progreso e insignias del jugador (escritura)
module Api
  module V1
    class ProgressController < ApplicationController
      # POST /api/v1/progress
      # Recibe el resultado de un nivel enviado por el Servicio Principal de Juego.
      def create
        data = progress_params

        profile = nil
        ActiveRecord::Base.transaction do
          profile = Profile.find_or_initialize_by(external_player_id: data[:player_id])
          profile.nickname = data[:nickname] if data[:nickname].present?
          profile.facultad = data[:facultad].to_s.upcase if data[:facultad].present?
          profile.save!

          progress = profile.level_progresses.find_or_initialize_by(level_code: data[:level_code])
          # El puntaje nunca baja: se conserva el mejor intento del jugador.
          progress.score = [progress.score.to_i, data[:score].to_i].max
          progress.exploration_pct = [progress.exploration_pct.to_f, data[:exploration_pct].to_f].max
          progress.missions_completed = [progress.missions_completed.to_i,
                                         data[:missions_completed].to_i].max
          if ActiveModel::Type::Boolean.new.cast(data[:completed])
            progress.completed = true
            progress.completed_at ||= Time.current
          end
          progress.save!

          award_badges(profile, Array(data[:badges]))
          profile.recalculate_totals!
        end

        render json: {
          message: "progreso_registrado",
          perfil: profile.reload.as_detail
        }, status: :created
      end

      # GET /api/v1/progress/:player_id
      def show
        profile = Profile.find_by!(external_player_id: params[:player_id])
        render json: profile.as_detail
      end

      private

      def progress_params
        params.require(:player_id)
        params.require(:level_code)
        params.permit(:player_id, :nickname, :facultad, :level_code, :score,
                      :exploration_pct, :missions_completed, :completed, badges: [])
      end

      # Otorga las insignias enviadas; ignora las ya obtenidas y las desconocidas.
      def award_badges(profile, badge_keys)
        badge_keys.each do |key|
          badge = Badge.find_by(key: key)
          next if badge.nil?
          next if profile.profile_badges.exists?(badge_id: badge.id)

          profile.profile_badges.create!(badge: badge, awarded_at: Time.current)
        end
      end
    end
  end
end
