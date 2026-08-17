// Panel de administracion de contenido (CMS).
// Responsables: Jose Gavino (misiones y preguntas) y Kevin Galvez (niveles y
// puntos de interes).
import { useState } from "react"
import { LevelsAdmin } from "./LevelsAdmin"
import { MissionsAdmin } from "./MissionsAdmin"

type Pestana = "misiones" | "niveles"

export function AdminScreen() {
  const [pestana, setPestana] = useState<Pestana>("misiones")

  return (
    <section className="mx-auto max-w-3xl">
      <h2 className="text-2xl font-bold">Administracion de contenido</h2>
      <p className="font-mono text-xs uppercase tracking-widest text-espol-azul">
        Misiones, preguntas y puntos de interes del campus
      </p>

      <div className="my-4 flex gap-2">
        <Pestania activa={pestana === "misiones"} onClick={() => setPestana("misiones")}>
          Misiones y trivias
        </Pestania>
        <Pestania activa={pestana === "niveles"} onClick={() => setPestana("niveles")}>
          Niveles y puntos de interes
        </Pestania>
      </div>

      {pestana === "misiones" ? <MissionsAdmin /> : <LevelsAdmin />}
    </section>
  )
}

function Pestania({
  activa, onClick, children,
}: {
  activa: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm transition ${
        activa ? "bg-espol-azul font-semibold text-white" : "bg-white hover:bg-espol-celeste/20"
      }`}
    >
      {children}
    </button>
  )
}
