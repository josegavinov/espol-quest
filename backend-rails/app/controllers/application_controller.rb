class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound,       with: :not_found
  rescue_from ActiveRecord::RecordInvalid,        with: :unprocessable
  rescue_from ActionController::ParameterMissing, with: :parameter_missing

  private

  def not_found(exception)
    render json: { error: "recurso_no_encontrado", detalle: exception.message }, status: 404
  end

  def unprocessable(exception)
    render json: { error: "datos_invalidos", detalle: exception.record.errors.full_messages },
           status: 422
  end

  def parameter_missing(exception)
    render json: { error: "campos_requeridos", detalle: exception.param }, status: 400
  end

  # Los recursos publicos se buscan por su codigo (FIEC-01, M-BIB-01), no por
  # el id de la base de datos.
  def find_level!(code)
    Level.find_by!(code: code.to_s.upcase)
  end

  def find_mission!(code)
    Mission.find_by!(code: code.to_s.upcase)
  end
end
