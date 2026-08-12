class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActiveRecord::RecordInvalid, with: :unprocessable
  rescue_from ActionController::ParameterMissing, with: :parameter_missing

  private

  def not_found(exception)
    render json: { error: "recurso_no_encontrado", detalle: exception.message }, status: :not_found
  end

  def unprocessable(exception)
    render json: { error: "datos_invalidos", detalle: exception.record.errors.full_messages },
           status: :unprocessable_entity
  end

  def parameter_missing(exception)
    render json: { error: "campos_requeridos", detalle: exception.param }, status: :bad_request
  end
end
