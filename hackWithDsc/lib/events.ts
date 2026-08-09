export type BrandColor = "blue" | "red" | "yellow" | "green"

export type Talk = {
  id: string
  title: string
  speaker: string
  role: string
  type: "Charla" | "Taller" | "Panel" | "Keynote"
  date: string
  time: string
  room: string
  description: string
  color: BrandColor
  tags: string[]
}

export const program = {
  name: "Hack with DSC",
  tagline: "Proyecto de charlas y talleres",
  edition: "Edición 2026",
  dateRange: "20 de agosto, 2026",
  venue: {
    name: "Por confirmar...",
    address: "",
    
    //mapEmbed:
      //"https://www.google.com/maps?q=Ciudad+Universitaria&output=embed",
  },
}

export const talks: Talk[] = [
  {
    id: "ai-workshop",
    title: "¿Cómo codear en 2026? Para principiantes",
    speaker: "",
    role: "",
    type: "Taller",
    date: "Jue 20 agost",
    time: "12:00pm – 2:00pm",
    room: "Por confirmar...",
    description:
      "Uso de agentes de terminal, Spec Driven Development básico, dirigir agentes de IA. Uso de capas gratuitas",
    color: "blue",
    tags: ["IA", "Intro","Carrera"],
  },/*
  {
    id: "web-modern",
    title: "Web moderna con Next.js y React",
    speaker: "Diego Ramírez",
    role: "Frontend Engineer",
    type: "Charla",
    date: "Jue 12 mar",
    time: "18:00 – 19:00",
    room: "Sala A",
    description:
      "Un recorrido práctico por el App Router, Server Components y cómo desplegar tu primera app a producción en minutos.",
    color: "red",
    tags: ["Frontend", "Next.js"],
  },
  {
    id: "ai-workshop",
    title: "Taller: Tu primera app con IA",
    speaker: "Lucía Torres",
    role: "ML Engineer",
    type: "Taller",
    date: "Vie 13 mar",
    time: "10:00 – 12:00",
    room: "Lab 3",
    description:
      "Manos a la obra: integramos modelos de lenguaje en una aplicación real usando el AI SDK, prompts y streaming de respuestas.",
    color: "green",
    tags: ["IA", "Hands-on"],
  },
  {
    id: "cloud",
    title: "Del código a la nube",
    speaker: "Andrés Gómez",
    role: "Cloud Architect",
    type: "Charla",
    date: "Vie 13 mar",
    time: "13:00 – 14:00",
    room: "Sala A",
    description:
      "Cómo pasar de un proyecto local a una arquitectura escalable: bases de datos, funciones serverless y buenas prácticas de despliegue.",
    color: "yellow",
    tags: ["Cloud", "Backend"],
  },
  {
    id: "career",
    title: "Panel: Mi primer trabajo en tech",
    speaker: "Egresados DSC",
    role: "Panel de invitados",
    type: "Panel",
    date: "Vie 13 mar",
    time: "17:00 – 18:00",
    room: "Auditorio Principal",
    description:
      "Ex miembros del club comparten cómo consiguieron sus primeras oportunidades, qué aprendieron y consejos para tu portafolio.",
    color: "blue",
    tags: ["Carrera", "Panel"],
  },
  {
    id: "demo-day",
    title: "Demo Day y premiación",
    speaker: "Equipo organizador",
    role: "Hack with DSC",
    type: "Keynote",
    date: "Sáb 14 mar",
    time: "16:00 – 18:00",
    room: "Auditorio Principal",
    description:
      "Los equipos presentan lo que construyeron durante el programa y cerramos con la premiación de los mejores proyectos.",
    color: "green",
    tags: ["Cierre", "Proyectos"],
  },*/
]
