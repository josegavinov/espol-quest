# Pregunta de trivia con opciones multiples.
class Question < ApplicationRecord
  belongs_to :mission

  validates :statement, presence: true
  validates :correct_option, numericality: { greater_than_or_equal_to: 0 }
  validate  :correct_option_within_options

  def valid_option?(index)
    index.is_a?(Integer) && index.between?(0, options.size - 1)
  end

  def feedback_for(acerto)
    acerto ? feedback_ok : feedback_fail
  end

  # Vista del CMS: aqui si se expone la respuesta correcta.
  def as_admin
    {
      id: id,
      statement: statement,
      options: options,
      correct_option: correct_option,
      points: points,
      feedback_ok: feedback_ok,
      feedback_fail: feedback_fail,
      order_index: order_index
    }
  end

  # Se omite correct_option: el cliente no debe conocer la respuesta.
  def as_detail
    {
      id: id,
      statement: statement,
      options: options,
      points: points,
      order: order_index
    }
  end

  private

  def correct_option_within_options
    return if valid_option?(correct_option)

    errors.add(:correct_option, "no corresponde a ninguna de las opciones")
  end
end
