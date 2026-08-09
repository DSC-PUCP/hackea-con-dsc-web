import { Code2, Users, Rocket } from "lucide-react"

const pillars = [
  {
    icon: Code2,
    title: "Aprende haciendo",
    description:
      "Charlas y talleres prácticos sobre desarrollo web, IA y la nube, guiados por profesionales de la industria.",
    color: "text-brand-blue",
  },
  {
    icon: Users,
    title: "Comunidad",
    description:
      "Conecta con otros estudiantes, mentores y egresados. Forma equipos y construye tu red de contactos.",
    color: "text-brand-red",
  },
  {
    icon: Rocket,
    title: "Construye y presenta",
    description:
      "Lleva una idea de cero a un demo funcional y muéstralo en el Demo Day de cierre del programa.",
    color: "text-brand-green",
  },
]

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <div className="max-w-2xl">
        <p className="font-display text-sm font-semibold uppercase tracking-widest text-brand-blue">
          Qué es Hack with DSC
        </p>
        <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight md:text-4xl">
          Tres días para aprender, construir y crecer en comunidad
        </h2>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          Hack with DSC reúne una serie de sesiones donde estudiantes de todos
          los niveles pueden acercarse a la tecnología. Cada charla y taller está
          pensado para que salgas con algo concreto: un concepto nuevo, una
          herramienta o incluso un proyecto en marcha.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {pillars.map((pillar) => (
          <div
            key={pillar.title}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <pillar.icon className={`h-7 w-7 ${pillar.color}`} />
            <h3 className="mt-4 font-display text-lg font-semibold">
              {pillar.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
