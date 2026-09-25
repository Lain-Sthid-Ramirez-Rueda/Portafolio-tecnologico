import { useEffect, useState } from 'react';
import { useDialogController } from '../../hooks/useDialogController';
import { useDialogs } from '../../contexts/DialogsContext';
import { useLang } from '../../i18n/LangContext';

interface Demo {
  url: string;
  title: string;
}

/** Keyed by demo URL in the parent, so each new demo remounts with fresh state — no
 *  reset-on-prop-change effect needed. */
function DemoBody({ demo }: { demo: Demo }) {
  const { t } = useLang();
  const [src, setSrc] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /* Small delay before injecting src lets the dialog paint first */
    const openTimer = setTimeout(() => setSrc(demo.url), 80);
    /* Render containers can take up to 60s to cold-start */
    const timeoutTimer = setTimeout(() => setLoading(false), 60000);
    return () => {
      clearTimeout(openTimer);
      clearTimeout(timeoutTimer);
    };
  }, [demo.url]);

  return (
    <div className="demo-modal-body">
      {loading && (
        <div className="demo-loading" id="demo-loading">
          <div className="demo-loader-ring" />
          <p className="demo-loading-text">
            <span>{t('demo.loading')}</span>
            <span className="demo-dots-anim">...</span>
          </p>
          <p className="demo-loading-sub">{t('demo.loading_sub')}</p>
        </div>
      )}
      <iframe
        id="demo-iframe"
        className="demo-iframe"
        title="Demo en vivo de ProAssist"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        allow="microphone"
        src={src}
        style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s' }}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}

export function LiveDemoDialog() {
  const { state, close } = useDialogs();
  const isOpen = state.name === 'demo';
  const dialogRef = useDialogController(isOpen, close);
  const demo = state.name === 'demo' ? state.demo : null;

  return (
    <dialog id="demo-modal" className="demo-modal" aria-labelledby="demo-modal-title" aria-modal="true" ref={dialogRef}>
      <div className="demo-modal-content">
        <div className="demo-modal-titlebar">
          <div className="demo-browser-controls" aria-hidden="true">
            <span className="demo-dot demo-dot--red" />
            <span className="demo-dot demo-dot--yellow" />
            <span className="demo-dot demo-dot--green" />
          </div>
          <div className="demo-url-bar" aria-hidden="true">
            <i className="fa-solid fa-lock" />
            <span id="demo-url-display">{demo?.url ?? ''}</span>
          </div>
          <div className="demo-controls">
            <a
              id="demo-open-external"
              href={demo?.url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="demo-ctrl-btn"
              aria-label="Abrir en pestaña nueva"
            >
              <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
            </a>
            <button id="demo-modal-close" className="cv-dialog-close" aria-label="Cerrar visor de demo" onClick={close}>
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
          </div>
        </div>
        {isOpen && demo && <DemoBody demo={demo} key={demo.url} />}
      </div>
    </dialog>
  );
}
