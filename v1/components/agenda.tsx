import { Clock, MapPin, Mic } from "lucide-react"
import { talks, type BrandColor } from "@/lib/events"

const accent: Record<
  BrandColor,
  { bar: string; dot: string; badge: string; text: string }
> = {
  blue: {
    bar: "bg-brand-blue",
    dot: "bg-brand-blue",
    badge: "border-brand-blue/40 bg-brand-blue/10",
    text: "text-brand-blue",
  },
  red: {
    bar: "bg-brand-red",
    dot: "bg-brand-red",
    badge: "border-brand-red/40 bg-brand-red/10",
    text: "text-brand-red",
  },
  yellow: {
    bar: "bg-brand-yellow",
    dot: "bg-brand-yellow",
    badge: "border-brand-yellow/40 bg-brand-yellow/10",
    text: "text-brand-yellow",
  },
  green: {
    bar: "bg-brand-green",
    dot: "bg-brand-green",
    badge: "border-brand-green/40 bg-brand-green/10",
    text: "text-brand-green",
  },
}

export function Agenda() {
  return (
    <section
      id="agenda"
      className="border-t border-border/60 bg-card/30 py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="max-w-2xl">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-brand-red">
            Agenda
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight md:text-4xl">
            Charlas y talleres del programa
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Estas son las sesiones que lanzaremos durante Hack with DSC. La
            entrada es libre para toda la comunidad estudiantil.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {talks.map((talk) => {
            const c = accent[talk.color]
            return (
              <li
                key={talk.id}
                className="group relative flex overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className={`w-1.5 shrink-0 ${c.bar}`} aria-hidden="true" />
                <div className="flex-1 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${c.badge}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
                      {talk.type}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                      {talk.date}
                    </span>
                  </div>

                  <h3 className="mt-4 text-balance font-display text-xl font-semibold leading-snug">
                    {talk.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <Mic className={`h-4 w-4 ${c.text}`} />
                    <span className="font-medium">{talk.speaker}</span>
                    <span className="text-muted-foreground">· {talk.role}</span>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {talk.description}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {talk.time}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {talk.room}
                    </span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
