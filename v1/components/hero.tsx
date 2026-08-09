import Image from "next/image"
import { CalendarDays, MapPin, Ticket } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { program } from "@/lib/events"

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border/60">
      <div className="absolute inset-0">
        <Image
          src="/images/hack-hero.png"
          alt="Estudiantes colaborando durante un evento de Hack with DSC"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-blue/40 bg-brand-blue/10 px-3 py-1 text-xs font-medium text-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
          {program.edition}
        </span>

        <h1 className="mt-5 max-w-2xl text-balance font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
          {program.name}
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Un programa de charlas y talleres del Developer Student Club para
          aprender, construir en equipo y conectar con la comunidad de
          estudiantes desarrolladores.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/70 px-3 py-2">
            <CalendarDays className="h-4 w-4 text-brand-blue" />
            {program.dateRange}
          </span>
          <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/70 px-3 py-2">
            <MapPin className="h-4 w-4 text-brand-red" />
            {program.venue.name}
          </span>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#agenda" className={buttonVariants({ size: "lg" })}>
            <Ticket className="h-4 w-4" />
            Explorar la agenda
          </a>
          <a
            href="#about"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            Conocer el programa
          </a>
        </div>
      </div>
    </section>
  )
}
