import { describe, it, expect } from 'vitest';
import { IdeaSynthesizer } from '../../server/modules/ideas/ideaSynthesizer.js';

describe('IdeaSynthesizer Unit Tests', () => {
  it('retrieves rich concept vaults for weddings with color palettes', () => {
    const concepts = IdeaSynthesizer.getConcepts('wedding');
    expect(concepts.length).toBeGreaterThanOrEqual(1);

    const first = concepts[0];
    expect(first.themeTitle).toBeDefined();
    expect(first.colorPalette.length).toBe(4);
    expect(first.colorPalette[0].hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(first.signatureMenu.cocktailOrBeverage).toBeDefined();
    expect(first.invitationWordingDraft).toBeDefined();
  });

  it('retrieves rich concepts for milestone birthdays', () => {
    const concepts = IdeaSynthesizer.getConcepts('birthday');
    expect(concepts.length).toBeGreaterThanOrEqual(1);

    const first = concepts[0];
    expect(first.themeTitle.toLowerCase()).toContain('disco');
    expect(first.highlightActivities.length).toBeGreaterThan(0);
  });

  it('retrieves community festival concepts', () => {
    const concepts = IdeaSynthesizer.getConcepts('community');
    expect(concepts.length).toBeGreaterThanOrEqual(1);

    const first = concepts[0];
    expect(first.themeTitle.toLowerCase()).toContain('harvest');
    expect(first.signatureMenu.cocktailOrBeverage).toContain('cider');
  });

  it('synthesizes personalized concept customized to user vibe and guest count', () => {
    const bespoke = IdeaSynthesizer.synthesizePersonalizedConcept(
      'wedding',
      'Midnight Bohemian Romance',
      120
    );

    expect(bespoke.themeTitle).toContain('Midnight Bohemian Romance');
    expect(bespoke.aestheticDescription).toContain('120 guests');
    expect(bespoke.tagline).toContain('wedding');
  });

  it('handles empty vibe string gracefully by providing default concept title', () => {
    const bespoke = IdeaSynthesizer.synthesizePersonalizedConcept('birthday', '', 40);
    expect(bespoke.themeTitle).toBeDefined();
    expect(bespoke.aestheticDescription).toContain('40 guests');
  });
});
