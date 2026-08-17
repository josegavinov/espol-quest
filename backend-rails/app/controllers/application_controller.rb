class ApplicationController < ActionController::API
  # Un numero que llego con basura.
  class InvalidNumber < StandardError; end

  rescue_from ActiveRecord::RecordNotFound,       with: :not_found
  rescue_from ActiveRecord::RecordInvalid,        with: :unprocessable
  rescue_from ActionController::ParameterMissing, with: :parameter_missing
  rescue_from InvalidNumber,                      with: :invalid_number

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

  def invalid_number(exception)
    render json: { error: "valor_numerico_invalido", detalle: exception.message }, status: 422
  end

  # Convierte un parametro a entero.
  def integer_param(value, default: nil)
    return default if value.nil?

    Integer(value.to_s, exception: false) || raise(InvalidNumber, value.to_s)
  end

  # Busqueda por codigo publico.
  def find_level!(code)
    Level.find_by!(code: code.to_s.upcase)
  end

  def find_mission!(code)
    Mission.find_by!(code: code.to_s.upcase)
  end
end
