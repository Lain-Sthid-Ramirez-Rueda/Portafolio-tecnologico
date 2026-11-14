import type { TranslationKey } from '../i18n/translations';

export interface Certification {
  id: string;
  icon: string;
  iconBg: 'cert-fullstack' | 'cert-frontend' | 'cert-ai';
  typeKey: TranslationKey;
  badgeVariant: 'diploma' | 'cert';
  titleKey: TranslationKey;
  issuerKey: TranslationKey;
  pdfUrl: string | null;
}

export const certifications: Certification[] = [
  {
    id: 'fullstack',
    icon: 'fa-solid fa-layer-group',
    iconBg: 'cert-fullstack',
    typeKey: 'about.cert3_type',
    badgeVariant: 'diploma',
    titleKey: 'about.cert3_title',
    issuerKey: 'about.cert3_issuer',
    pdfUrl: '/assets/docs/Diplomado Fundamentos de Full Stack.pdf',
  },
  {
    id: 'frontend',
    icon: 'fa-solid fa-code',
    iconBg: 'cert-frontend',
    typeKey: 'about.cert1_type',
    badgeVariant: 'cert',
    titleKey: 'about.cert1_title',
    issuerKey: 'about.cert1_issuer',
    pdfUrl: null,
  },
  {
    id: 'ai',
    icon: 'fa-solid fa-robot',
    iconBg: 'cert-ai',
    typeKey: 'about.cert2_type',
    badgeVariant: 'cert',
    titleKey: 'about.cert2_title',
    issuerKey: 'about.cert2_issuer',
    pdfUrl: null,
  },
  {
    id: 'microsoft-ai',
    icon: 'fa-solid fa-brain',
    iconBg: 'cert-ai',
    typeKey: 'about.cert4_type',
    badgeVariant: 'cert',
    titleKey: 'about.cert4_title',
    issuerKey: 'about.cert4_issuer',
    pdfUrl: null,
  },
];
