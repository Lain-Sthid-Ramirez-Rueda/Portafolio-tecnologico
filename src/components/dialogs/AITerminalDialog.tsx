import { useEffect, useRef, useState } from 'react';
import { useDialogController } from '../../hooks/useDialogController';
import { useDialogs } from '../../contexts/DialogsContext';
import { useLang } from '../../i18n/LangContext';
import { useSoundDesign } from '../../contexts/SoundContext';

const COMMANDS: Record<string, () => string> = {
  help: () => 'Comandos disponibles: bio, stack, projects, contact, ai, clear, date, whoami, exit',
  bio: () => 'Lain Sthid Ramirez Rueda | Analista y Desarrollador de Software en formación (SENA). Frontend con React y TypeScript, IA aplicada con Python y elicitación de requisitos.',
  stack: () =>
    'Frontend: React, TypeScript, Astro, HTML5, CSS3, Tailwind\nBackend: Python, Flask, Supabase, Docker\nIA: integración de LLMs (Groq API), Claude, Gemini, Prompt Engineering\nCalidad: Vitest, ESLint, Git/GitHub',
  projects: () =>
    '1. Congreso SENA 2026 (sitio oficial, seleccionado por convocatoria)\n2. ProAssist (asistente de IA bilingüe sobre Groq API)\n3. APPFOCUS (gestor de productividad Deep Work)\n4. Este portafolio (Astro + React + TypeScript, PWA)',
  contact: () => 'WhatsApp: +57 3209735859\nEmail: lainramirez18@gmail.com\nLinkedIn: lain-sthid-ramirez-rueda\nGitHub: Lain-Sthid-Ramirez-Rueda',
  ai: () => '🤖 Para conversar con IA de verdad, prueba la demo de ProAssist en la sección Proyectos.',
  date: () => `Fecha actual: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
  whoami: () => 'visitor@lsrr-portfolio-guest',
};

interface Line {
  id: number;
  kind: 'cmd' | 'response';
  text: string;
}

export function AITerminalDialog() {
  const { state, close } = useDialogs();
  const isOpen = state.name === 'terminal';
  const dialogRef = useDialogController(isOpen, close);
  const { t } = useLang();
  const { enabled, sounds } = useSoundDesign();

  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState('');
  const idRef = useRef(0);
  const outputRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [lines]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const appendLine = (kind: Line['kind'], text: string) => {
    setLines((prev) => [...prev, { id: ++idRef.current, kind, text }]);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const val = input.trim().toLowerCase();
    if (!val) return;
    setInput('');

    if (val === 'clear') {
      setLines([]);
      return;
    }
    if (val === 'exit') {
      close();
      return;
    }

    appendLine('cmd', val);
    const handler = COMMANDS[val];
    appendLine('response', handler ? handler() : `Comando no reconocido: "${val}". Escribe "help" para ver la lista de comandos.`);
  };

  return (
    <dialog
      id="terminal-dialog"
      className="terminal-dialog"
      aria-labelledby="terminal-dialog-title"
      aria-modal="true"
      ref={dialogRef}
    >
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-controls">
            <button className="control close-dot" id="terminal-dialog-close" aria-label="Cerrar terminal" onClick={close} />
            <span className="control minimize-dot" />
            <span className="control maximize-dot" />
          </div>
          <h3 id="terminal-dialog-title" className="terminal-title">
            {t('terminal.title')}
          </h3>
        </div>
        <div className="terminal-body" id="terminal-body">
          <div className="terminal-output" id="terminal-output" ref={outputRef}>
            <div className="terminal-line banner">
              <span className="prompt-user">system@lsrr-agent</span>:<span className="prompt-path">~</span>$ init --interactive
            </div>
            <div className="terminal-line welcome">{t('terminal.welcome')}</div>
            {lines.map((line) =>
              line.kind === 'cmd' ? (
                <div className="terminal-line" key={line.id}>
                  <span className="prompt-user">visitor@lsrr-agent</span>:<span className="prompt-path">~</span>
                  $&nbsp;<span className="prompt-cmd">{line.text}</span>
                </div>
              ) : (
                <div className="terminal-line response" style={{ color: '#7ee787' }} key={line.id}>
                  {line.text.split('\n').map((part, i) => (
                    <span key={i}>
                      {i > 0 && <br />}
                      {part}
                    </span>
                  ))}
                </div>
              ),
            )}
          </div>
          <form id="terminal-form" className="terminal-input-row" autoComplete="off" onSubmit={onSubmit}>
            <span className="prompt-user">visitor@lsrr-agent</span>:<span className="prompt-path">~</span>
            &nbsp;
            <input
              type="text"
              id="terminal-input"
              className="terminal-input"
              aria-label={t('terminal.prompt_label')}
              placeholder="type help..."
              value={input}
              ref={inputRef}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={() => {
                if (enabled) sounds.terminal();
              }}
            />
          </form>
        </div>
      </div>
    </dialog>
  );
}
