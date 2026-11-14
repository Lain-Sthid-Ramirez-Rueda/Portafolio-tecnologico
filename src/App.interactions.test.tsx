import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';

// jsdom's default navigator.language ('en-US') otherwise makes the app boot in
// English, so lock the language deterministically for these locale-sensitive queries.
beforeEach(() => {
  localStorage.setItem('lain-lang-v2', 'es');
});

describe('App interactions', () => {
  it('opens and closes the CV dialog from the hero button (lazy-loaded on first open)', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(document.getElementById('cv-dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Descargar CV/i }));
    const dialog = await waitFor(() => {
      const el = document.getElementById('cv-dialog') as HTMLDialogElement | null;
      expect(el).toHaveAttribute('open');
      return el!;
    });

    await user.click(screen.getByRole('button', { name: /Cerrar modal/i }));
    expect(dialog).not.toHaveAttribute('open');
  });

  it('opens the AI terminal and runs the help command (lazy-loaded on first open)', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Terminal IA/i }));
    await waitFor(() => {
      expect(document.getElementById('terminal-dialog')).toHaveAttribute('open');
    });

    const input = screen.getByPlaceholderText('type help...');
    await user.type(input, 'help{enter}');

    expect(screen.getByText(/Comandos disponibles:/i)).toBeInTheDocument();
  });

  it('filters skills by category', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(document.querySelector('[data-category="backend"]')).not.toHaveClass('filtered-out');

    await user.click(screen.getByRole('button', { name: 'Frontend' }));

    expect(document.querySelector('[data-category="backend"]')).toHaveClass('filtered-out');
    expect(document.querySelector('[data-category="frontend"]')).not.toHaveClass('filtered-out');
  });

  it('shows the QA, Testing & RPA category with translated pills when filtered', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'QA & Testing' }));

    const qa = document.querySelector('[data-category="qa"]');
    expect(qa).not.toHaveClass('filtered-out');
    expect(document.querySelector('[data-category="frontend"]')).toHaveClass('filtered-out');
    expect(qa).toHaveTextContent('Pruebas Unitarias');
    expect(qa).toHaveTextContent('Pruebas de Aceptación (UAT)');
    expect(qa).toHaveTextContent('RPA');
  });
});
