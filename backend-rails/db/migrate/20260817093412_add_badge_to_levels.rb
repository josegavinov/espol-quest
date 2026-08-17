# La insignia que otorga superar un nivel deja de ser una clave escrita a mano
# en el cliente y pasa a declararla el propio nivel, igual que ya lo hacen las
# misiones.
class AddBadgeToLevels < ActiveRecord::Migration[7.1]
  def change
    add_reference :levels, :badge, foreign_key: true
  end
end
