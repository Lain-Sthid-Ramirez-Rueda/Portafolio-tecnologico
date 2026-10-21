import type { TranslationKey } from '../i18n/translations';

export interface DetailListItem {
  label: string;
  text: string;
}

export type DetailBlock =
  | { type: 'paragraph'; title: string; text: string }
  | { type: 'list'; title: string; items: DetailListItem[] };

export interface DetailLink {
  href: string;
  label: string;
  icon: string;
  variant: 'primary' | 'ghost';
}

export interface Project {
  id: 'congreso' | 'appfocus' | 'proassist' | 'upcoming';
  number: string;
  upcoming?: boolean;
  title: string;
  version?: string;
  descKey: TranslationKey;
  stack: string[];
  githubUrl?: string;
  demoUrl?: string;
  demoTitle?: string;
  detail: {
    title: string;
    blocks: DetailBlock[];
    links: DetailLink[];
  };
}

export const projects: Project[] = [
  {
    id: 'congreso',
    number: '01',
    title: 'Congreso SENA 2026',
    descKey: 'proj.congreso.desc',
    stack: ['React 19', 'TypeScript', 'TanStack Start', 'Tailwind', 'Supabase', 'Vercel'],
    demoUrl: 'https://congreso-sena.vercel.app',
    demoTitle: 'Congreso Virtual de Redes de Conocimiento 2026 — SENA',
    detail: {
      title: 'Congreso Virtual de Redes de Conocimiento 2026 — Sitio Oficial SENA',
      blocks: [
        {
          type: 'paragraph',
          title: 'Resumen del Proyecto',
          text: 'Sitio web oficial del Congreso Virtual de Redes de Conocimiento 2026: Innovación y Transferencia, organizado por el Centro de Mercados, Logística y Tecnologías de la Información del SENA (26, 27 y 28 de octubre de 2026). Es el canal principal de consulta para aprendices, instructores e investigadores: programación, redes de conocimiento, modalidades de participación, ponencias, pósteres y publicaciones.',
        },
        {
          type: 'paragraph',
          title: 'Mi Rol',
          text: 'Fui seleccionado como aprendiz mediante convocatoria y pruebas técnicas para desarrollar el sitio. Estoy a cargo de su desarrollo de principio a fin: levanto los requisitos con el comité organizador, implemento las funcionalidades y aplico los cambios que se solicitan a lo largo de la convocatoria (resultados, pósteres aprobados, programación y salas).',
        },
        {
          type: 'list',
          title: 'Aspectos Técnicos Clave',
          items: [
            {
              label: 'SSR con TanStack Start:',
              text: 'React 19 + TypeScript sobre TanStack Router con renderizado en servidor, desplegado en Vercel.',
            },
            {
              label: 'Votación de Pósteres en Vivo:',
              text: 'Sistema de votación y podio en tiempo real respaldado por Supabase (PostgreSQL).',
            },
            {
              label: 'Identidad Institucional y Accesibilidad:',
              text: 'Manual de marca SENA 2024, alto contraste siguiendo pautas WCAG, menú de accesibilidad, navegación por teclado y versión bilingüe ES/EN.',
            },
            {
              label: 'SEO y Documentos:',
              text: 'Datos estructurados schema.org/Event, Open Graph, sitemap XML y visor PDF integrado para cronograma, ponencias y pósteres.',
            },
          ],
        },
      ],
      links: [
        {
          href: 'https://congreso-sena.vercel.app',
          label: 'Sitio Oficial (Vercel)',
          icon: 'fa-solid fa-arrow-up-right-from-square',
          variant: 'primary',
        },
      ],
    },
  },
  {
    id: 'proassist',
    number: '02',
    title: 'ProAssist',
    descKey: 'proj.proassist.desc',
    stack: ['Python', 'Groq API', 'Docker', 'Render'],
    githubUrl: 'https://github.com/Lain-Sthid-Ramirez-Rueda/proassist',
    demoUrl: 'https://proassist-r1q6.onrender.com',
    demoTitle: 'ProAssist — AI Chatbot',
    detail: {
      title: 'ProAssist — AI Productivity Chatbot',
      blocks: [
        {
          type: 'paragraph',
          title: 'Resumen del Proyecto',
          text: 'ProAssist es un asistente conversacional bilingüe de productividad: responde en el idioma del usuario, da formato Markdown a sus respuestas y permite copiar bloques de código con un clic.',
        },
        {
          type: 'list',
          title: 'Arquitectura Tecnológica',
          items: [
            {
              label: 'Motor de IA:',
              text: 'Modelos de lenguaje open-source servidos por Groq API, de muy baja latencia. El modelo es configurable por variable de entorno.',
            },
            {
              label: 'Backend e Infraestructura:',
              text: 'Python con Flask y Gunicorn multihilo, sesiones aisladas por usuario con expiración automática, contenerizado con Docker y desplegado en Render con endpoint de salud.',
            },
            {
              label: 'Seguridad:',
              text: 'Límite de peticiones por IP, sanitización anti-XSS con DOMPurify, cabeceras HTTP y Content Security Policy, y protección de instrucciones contra inyección de prompts.',
            },
            {
              label: 'Soporte Bilingüe:',
              text: 'Detección y respuesta automática en español e inglés sin pérdida de contexto.',
            },
          ],
        },
      ],
      links: [
        {
          href: 'https://proassist-r1q6.onrender.com',
          label: 'Demo en Vivo (Render)',
          icon: 'fa-solid fa-arrow-up-right-from-square',
          variant: 'primary',
        },
        {
          href: 'https://github.com/Lain-Sthid-Ramirez-Rueda/proassist',
          label: 'Código en GitHub',
          icon: 'fa-brands fa-github',
          variant: 'ghost',
        },
      ],
    },
  },
  {
    id: 'appfocus',
    number: '03',
    title: 'APPFOCUS',
    version: 'CORE v3.0',
    descKey: 'proj.appfocus.desc',
    stack: ['React', 'Tailwind', 'Deep Work', 'Local-First'],
    githubUrl: 'https://github.com/Lain-Sthid-Ramirez-Rueda/APPFOCUS',
    detail: {
      title: 'APPFOCUS CORE v3.0 — Deep Work Terminal',
      blocks: [
        {
          type: 'paragraph',
          title: 'Resumen del Proyecto',
          text: 'APPFOCUS es una aplicación de productividad basada en la metodología Deep Work de Cal Newport. Organiza el día en bloques de trabajo con una interfaz sin distracciones para sostener sesiones de concentración.',
        },
        {
          type: 'list',
          title: 'Aspectos Técnicos Clave',
          items: [
            {
              label: 'Datos Locales y Privados:',
              text: 'Sin servidor, cuentas ni rastreadores: los bloques se guardan en el navegador (localStorage) y nunca salen del dispositivo.',
            },
            {
              label: 'Índice de Eficiencia Diaria:',
              text: 'Calcula en tiempo real el porcentaje de bloques completados, con categorías Deep Work, Hábito, Aprendizaje y Operativo, y búsqueda instantánea.',
            },
            {
              label: 'Arquitectura Modular:',
              text: 'Refactorizado de un único archivo a componentes React separados, con Tailwind CSS y JSX compilado en el navegador sin bundler.',
            },
          ],
        },
      ],
      links: [
        {
          href: 'https://github.com/Lain-Sthid-Ramirez-Rueda/APPFOCUS',
          label: 'Repositorio GitHub',
          icon: 'fa-brands fa-github',
          variant: 'primary',
        },
      ],
    },
  },
  {
    id: 'upcoming',
    number: '04',
    upcoming: true,
    title: '',
    descKey: 'proj.upcoming.desc',
    stack: [],
    detail: {
      title: 'Próximo Proyecto — Sandbox de Subagentes de IA',
      blocks: [
        {
          type: 'paragraph',
          title: 'En Desarrollo',
          text: 'Estoy explorando la orquestación de agentes de IA en Python para apoyar la elicitación de requisitos, el análisis de datos y la generación de documentación técnica.',
        },
      ],
      links: [
        {
          href: 'https://github.com/Lain-Sthid-Ramirez-Rueda',
          label: 'Perfil de GitHub',
          icon: 'fa-brands fa-github',
          variant: 'primary',
        },
      ],
    },
  },
];
