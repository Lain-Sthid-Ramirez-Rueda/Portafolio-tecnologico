import type { MouseEvent } from 'react';
import { useLang } from '../../i18n/LangContext';
import { TransBreak } from '../../i18n/TransBreak';
import { useReveal } from '../../hooks/useReveal';
import { useClipboardCopy } from '../../hooks/useClipboardCopy';

const EMAIL = 'lainramirez18@gmail.com';
const EMAIL_SUBJECT = 'Contacto desde tu portafolio';
const EMAIL_BODY = 'Hola Lain, buen día.\n\n';
const MAILTO_URL = `mailto:${EMAIL}?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`;
const GMAIL_COMPOSE_URL =
  `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}` +
  `&su=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`;

/** `mailto:` silently does nothing on desktops with no mail app configured (most people use
 *  webmail), so on mouse/trackpad devices open Gmail's compose window pre-filled instead.
 *  Touch devices keep `mailto:`, which reliably opens the phone's mail app. */
function openEmailComposer(e: MouseEvent<HTMLAnchorElement>) {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  e.preventDefault();
  window.open(GMAIL_COMPOSE_URL, '_blank', 'noopener,noreferrer');
}

export function Contact() {
  const { t } = useLang();
  const { ref: textRef, visible: textVisible } = useReveal<HTMLDivElement>();
  const { ref: orbitRef, visible: orbitVisible } = useReveal<HTMLDivElement>();
  const copy = useClipboardCopy();

  return (
    <section className="contact section" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <div className="section-label" aria-hidden="true">
          <span className="label-line" />
          <span>{t('contact.label')}</span>
        </div>
        <div className="contact-grid">
          <div className={`contact-text reveal${textVisible ? ' visible' : ''}`} ref={textRef}>
            <h2 id="contact-title" className="section-title">
              <TransBreak text={t('contact.title')} />
            </h2>
            <p className="contact-desc">{t('contact.desc')}</p>

            <div className="contact-links-grid" role="group" aria-label="Canales de contacto">
              <div className="contact-link-card" id="clc-whatsapp">
                <div className="clc-icon clc-icon--wa">
                  <i className="fa-brands fa-whatsapp" aria-hidden="true" />
                </div>
                <a
                  href="https://wa.me/573209735859?text=Hola%20Lain,%20buen%20día"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="clc-body"
                  aria-label="Contactar por WhatsApp"
                >
                  <span className="clc-label">WhatsApp</span>
                  <span className="clc-sub">Respuesta rápida (+57 3209735859)</span>
                </a>
                <button
                  className="clc-copy-btn"
                  aria-label={t('aria.copy_phone')}
                  title="Copiar teléfono"
                  onClick={() => copy('+573209735859')}
                >
                  <i className="fa-regular fa-copy" aria-hidden="true" />
                </button>
              </div>

              <div className="contact-link-card" id="clc-email">
                <div className="clc-icon clc-icon--email">
                  <i className="fa-solid fa-envelope" aria-hidden="true" />
                </div>
                <a href={MAILTO_URL} className="clc-body" aria-label="Enviar email" onClick={openEmailComposer}>
                  <span className="clc-label">Email</span>
                  <span className="clc-sub">{EMAIL}</span>
                </a>
                <button
                  className="clc-copy-btn"
                  aria-label={t('aria.copy_email')}
                  title="Copiar correo"
                  onClick={() => copy(EMAIL)}
                >
                  <i className="fa-regular fa-copy" aria-hidden="true" />
                </button>
              </div>

              <div className="contact-link-card" id="clc-linkedin">
                <div className="clc-icon clc-icon--li">
                  <i className="fa-brands fa-linkedin" aria-hidden="true" />
                </div>
                <a
                  href="https://www.linkedin.com/in/lain-sthid-ramirez-rueda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="clc-body"
                  aria-label="Ver perfil de LinkedIn"
                >
                  <span className="clc-label">LinkedIn</span>
                  <span className="clc-sub">lain-sthid-ramirez-rueda</span>
                </a>
                <i className="fa-solid fa-arrow-up-right-from-square clc-arrow" aria-hidden="true" />
              </div>

              <div className="contact-link-card" id="clc-github">
                <div className="clc-icon clc-icon--gh">
                  <i className="fa-brands fa-github" aria-hidden="true" />
                </div>
                <a
                  href="https://github.com/Lain-Sthid-Ramirez-Rueda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="clc-body"
                  aria-label="Ver perfil de GitHub"
                >
                  <span className="clc-label">GitHub</span>
                  <span className="clc-sub">Lain-Sthid-Ramirez-Rueda</span>
                </a>
                <i className="fa-solid fa-arrow-up-right-from-square clc-arrow" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div
            className={`orbit-container reveal reveal-delay${orbitVisible ? ' visible' : ''}`}
            aria-label="Gráfico de tecnologías en órbita 3D"
            ref={orbitRef}
          >
            <div className="orbit-center">
              <span className="orbit-logo">LR</span>
            </div>

            <div className="orbit orbit-1" aria-hidden="true">
              <div className="orbit-node n-1">
                <i className="fa-brands fa-js" />
              </div>
              <div className="orbit-node n-2">
                <i className="fa-brands fa-python" />
              </div>
            </div>

            <div className="orbit orbit-2" aria-hidden="true">
              <div className="orbit-node n-3">
                <i className="fa-solid fa-brain" />
              </div>
              <div className="orbit-node n-4">
                <i className="fa-brands fa-react" />
              </div>
              <div className="orbit-node n-5">
                <i className="fa-brands fa-node-js" />
              </div>
            </div>

            <div className="orbit orbit-3" aria-hidden="true">
              <div className="orbit-node n-6">
                <i className="fa-solid fa-database" />
              </div>
              <div className="orbit-node n-7">
                <i className="fa-brands fa-git-alt" />
              </div>
              <div className="orbit-node n-8">
                <i className="fa-brands fa-aws" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
