import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Agenda } from "@/components/agenda"
import { Location } from "@/components/location"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <main className="min-h-dvh">
      <SiteHeader />
      <Hero />
      <About />
      <Agenda />
      <Location />
      <SiteFooter />
    </main>
  )
}
