import type { TranslationKey } from '../i18n/translations';

export type SkillFilter = 'all' | 'frontend' | 'backend' | 'ai' | 'tools' | 'soft';

export interface SkillBarItem {
  icon: string;
  name: string;
  pct: number;
}

export interface SkillCategory {
  category: Exclude<SkillFilter, 'all' | 'soft'>;
  titleKey: TranslationKey;
  bars?: SkillBarItem[];
  pills?: { icon: string; label: string }[];
}

export const skillCategories: SkillCategory[] = [
  {
    category: 'frontend',
    titleKey: 'skills.cat1',
    bars: [
      { icon: 'fa-brands fa-html5', name: 'HTML Living Standard', pct: 90 },
      { icon: 'fa-brands fa-css3-alt', name: 'CSS (Material Design 3)', pct: 85 },
      { icon: 'fa-brands fa-js', name: 'JavaScript', pct: 75 },
    ],
  },
  {
    category: 'backend',
    titleKey: 'skills.cat2',
    bars: [
      { icon: 'fa-brands fa-python', name: 'Python', pct: 82 },
      { icon: 'fa-brands fa-git-alt', name: 'Git / GitHub', pct: 82 },
    ],
  },
  {
    category: 'ai',
    titleKey: 'skills.cat3',
    pills: [
      { icon: 'fa-solid fa-robot', label: 'Subagentes de IA' },
      { icon: 'fa-solid fa-wand-magic-sparkles', label: 'Prompt Engineering' },
      { icon: 'fa-solid fa-brain', label: 'Claude AI' },
      { icon: 'fa-solid fa-bolt', label: 'Groq API' },
      { icon: 'fa-solid fa-gem', label: 'Gemini' },
      { icon: 'fa-solid fa-gears', label: 'Automatización' },
      { icon: 'fa-solid fa-chart-line', label: 'NumPy / Pandas' },
      { icon: 'fa-solid fa-database', label: 'Data Analysis' },
    ],
  },
  {
    category: 'tools',
    titleKey: 'skills.cat4',
    pills: [
      { icon: 'fa-solid fa-code', label: 'Visual Studio Code' },
      { icon: 'fa-brands fa-github', label: 'GitHub' },
      { icon: 'fa-solid fa-cloud', label: 'Google Cloud Shell' },
      { icon: 'fa-solid fa-puzzle-piece', label: 'Elicitación de Requisitos' },
      { icon: 'fa-solid fa-diagram-project', label: 'Arquitectura de Sistemas' },
      { icon: 'fa-solid fa-layer-group', label: 'Tailwind CSS' },
    ],
  },
];

export const softSkills: { icon: string; key: TranslationKey }[] = [
  { icon: 'fa-solid fa-magnifying-glass-chart', key: 'soft.1' },
  { icon: 'fa-solid fa-lightbulb', key: 'soft.2' },
  { icon: 'fa-solid fa-bolt', key: 'soft.3' },
  { icon: 'fa-solid fa-users', key: 'soft.4' },
  { icon: 'fa-solid fa-shuffle', key: 'soft.5' },
  { icon: 'fa-solid fa-pen-nib', key: 'soft.6' },
  { icon: 'fa-solid fa-eye', key: 'soft.7' },
  { icon: 'fa-solid fa-comments', key: 'soft.8' },
];

export const skillFilters: { filter: SkillFilter; labelKey: TranslationKey }[] = [
  { filter: 'all', labelKey: 'skills.filter_all' },
  { filter: 'frontend', labelKey: 'skills.filter_frontend' },
  { filter: 'backend', labelKey: 'skills.filter_backend' },
  { filter: 'ai', labelKey: 'skills.filter_ai' },
  { filter: 'tools', labelKey: 'skills.filter_tools' },
  { filter: 'soft', labelKey: 'skills.filter_soft' },
];
