import { useLang } from '../../i18n/LangContext';
import { TransBreak } from '../../i18n/TransBreak';
import { useHeroCanvas } from '../../hooks/useHeroCanvas';
import { useCounterAnim } from '../../hooks/useCounterAnim';
import { useDialogs } from '../../contexts/DialogsContext';

function ProjectsStat() {
  const { ref, display } = useCounterAnim<HTMLSpanElement>(2, '+');
  const { t } = useLang();
  return (
    <div className="stat">
      <span className="stat-number" ref={ref} data-counter="2">
        {display}
      </span>
      <span className="stat-label">{t('hero.stat_projects')}</span>
    </div>
  );
}

export function Hero() {
  const { t } = useLang();
  const { heroRef, canvasRef } = useHeroCanvas();
  const { openCv, openTerminal, state } = useDialogs();

  return (
    <section className="hero" id="hero" aria-label="Sección principal" ref={heroRef}>
      <canvas
        ref={canvasRef}
        className="hero-canvas-bg"
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
      />
      <div className="hero-bg-grid" aria-hidden="true" />
      <div className="hero-orb orb-1" aria-hidden="true" />
      <div className="hero-orb orb-2" aria-hidden="true" />
      <div className="hero-orb orb-3" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-text">
          <div className="hero-eyebrow" aria-hidden="true">
            <span className="eyebrow-dot" />
            <span>{t('hero.available')}</span>
          </div>

          <h1 className="hero-title">
            <span className="title-name">
              Lain Sthid
              <br />
              Ramirez Rueda
            </span>
            <span className="hero-role">
              <TransBreak text={t('hero.role')} />
            </span>
          </h1>

          <p className="hero-subtitle">{t('hero.subtitle')}</p>

          <div className="hero-cta-group">
            <a href="#projects" className="btn btn-primary">
              <span>{t('hero.cta_primary')}</span>
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </a>
            <a href="#contact" className="btn btn-ghost">
              <span>{t('hero.cta_secondary')}</span>
            </a>
            <button
              id="btn-download-cv"
              className="btn btn-ghost"
              aria-haspopup="dialog"
              aria-expanded={state.name === 'cv'}
              onClick={openCv}
            >
              <i className="fa-solid fa-file-arrow-down" aria-hidden="true" />
              <span>{t('hero.download_cv')}</span>
            </button>
            <button
              id="btn-open-terminal"
              className="btn btn-ghost"
              aria-haspopup="dialog"
              aria-expanded={state.name === 'terminal'}
              onClick={openTerminal}
            >
              <i className="fa-solid fa-terminal" aria-hidden="true" />
              <span>{t('hero.open_terminal')}</span>
            </button>
          </div>

          <div className="hero-socials" role="group" aria-label="Redes sociales">
            <a
              href="https://github.com/Lain-Sthid-Ramirez-Rueda"
              target="_blank"
              rel="noopener noreferrer"
              className="social-chip"
              aria-label="Perfil de GitHub"
            >
              <i className="fa-brands fa-github" aria-hidden="true" />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/lain-sthid-ramirez-rueda"
              target="_blank"
              rel="noopener noreferrer"
              className="social-chip"
              aria-label="Perfil de LinkedIn"
            >
              <i className="fa-brands fa-linkedin" aria-hidden="true" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://wa.me/573209735859"
              target="_blank"
              rel="noopener noreferrer"
              className="social-chip"
              aria-label="Contactar por WhatsApp"
            >
              <i className="fa-brands fa-whatsapp" aria-hidden="true" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="profile-card" id="profile-card">
            <div className="profile-card-inner">
              <div className="profile-avatar-wrap">
                <div className="profile-avatar">
                  <picture>
                    <source srcSet="/assets/img/profile.avif" type="image/avif" />
                    <source srcSet="/assets/img/profile.webp" type="image/webp" />
                    <img
                      src="/assets/img/profile.png"
                      alt="Foto de perfil de Lain Sthid Ramirez Rueda"
                      className="profile-img"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      width={400}
                      height={400}
                    />
                  </picture>
                </div>
                <div className="avatar-badge" aria-hidden="true">
                  <i className="fa-solid fa-code" />
                </div>
              </div>
              <div className="profile-card-info">
                <p className="profile-name">Lain Sthid Ramirez Rueda</p>
                <p className="profile-title">{t('hero.role_short')}</p>
              </div>
              <div className="profile-card-stats">
                <ProjectsStat />
                <div className="stat-divider" aria-hidden="true" />
                <div className="stat">
                  <span className="stat-number">AI</span>
                  <span className="stat-label">{t('hero.stat_ai')}</span>
                </div>
                <div className="stat-divider" aria-hidden="true" />
                <div className="stat">
                  <span className="stat-number">UX</span>
                  <span className="stat-label">Focused</span>
                </div>
              </div>
            </div>
            <div className="float-chip chip-python" aria-hidden="true">
              <i className="fa-brands fa-python" /> Python
            </div>
            <div className="float-chip chip-elicit" aria-hidden="true">
              <i className="fa-solid fa-magnifying-glass-chart" /> Elicitación
            </div>
            <div className="float-chip chip-git" aria-hidden="true">
              <i className="fa-brands fa-git-alt" /> Git
            </div>
            <div className="float-chip chip-adapt" aria-hidden="true">
              <i className="fa-solid fa-shuffle" /> Adaptabilidad
            </div>
          </div>
        </div>
      </div>

      <a href="#about" className="scroll-indicator" aria-label={`${t('hero.scroll')} — ${t('aria.scroll_to_about')}`}>
        <span className="scroll-line" aria-hidden="true" />
        <span className="scroll-text">{t('hero.scroll')}</span>
      </a>
    </section>
  );
}
