class ApplicationController < ActionController::API
  # Un numero que llego con basura. Se declara aqui para que los controladores
  # no tengan que decidir cada uno que hacer con "abc".
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

  # Convierte un parametro a entero. Sin esto un "abc" se guardaria como cero:
  # en una respuesta de trivia eso equivalia a elegir la primera opcion.
  def integer_param(value, default: nil)
    return default if value.nil?

    Integer(value.to_s, exception: false) || raise(InvalidNumber, value.to_s)
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
