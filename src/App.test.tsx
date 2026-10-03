import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('renders the full page tree without throwing', () => {
    render(<App />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getAllByText('Lain Sthid Ramirez Rueda').length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders all main sections', () => {
    render(<App />);

    expect(document.getElementById('hero')).toBeInTheDocument();
    expect(document.getElementById('about')).toBeInTheDocument();
    expect(document.getElementById('skills')).toBeInTheDocument();
    expect(document.getElementById('projects')).toBeInTheDocument();
    expect(document.getElementById('contact')).toBeInTheDocument();
  });

  it('lists the SENA Congress 2026 site as a project with a live demo', () => {
    render(<App />);
    const projects = document.getElementById('projects')!;
    expect(within(projects).getByRole('heading', { name: 'Congreso SENA 2026' })).toBeInTheDocument();
    expect(within(projects).getByRole('button', { name: 'Probar demo de Congreso SENA 2026 en vivo' })).toBeInTheDocument();
  });

  it('links GitHub only under the current username', () => {
    render(<App />);
    const githubLinks = [...document.querySelectorAll<HTMLAnchorElement>('a[href*="github.com"]')];
    expect(githubLinks.length).toBeGreaterThan(0);
    for (const link of githubLinks) {
      expect(link.href).toMatch(/^https:\/\/github\.com\/Lain-Sthid-Ramirez-Rueda(\/|$)/);
    }
  });

  it('renders the footer with the current year', () => {
    render(<App />);
    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByText(String(new Date().getFullYear()))).toBeInTheDocument();
  });

  it('does not mount any dialog until it has been opened (lazy-loaded)', () => {
    render(<App />);
    for (const id of ['cv-dialog', 'terminal-dialog', 'project-modal', 'cert-modal', 'demo-modal']) {
      expect(document.getElementById(id)).not.toBeInTheDocument();
    }
  });
});
