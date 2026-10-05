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
  const [interactActive, setInteractActive] = useState(false);
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
    <div className="project-preview-frame" ref={frameRef}>
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

      <div className="demo-embed-viewport">
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

        {!interactActive && (
          <div
            className="demo-touch-shield"
            onClick={() => setInteractActive(true)}
            role="button"
            tabIndex={0}
            aria-label={`${t('demo.touch_hint')} con ${project.title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setInteractActive(true);
              }
            }}
          >
            <span className="demo-touch-pill">
              <i className="fa-solid fa-hand-pointer" aria-hidden="true" />
              <span>{t('demo.touch_hint')}</span>
            </span>
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
            style={{ opacity: loaded ? 1 : 0 }}
            onLoad={() => setLoaded(true)}
          />
        )}
      </div>
    </div>
  );
}

function AppFocusTerminalPreview({ project }: { project: (typeof projects)[number] }) {
  return (
    <div className="project-preview-frame">
      <div className="demo-embed-titlebar">
        <div className="demo-browser-controls" aria-hidden="true">
          <span className="demo-dot demo-dot--red" />
          <span className="demo-dot demo-dot--yellow" />
          <span className="demo-dot demo-dot--green" />
        </div>
        <div className="demo-embed-url" title="Terminal APPFOCUS CORE v3.0">
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
      <div className="demo-embed-viewport demo-terminal-viewport">
        <div className="terminal-code-block" aria-label="Terminal interactiva de APPFOCUS">
          <div className="term-line">
            <span className="term-prompt">$</span>
            <span className="term-cmd">appfocus --init --mode deep-work</span>
          </div>
          <div className="term-line term-dim">➜ [OK] Core v3.0 inicializado sin telemetría de red</div>
          <div className="term-line">
            <span className="term-accent">● Protocolo:</span>
            <span className="term-txt">Deep Work (Cal Newport)</span>
          </div>
          <div className="term-line">
            <span className="term-accent">● Foco Dinámico:</span>
            <span className="term-txt">50m concentración / 10m descanso</span>
          </div>
          <div className="term-line">
            <span className="term-accent">● Almacenamiento:</span>
            <span className="term-txt">100% LocalStorage / IndexedDB</span>
          </div>
          <div className="term-line">
            <span className="term-accent">● Rendimiento:</span>
            <span className="term-txt">0 dependencias externas / 0 rastreadores</span>
          </div>
          <div className="term-line term-cursor-line">
            <span className="term-prompt">$</span>
            <span className="term-cursor" aria-hidden="true">▋</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function UpcomingOrchestratorPreview() {
  const { t } = useLang();
  return (
    <div className="project-preview-frame project-preview-frame--upcoming">
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
      <div className="demo-embed-viewport demo-terminal-viewport">
        <div className="terminal-code-block" aria-label="Pipeline de subagentes IA">
          <div className="term-line">
            <span className="term-prompt">&gt;</span>
            <span className="term-cmd">python -m ai_agents.orchestrator --pool 3</span>
          </div>
          <div className="term-line term-dim">Ecosistema autónomo de subagentes de IA en desarrollo:</div>
          <div className="term-line">
            <span className="term-agent">[Subagente 01]</span>
            <span className="term-txt">Elicitación de Requisitos ── [ACTIVO]</span>
          </div>
          <div className="term-line">
            <span className="term-agent">[Subagente 02]</span>
            <span className="term-txt">Análisis de Datos y Flujos ── [EN PROCESO]</span>
          </div>
          <div className="term-line">
            <span className="term-agent">[Subagente 03]</span>
            <span className="term-txt">Generación de Documentación ── [EN COLA]</span>
          </div>
          <div className="term-line term-cursor-line">
            <span className="term-prompt">&gt;</span>
            <span className="term-cursor" aria-hidden="true">▋</span>
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

        <UpcomingOrchestratorPreview />

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
        <AppFocusTerminalPreview project={project} />
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
