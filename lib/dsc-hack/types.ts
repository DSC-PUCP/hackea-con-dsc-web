/** Campos públicos del recap; las evidencias de curación permanecen en internals/. */
export type FotoRecap = {
  tipo: 'foto'
  src: string
  alt: string
  width: number
  height: number
  encuadre?: string
  pie?: string
}

export type VideoRecap = {
  tipo: 'video'
  src: string
  portada: FotoRecap
  descripcion: string
  /** Una pista de subtítulos permite incorporar entrevistas sin rehacer la ficha. */
  subtitulos?: string
}

export type MedioRecap = FotoRecap | VideoRecap

export type IntegranteRecap = {
  nombre: string
  linkedin: string | null
}

export type EnlaceProyecto = {
  tipo: 'demo' | 'repositorio' | 'presentacion' | 'video'
  url: string
}

export type ProyectoRecap = {
  id: string
  nombre: string
  equipo: string
  descripcion: string
  premio: 'primero' | 'segundo' | 'chaotic-good' | null
  integrantes: IntegranteRecap[]
  enlaces: EnlaceProyecto[]
  /** Sin medios, la ficha conserva su composición completa de texto. */
  medios?: MedioRecap[]
}
