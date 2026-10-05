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
          text: 'Sitio web oficial del Congreso Virtual de Redes de Conocimiento 2026: Innovación y Transferencia, organizado por el Centro de Gestión de Mercados, Logística y TIC del SENA (26, 27 y 28 de octubre de 2026). Es el canal principal de consulta para aprendices, instructores e investigadores: programación, redes de conocimiento, modalidades de participación, ponencias, pósteres y publicaciones.',
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
              text: 'Manual de marca SENA 2024, contraste WCAG AAA, menú de accesibilidad, navegación por teclado y bilingüe ES/EN.',
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
          text: 'ProAssist es un asistente conversacional bilingüe diseñado para responder consultas complejas, automatizar tareas y actuar como un compañero inteligente de desarrollo en tiempo real.',
        },
        {
          type: 'list',
          title: 'Arquitectura Tecnológica',
          items: [
            {
              label: 'Motor de IA:',
              text: 'Impulsado por LLaMA 3.3-70B ejecutado sobre Groq LPU (Language Processing Unit) API, alcanzando velocidades de generación superiores a 300 tokens/segundo.',
            },
            {
              label: 'Infraestructura:',
              text: 'Aplicación Python contenerizada en un contenedor Docker optimizado y desplegada en Render.',
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
    stack: ['JavaScript', 'Tailwind', 'Deep Work', 'Offline-First'],
    githubUrl: 'https://github.com/Lain-Sthid-Ramirez-Rueda/APPFOCUS',
    detail: {
      title: 'APPFOCUS CORE v3.0 — Deep Work Terminal',
      blocks: [
        {
          type: 'paragraph',
          title: 'Resumen del Proyecto',
          text: 'APPFOCUS es una terminal de productividad de alto rendimiento concebida bajo los principios de la metodología Deep Work de Cal Newport. Su propósito es eliminar fricciones cognitivas durante sesiones de trabajo concentrado.',
        },
        {
          type: 'list',
          title: 'Aspectos Técnicos Clave',
          items: [
            {
              label: 'Arquitectura 100% Offline-First:',
              text: 'Sin dependencias de red externas ni rastreadores. Todos los datos permanecen locales.',
            },
            {
              label: 'Algoritmo de Foco Dinámico:',
              text: 'Ajuste automático de bloques de trabajo e intervalos de descanso según ritmo circadiano.',
            },
            {
              label: 'Estética Minimalista:',
              text: 'UI construida con Tailwind CSS y Vanilla JavaScript altamente optimizado.',
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
          text: 'Actualmente me encuentro construyendo un ecosistema de subagentes autónomos de IA integrados con canal de orquestación en Python. Este proyecto busca automatizar flujos complejos de elicitar requisitos, análisis de datos y generación de documentación técnica.',
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
