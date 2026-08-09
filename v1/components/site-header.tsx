import Image from "next/image"
import { buttonVariants } from "@/components/ui/button"

export function SiteHeader() {
  const a = 3;
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <Image
            src="/images/dsc-mark.png"
            alt="Logo de Hack with DSC"
            width={32}
            height={32}
            className="h-8 w-8 rounded-md"
          />
          <span className="font-display text-lg font-bold tracking-tight">
            Hack with DSC
          </span>
        </a>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#about" className="transition-colors hover:text-foreground">
            El proyecto
          </a>
          <a href="#agenda" className="transition-colors hover:text-foreground">
            Agenda
          </a>
          <a href="#location" className="transition-colors hover:text-foreground">
            Ubicación
          </a>
        </nav>

        <a href="#agenda" className={buttonVariants({ size: "sm" })}>
          Ver charlas
        </a>
      </div>
    </header>
  )
}
