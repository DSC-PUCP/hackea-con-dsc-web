/*
import { MapPin, Navigation } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { program } from "@/lib/events"

export function Location() {
  const { venue } = program

  return (
    <section
      id="location"
      className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24"
    >
      <div className="max-w-2xl">
        <p className="font-display text-sm font-semibold uppercase tracking-widest text-brand-green">
          Ubicación
        </p>
        <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight md:text-4xl">
          Dónde nos encontramos
        </h2>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <MapPin className="h-7 w-7 text-brand-red" />
            <h3 className="mt-4 font-display text-xl font-semibold">
              {venue.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {venue.address}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              El acceso es por la entrada principal del campus. Habrá señalética
              del staff de Hack with DSC guiando hacia cada sala.
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Ciudad+Universitaria"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({
                variant: "outline",
                className: "mt-6 w-full",
              })}
            >
              <Navigation className="h-4 w-4" />
              Cómo llegar
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border lg:col-span-3">
          <iframe
            title={`Mapa de ${venue.name}`}
            src={venue.mapEmbed}
            className="h-full min-h-80 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  )
}
*/