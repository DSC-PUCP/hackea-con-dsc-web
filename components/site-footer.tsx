import Image from "next/image"
import { program } from "@/lib/events"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/30">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-10 md:flex-row md:items-center md:px-6">
        <div className="flex items-center gap-2.5">
          <Image
            src="/images/dsc-mark.png"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 rounded-md"
          />
          <span className="font-display font-bold">{program.name}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {program.tagline}
        </p>
        <p className="text-sm text-muted-foreground">
          Developer Student Club PUCP · Hecho por y para estudiantes.
        </p>
      </div>
    </footer>
  )
}
