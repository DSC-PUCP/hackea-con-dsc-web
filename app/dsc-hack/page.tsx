import type { Metadata } from 'next'

import { AliadoDscHack, CierreDscHack } from '@/components/dsc-hack/cierre'
import { GaleriaDscHack } from '@/components/dsc-hack/galeria'
import { HeroDscHack } from '@/components/dsc-hack/hero'
import { Proyectos } from '@/components/dsc-hack/proyectos'
import { seoDscHack, site } from '@/lib/site-config'
import { urlDelSitio } from '@/lib/site-url'

export const metadata: Metadata = {
  title: seoDscHack.title,
  description: seoDscHack.description,
  alternates: { canonical: `${urlDelSitio}/dsc-hack` },
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: `${urlDelSitio}/dsc-hack`,
    siteName: site.name,
    title: seoDscHack.title,
    description: seoDscHack.description,
    images: [{ url: `${urlDelSitio}${seoDscHack.ogImagen}`, width: 1200, height: 630, alt: seoDscHack.ogAlt }],
  },
  twitter: {
    card: 'summary_large_image',
    title: seoDscHack.title,
    description: seoDscHack.description,
    images: [`${urlDelSitio}${seoDscHack.ogImagen}`],
  },
}

export default function PaginaDscHack() {
  return (
    <main>
      <HeroDscHack />
      <Proyectos />
      <GaleriaDscHack />
      <AliadoDscHack />
      <CierreDscHack />
    </main>
  )
}
