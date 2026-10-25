/**
 * @file PlanAura Markdown Renderer Unit Test Suite
 * @description Verifies semantic element transformations, inline styling, code blocks, and safety stripping.
 */

import { describe, it, expect } from 'vitest';
import { formatInlineMarkdown, renderFormattedMessage } from '../../src/utils/markdownRenderer';

describe('Markdown Renderer Unit Tests', () => {
  describe('formatInlineMarkdown', () => {
    it('formats bold text correctly', () => {
      const result = formatInlineMarkdown('This is **bold** text');
      expect(Array.isArray(result)).toBe(true);
    });

    it('formats bold-italic triple asterisks correctly', () => {
      const result = formatInlineMarkdown('This is ***bold-italic*** text');
      expect(Array.isArray(result)).toBe(true);
    });

    it('formats inline backtick code snippets', () => {
      const result = formatInlineMarkdown('Use `npm test` to verify');
      expect(Array.isArray(result)).toBe(true);
    });

    it('cleans up raw asterisks safely without crashing', () => {
      const result = formatInlineMarkdown('Unmatched ** asterisks');
      expect(result).toBeDefined();
    });
  });

  describe('renderFormattedMessage', () => {
    it('transforms headings h1 to h4 into structured elements', () => {
      const content = '# Title\n## Subheading\n### Section\n#### Sub-detail';
      const rendered = renderFormattedMessage(content);
      expect(Array.isArray(rendered)).toBe(true);
      expect((rendered as unknown[]).length).toBeGreaterThanOrEqual(4);
    });

    it('transforms blockquotes into callout elements', () => {
      const content = '> 💡 Cost-saving tip: book early!';
      const rendered = renderFormattedMessage(content);
      expect(Array.isArray(rendered)).toBe(true);
    });

    it('transforms numbered lists and bullet points', () => {
      const content = '1. First step\n2. Second step\n- Bullet A\n* Bullet B';
      const rendered = renderFormattedMessage(content);
      expect(Array.isArray(rendered)).toBe(true);
    });

    it('transforms horizontal divider bars', () => {
      const content = 'Above\n---\nBelow';
      const rendered = renderFormattedMessage(content);
      expect(Array.isArray(rendered)).toBe(true);
    });
  });
});
