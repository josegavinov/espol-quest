# Mision asociada a un nivel; se dispara al alcanzar un checkpoint.
# RF-03 registro de respuestas, RF-04 catalogo de misiones.
class Mission < ApplicationRecord
  belongs_to :level
  belongs_to :checkpoint, optional: true
  belongs_to :badge, optional: true
  has_many :questions, -> { order(:order_index) }, dependent: :destroy
  has_many :mission_answers, dependent: :destroy

  validates :code, :title, presence: true
  validates :code, uniqueness: true

  scope :active, -> { where(active: true).order(:order_index) }

  def max_points
    questions.sum(&:points)
  end

  # RF-03 (escritura). Registra la respuesta del jugador. El puntaje se otorga
  # una sola vez por pregunta: los reintentos quedan registrados pero valen 0.
  def register_answer(player:, question:, selected_option:)
    previous = player.mission_answers.where(question: question).order(:attempt).last
    ya_puntuada = previous&.correct? || false
    acerto = selected_option == question.correct_option

    player.mission_answers.create!(
      mission: self,
      question: question,
      selected_option: selected_option,
      correct: acerto,
      points_awarded: acerto && !ya_puntuada ? question.points : 0,
      attempt: (previous&.attempt || 0) + 1,
      answered_at: Time.current
    )
  end

  # Estado de la mision para un jugador: cuanto lleva y si ya la completo.
  def summary_for(player)
    answers = mission_answers.where(player: player)
    correctas = answers.where(correct: true).distinct.count(:question_id)

    {
      mission_code: code,
      puntaje_obtenido: answers.sum(:points_awarded),
      puntaje_maximo: max_points,
      preguntas_correctas: correctas,
      preguntas_totales: questions.size,
      completada: correctas == questions.size,
      insignia: badge&.key
    }
  end

  def solved_by?(player)
    mission_answers.where(player: player, correct: true)
                   .distinct.count(:question_id) == questions.size
  end

  # Catalogo de misiones del nivel (RF-04).
  def as_summary
    {
      code: code,
      title: title,
      description: description,
      kind: kind,
      checkpoint_code: checkpoint&.code,
      questions_count: questions.size,
      max_points: max_points,
      insignia: badge&.key,
      order: order_index
    }
  end

  # Detalle con las preguntas; nunca expone cual es la opcion correcta.
  def as_detail
    as_summary.merge(
      level_code: level.code,
      questions: questions.map(&:as_json_public)
    )
  end
end
