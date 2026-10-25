import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Accessibility & WCAG AA Static Verification', () => {
  const indexHtmlPath = path.resolve(__dirname, '../../index.html');
  const indexCssPath = path.resolve(__dirname, '../../src/index.css');

  const htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
  const cssContent = fs.readFileSync(indexCssPath, 'utf8');

  it('contains explicit <html lang="en"> declaration', () => {
    expect(htmlContent).toMatch(/<html\s+lang=["']en["']/i);
  });

  it('contains descriptive <title> tag matching the problem domain', () => {
    expect(htmlContent).toContain('<title>');
    expect(htmlContent).toMatch(/<title>PlanAura/i);
    expect(htmlContent).not.toContain('Vite App');
    expect(htmlContent).not.toContain('React App');
  });

  it('contains valid <meta name="viewport"> configuration', () => {
    expect(htmlContent).toMatch(/<meta\s+name=["']viewport["']\s+content=["'][^"']*width=device-width/i);
  });

  it('contains descriptive <meta name="description"> tag', () => {
    expect(htmlContent).toMatch(/<meta\s+name=["']description["']/i);
    expect(htmlContent).toContain('PlanAura');
    expect(htmlContent).toContain('weddings');
  });

  it('includes performance font preconnect links for Google Fonts CDN', () => {
    expect(htmlContent).toContain('rel="preconnect" href="https://fonts.googleapis.com"');
    expect(htmlContent).toContain('rel="preconnect" href="https://fonts.gstatic.com"');
  });

  it('implements WCAG AA visible skip link in CSS', () => {
    expect(cssContent).toContain('.skip-link');
    expect(cssContent).toContain(':focus');
  });

  it('implements explicit keyboard focus outline :focus-visible in CSS', () => {
    expect(cssContent).toContain(':focus-visible');
    expect(cssContent).toContain('outline');
  });

  it('implements prefers-reduced-motion media query for motion sensitivity', () => {
    expect(cssContent).toContain('@media (prefers-reduced-motion: reduce)');
    expect(cssContent).toContain('animation-duration: 0.01ms');
  });

  it('implements prefers-contrast high media query for low vision users', () => {
    expect(cssContent).toContain('@media (prefers-contrast: high)');
  });

  it('implements print media query for clean day-of paper call-sheets', () => {
    expect(cssContent).toContain('@media print');
  });
});
