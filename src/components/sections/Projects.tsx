import { useLang } from '../../i18n/LangContext';
import { useReveal } from '../../hooks/useReveal';
import { useDialogs } from '../../contexts/DialogsContext';
import { projects } from '../../data/projects';

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
