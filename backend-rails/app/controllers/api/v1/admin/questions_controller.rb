# Administracion de las preguntas de una mision (CMS).
# Responsable: Jose Gavino
module Api
  module V1
    module Admin
      class QuestionsController < ApplicationController
        # GET /api/v1/admin/missions/:mission_code/questions
        def index
          questions = find_mission!(params[:mission_code]).questions
          render json: { count: questions.size, questions: questions.map(&:as_admin) }
        end

        # POST /api/v1/admin/missions/:mission_code/questions
        def create
          mission = find_mission!(params[:mission_code])
          question = mission.questions.create!(question_params)
          render json: { message: "pregunta_creada", question: question.as_admin }, status: 201
        end

        # PATCH /api/v1/admin/questions/:id
        def update
          question = Question.find(params[:id])
          question.update!(question_params)
          render json: { message: "pregunta_actualizada", question: question.as_admin }
        end

        # DELETE /api/v1/admin/questions/:id
        def destroy
          Question.find(params[:id]).destroy!
          render json: { message: "pregunta_eliminada" }
        end

        private

        def question_params
          params.permit(:statement, :correct_option, :points, :feedback_ok,
                        :feedback_fail, :order_index, options: [])
        end
      end
    end
  end
end
