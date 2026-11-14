import { useLang } from '../../i18n/LangContext';
import { TransBreak } from '../../i18n/TransBreak';
import { useReveal } from '../../hooks/useReveal';
import { useDialogs } from '../../contexts/DialogsContext';
import { certifications } from '../../data/certifications';

export function About() {
  const { t } = useLang();
  const { ref: textRef, visible: textVisible } = useReveal<HTMLDivElement>();
  const { ref: asideRef, visible: asideVisible } = useReveal<HTMLDivElement>();
  const { openCert } = useDialogs();

  return (
    <section className="about section" id="about" aria-labelledby="about-title">
      <div className="container">
        <div className="section-label" aria-hidden="true">
          <span className="label-line" />
          <span>{t('about.label')}</span>
        </div>
        <div className="about-grid">
          <div className={`about-text reveal${textVisible ? ' visible' : ''}`} ref={textRef}>
            <h2 id="about-title" className="section-title">
              <TransBreak text={t('about.title')} />
            </h2>
            <p className="about-desc">{t('about.p1')}</p>
            <p className="about-desc">{t('about.p2')}</p>
            <p className="about-desc">{t('about.p3')}</p>
            <p className="about-desc">{t('about.p4')}</p>
            <div className="about-tags" role="group" aria-label="Etiquetas clave">
              <span className="tag">{t('about.tag1')}</span>
              <span className="tag">{t('about.tag2')}</span>
              <span className="tag" style={{ whiteSpace: 'nowrap' }}>
                {t('about.tag3')}
              </span>
              <span className="tag">{t('about.tag4')}</span>
              <span className="tag">{t('about.tag5')}</span>
              <span className="tag">{t('about.tag6')}</span>
            </div>
          </div>

          <div className={`about-aside reveal reveal-delay${asideVisible ? ' visible' : ''}`} ref={asideRef}>
            <div className="about-card">
              <div className="about-card-icon" aria-hidden="true">
                <i className="fa-solid fa-graduation-cap" />
              </div>
              <h3>{t('about.edu_title')}</h3>
              <p>{t('about.edu_desc')}</p>
              <span className="about-card-badge">{t('about.edu_status')}</span>
            </div>

            <div className="about-card cert-section-card">
              <div className="about-card-icon" aria-hidden="true">
                <i className="fa-solid fa-award" />
              </div>
              <h3>{t('about.cert_title')}</h3>

              <div className="cert-list-new">
                {certifications.map((cert) => (
                  <div className="cert-item-card" role="group" aria-label={t(cert.titleKey)} key={cert.id}>
                    <div className="cert-item-icon-zone">
                      <div className={`cert-icon-bg ${cert.iconBg}`}>
                        <i className={cert.icon} />
                      </div>
                    </div>
                    <div className="cert-item-info">
                      <span className={`cert-badge cert-badge-${cert.badgeVariant}`}>{t(cert.typeKey)}</span>
                      <h4 className="cert-item-title">{t(cert.titleKey)}</h4>
                      <p className="cert-item-issuer">
                        <span>{t(cert.issuerKey)}</span>
                      </p>
                    </div>
                    <button
                      className="btn-view-cert"
                      aria-label={`Ver certificado de ${t(cert.titleKey)}`}
                      onClick={() =>
                        openCert({ url: cert.pdfUrl, title: `${t(cert.typeKey)} — ${t(cert.titleKey)}`, issuer: t(cert.issuerKey) })
                      }
                    >
                      <i className="fa-solid fa-eye" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="about-card">
              <div className="about-card-icon" aria-hidden="true">
                <i className="fa-solid fa-language" />
              </div>
              <h3>{t('about.lang_title')}</h3>
              <p>{t('about.lang_desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
