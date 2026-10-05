import { useEffect, useRef, useState } from 'react';
import { useLang } from '../../i18n/LangContext';
import { useReveal } from '../../hooks/useReveal';
import { useDialogs } from '../../contexts/DialogsContext';
import { projects } from '../../data/projects';

function ProjectDemoEmbed({ project }: { project: (typeof projects)[number] }) {
  const { t } = useLang();
  const { openDemo } = useDialogs();
  const [shouldLoad, setShouldLoad] = useState(() => typeof IntersectionObserver === 'undefined');
  const [loaded, setLoaded] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const frameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = frameRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hostname = project.demoUrl ? new URL(project.demoUrl).hostname : '';

  return (
    <div className="project-preview-frame" ref={frameRef} style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="demo-embed-titlebar">
        <div className="demo-browser-controls" aria-hidden="true">
          <span className="demo-dot demo-dot--red" />
          <span className="demo-dot demo-dot--yellow" />
          <span className="demo-dot demo-dot--green" />
        </div>
        <div className="demo-embed-url" title={project.demoUrl}>
          <i className="fa-solid fa-lock" aria-hidden="true" />
          <span>{hostname}</span>
        </div>
        <div className="demo-embed-actions">
          <span className="demo-live-badge" aria-label="Demo activa en vivo">
            <span className="demo-live-dot" aria-hidden="true" />
            <span className="demo-live-text">{t('demo.live_status')}</span>
          </span>
          <button
            type="button"
            className="demo-embed-btn"
            aria-label={`${t('demo.reload')}: ${project.title}`}
            title={t('demo.reload')}
            onClick={() => {
              setLoaded(false);
              setReloadKey((k) => k + 1);
            }}
          >
            <i className="fa-solid fa-rotate-right" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="demo-embed-btn"
            aria-label={`${t('demo.fullscreen')}: ${project.title}`}
            title={t('demo.fullscreen')}
            onClick={() => {
              const url = project.demoUrl!;
              if (window.innerWidth < 520) {
                window.open(url, '_blank', 'noopener,noreferrer');
                return;
              }
              openDemo({ url, title: project.demoTitle ?? project.title });
            }}
          >
            <i className="fa-solid fa-expand" aria-hidden="true" />
          </button>
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="demo-embed-btn"
            aria-label={`${t('demo.open_external')}: ${project.title}`}
            title={t('demo.open_external')}
          >
            <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="demo-embed-viewport" style={{ position: 'relative' }}>
        {!loaded && (
          <div className="demo-embed-loading" id={`demo-loading-${project.id}`}>
            <div className="demo-loader-ring demo-loader-ring--sm" aria-hidden="true" />
            <span className="demo-embed-loading-text">
              {project.id === 'proassist' ? t('demo.starting_cloud') : t('demo.loading_generic')}
            </span>
            {project.id === 'proassist' && (
              <span className="demo-embed-loading-sub">{t('demo.loading_sub')}</span>
            )}
          </div>
        )}

        {shouldLoad && (
          <iframe
            key={reloadKey}
            className="demo-embed-iframe"
            title={`Demo interactiva en vivo: ${project.title}`}
            src={project.demoUrl}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            allow="microphone"
            style={{ opacity: loaded ? 0.75 : 0 }}
            onLoad={() => setLoaded(true)}
          />
        )}

        {/* Glassmorphic overlay with CTA to open demo */}
        <div className="demo-blur-overlay">
          <div className="demo-blur-card">
            <button
              type="button"
              className="btn-demo-open-here"
              aria-label={`${t('demo.view_here_hint')}: ${project.title}`}
              onClick={() => {
                const url = project.demoUrl!;
                if (window.innerWidth < 520) {
                  window.open(url, '_blank', 'noopener,noreferrer');
                  return;
                }
                openDemo({ url, title: project.demoTitle ?? project.title });
              }}
            >
              <i className="fa-solid fa-play" aria-hidden="true" />
              <span>{t('demo.view_here')}</span>
            </button>
            <span className="demo-blur-hint">{t('demo.view_here_hint')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppFocusBlurPreview({ project }: { project: (typeof projects)[number] }) {
  const { t } = useLang();
  const { openProject } = useDialogs();

  return (
    <div className="project-preview-frame" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Browser titlebar */}
      <div className="demo-embed-titlebar">
        <div className="demo-browser-controls" aria-hidden="true">
          <span className="demo-dot demo-dot--red" />
          <span className="demo-dot demo-dot--yellow" />
          <span className="demo-dot demo-dot--green" />
        </div>
        <div className="demo-embed-url" title="APPFOCUS CORE v3.0 — 100% OFFLINE">
          <i className="fa-solid fa-terminal" aria-hidden="true" />
          <span>appfocus-core-v3.0.sh</span>
        </div>
        <div className="demo-embed-actions">
          <span className="demo-tag-offline">100% OFFLINE</span>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="demo-embed-btn"
              aria-label={`Ver ${project.title} en GitHub`}
              title="Ver en GitHub"
            >
              <i className="fa-brands fa-github" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      {/* Blurred skeleton — terminal-style mock */}
      <div className="demo-embed-viewport" style={{ position: 'relative' }}>
        <div className="demo-mock-preview">
          <div className="demo-mock-header">
            <div className="demo-mock-pill demo-mock-pill--primary" />
            <div className="demo-mock-pill" />
          </div>
          <div className="demo-mock-lines">
            <div className="demo-mock-line demo-mock-line--accent" />
            <div className="demo-mock-line" />
            <div className="demo-mock-line" />
            <div className="demo-mock-line demo-mock-line--short" />
            <div className="demo-mock-line demo-mock-line--accent" />
            <div className="demo-mock-line" />
            <div className="demo-mock-line demo-mock-line--short" />
          </div>
          <div className="demo-mock-grid">
            <div className="demo-mock-box" />
            <div className="demo-mock-box" />
          </div>
        </div>

        {/* Glassmorphic overlay with CTA */}
        <div className="demo-blur-overlay">
          <div className="demo-blur-card">
            <button
              type="button"
              className="btn-demo-open-here"
              aria-label={`${t('demo.view_here_hint')}: ${project.title}`}
              onClick={() => openProject(project.id)}
            >
              <i className="fa-solid fa-eye" aria-hidden="true" />
              {t('demo.view_here')}
            </button>
            <span className="demo-blur-hint">{t('demo.view_here_hint')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function UpcomingBlurPreview() {
  const { t } = useLang();
  const { openProject } = useDialogs();

  return (
    <div className="project-preview-frame project-preview-frame--upcoming" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Browser titlebar */}
      <div className="demo-embed-titlebar">
        <div className="demo-browser-controls" aria-hidden="true">
          <span className="demo-dot demo-dot--red" />
          <span className="demo-dot demo-dot--yellow" />
          <span className="demo-dot demo-dot--green" />
        </div>
        <div className="demo-embed-url" title="Orquestador de Subagentes IA">
          <i className="fa-solid fa-microchip" aria-hidden="true" />
          <span>orchestrator.sandbox.py</span>
        </div>
        <div className="demo-embed-actions">
          <span className="upcoming-badge">{t('proj.upcoming_badge')}</span>
        </div>
      </div>

      {/* Blurred skeleton — chat/AI mock */}
      <div className="demo-embed-viewport" style={{ position: 'relative' }}>
        <div className="demo-mock-preview">
          <div className="demo-mock-header">
            <div className="demo-mock-pill demo-mock-pill--sec" />
            <div className="demo-mock-pill" />
          </div>
          <div className="demo-mock-chat">
            <div className="demo-mock-bubble demo-mock-bubble--user" />
            <div className="demo-mock-bubble demo-mock-bubble--bot" />
            <div className="demo-mock-bubble demo-mock-bubble--user" />
            <div className="demo-mock-bubble demo-mock-bubble--bot" />
          </div>
          <div className="demo-mock-lines" style={{ marginTop: '0.5rem' }}>
            <div className="demo-mock-line demo-mock-line--accent" />
            <div className="demo-mock-line demo-mock-line--short" />
          </div>
        </div>

        {/* Glassmorphic overlay with CTA */}
        <div className="demo-blur-overlay">
          <div className="demo-blur-card">
            <button
              type="button"
              className="btn-demo-open-here"
              aria-label={`${t('demo.view_here_hint')}: Orquestador IA`}
              onClick={() => openProject('upcoming')}
            >
              <i className="fa-solid fa-eye" aria-hidden="true" />
              {t('demo.view_here')}
            </button>
            <span className="demo-blur-hint">{t('demo.view_here_hint')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, delay }: { project: (typeof projects)[number]; delay: boolean }) {
  const { t } = useLang();
  const { ref: revealRef, visible: revealVisible } = useReveal<HTMLElement>();
  const { openProject, openDemo } = useDialogs();

  if (project.upcoming) {
    return (
      <article
        className={`project-card project-card--upcoming reveal${revealVisible ? ' visible' : ''}`}
        aria-labelledby="proj-next-title"
        ref={revealRef}
      >
        <div className="project-card-header">
          <div className="project-number" aria-hidden="true">
            {project.number}
          </div>
          <span className="upcoming-badge">{t('proj.upcoming_badge')}</span>
        </div>

        <UpcomingBlurPreview />

        <div className="project-body">
          <h3 id="proj-next-title" className="project-title">
            {t('proj.upcoming.title')}
          </h3>
          <p className="project-desc">{t(project.descKey)}</p>
          <div className="project-cta-group">
            <button
              className="btn btn-ghost btn-sm btn-project-detail"
              aria-label="Ver detalles del próximo proyecto"
              onClick={() => openProject(project.id)}
            >
              <i className="fa-solid fa-circle-info" aria-hidden="true" />
              <span>{t('proj.view_details')}</span>
            </button>
            <a
              href="https://github.com/Lain-Sthid-Ramirez-Rueda"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm"
            >
              <i className="fa-brands fa-github" aria-hidden="true" />
              <span>{t('proj.follow_github')}</span>
            </a>
          </div>
        </div>
      </article>
    );
  }

  const titleId = `proj-${project.id}-title`;

  return (
    <article
      className={`project-card reveal${delay ? ' reveal-delay' : ''}${revealVisible ? ' visible' : ''}`}
      aria-labelledby={titleId}
      ref={revealRef}
    >
      <div className="project-card-header">
        <div className="project-number" aria-hidden="true">
          {project.number}
        </div>
        <div className="project-links">
          <button
            className="btn btn-ghost btn-sm btn-project-detail"
            aria-label={`Ver detalles de ${project.title}`}
            onClick={() => openProject(project.id)}
          >
            <i className="fa-solid fa-circle-info" aria-hidden="true" />
            <span>{t('proj.view_details')}</span>
          </button>
          {project.demoUrl && (
            <button
              className="btn btn-ghost btn-sm btn-project-demo"
              aria-label={`Probar demo de ${project.title} en vivo`}
              onClick={() => {
                const url = project.demoUrl!;
                /* On narrow mobile, an embedded iframe preview is bad UX — open the real tab instead */
                if (window.innerWidth < 520) {
                  window.open(url, '_blank', 'noopener,noreferrer');
                  return;
                }
                openDemo({ url, title: project.demoTitle ?? project.title });
              }}
            >
              <i className="fa-solid fa-play" aria-hidden="true" />
              <span>{t('proj.live_demo')}</span>
            </button>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
              aria-label={`Ver ${project.title} en GitHub`}
            >
              <i className="fa-brands fa-github" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      {project.demoUrl ? (
        <ProjectDemoEmbed project={project} />
      ) : project.id === 'appfocus' ? (
        <AppFocusBlurPreview project={project} />
      ) : null}

      <div className="project-body">
        <h3 id={titleId} className="project-title">
          {project.title} {project.version && <span className="proj-version">{project.version}</span>}
        </h3>
        <p className="project-desc">{t(project.descKey)}</p>
        <div className="project-stack">
          {project.stack.map((s) => (
            <span className="stack-badge" key={s}>
              {s}
            </span>
          ))}
        </div>
      </div>
      <div className="project-card-glow" aria-hidden="true" />
    </article>
  );
}

export function Projects() {
  const { t } = useLang();
  const { ref: titleRef, visible: titleVisible } = useReveal<HTMLHeadingElement>();

  return (
    <section className="projects section" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <div className="section-label" aria-hidden="true">
          <span className="label-line" />
          <span>{t('projects.label')}</span>
        </div>
        <h2
          id="projects-title"
          className={`section-title reveal${titleVisible ? ' visible' : ''}`}
          ref={titleRef}
        >
          {t('projects.title')}
        </h2>

        <div className="projects-grid">
          {projects.map((project, i) => (
            <ProjectCard project={project} delay={i === 1} key={project.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
