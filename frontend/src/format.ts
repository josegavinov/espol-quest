// Formatos compartidos entre pantallas.
export function formatTime(segundos: number) {
  const minutos = Math.floor(segundos / 60)
  return `${minutos}:${String(segundos % 60).padStart(2, "0")}`
}
