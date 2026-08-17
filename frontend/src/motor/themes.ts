// Paleta de cada zona del campus; el nivel elige la suya con su background_key.
// Los tres niveles son interiores: pared, techo, piso y lo que se ve por la
// ventana.
export interface Theme {
  pared: number
  paredZocalo: number
  techo: number
  piso: number
  plataforma: number
  plataformaBorde: number
  vegetacion: number
  // Lo que se ve por la ventana: cielo y los cerros de la Prosperina.
  cielo: number
  colina: number
  colinaLejana: number
  // Color de la hoja de las puertas y prefijo de su letrero.
  puerta: number
  letreroPuerta: string
}

const FIEC: Theme = {
  pared: 0xdfe6ea, paredZocalo: 0x7f97a5, techo: 0xeef3f6, piso: 0xc3ccd2,
  plataforma: 0xb9c3c9, plataformaBorde: 0xe8eef1,
  vegetacion: 0x2f7d3f,
  cielo: 0x9fd0ee, colina: 0x4a7c48, colinaLejana: 0x6f9b6a,
  puerta: 0xd9dee3, letreroPuerta: "LAB",
}

const BIBLIOTECA: Theme = {
  pared: 0xf0e6d2, paredZocalo: 0xa08b62, techo: 0xfaf4e6, piso: 0xd9cbb0,
  plataforma: 0xd8cdb4, plataformaBorde: 0xf3ecdc,
  vegetacion: 0x2f7d3f,
  cielo: 0xf0c98a, colina: 0x4f7a4a, colinaLejana: 0x769c6c,
  puerta: 0xe6ddc9, letreroPuerta: "SALA",
}

const BIENESTAR: Theme = {
  pared: 0xe4f1ec, paredZocalo: 0x82a99c, techo: 0xf3faf7, piso: 0xcbdcd5,
  plataforma: 0xc7dcd3, plataformaBorde: 0xeef7f3,
  vegetacion: 0x2f8d4f,
  cielo: 0xc9eddf, colina: 0x3f7d55, colinaLejana: 0x6aa07a,
  puerta: 0xe8f2ee, letreroPuerta: "OFIC",
}

const TEMAS: Record<string, Theme> = {
  fiec_day: FIEC,
  biblioteca_day: BIBLIOTECA,
  bienestar_day: BIENESTAR,
  campus_day: FIEC,
}

export function themeFor(backgroundKey: string): Theme {
  return TEMAS[backgroundKey] ?? FIEC
}
