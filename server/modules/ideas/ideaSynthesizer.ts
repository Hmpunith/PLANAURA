/**
 * @file PlanAura Personalized Ideas & Concept Synthesizer
 * @description Generates bespoke themes, color palettes, menu concepts, and guest activities.
 */

import { EventCategory } from '../budget/budgetEngine.js';

export interface IdeaConcept {
  id: string;
  themeTitle: string;
  tagline: string;
  aestheticDescription: string;
  colorPalette: Array<{ name: string; hex: string }>;
  signatureMenu: {
    cocktailOrBeverage: string;
    appetizer: string;
    mainCourse: string;
    dessert: string;
  };
  highlightActivities: string[];
  invitationWordingDraft: string;
}

const CURATED_IDEA_VAULT: Record<EventCategory, IdeaConcept[]> = {
  wedding: [
    {
      id: 'idea-w-1',
      themeTitle: 'Ethereal Tuscan Vineyard & Olive Grove',
      tagline: 'Under the golden sun, surrounded by vines and eternal devotion.',
      aestheticDescription:
        'Sun-bleached limestone textures, sprawling olive branch garlands, warm candlelight in etched glass hurricanes, and raw linen table runners.',
      colorPalette: [
        { name: 'Olive Leaf', hex: '#556B2F' },
        { name: 'Warm Terracotta', hex: '#E2725B' },
        { name: 'Champagne Shimmer', hex: '#F7E7CE' },
        { name: 'Deep Cypress', hex: '#1C3124' },
      ],
      signatureMenu: {
        cocktailOrBeverage: 'Rosemary Aperol Spritz with blood orange slice',
        appetizer: 'Burrata with charred mission figs, prosciutto, and aged balsamic glaze',
        mainCourse: 'Pan-seared Chilean sea bass with saffron risotto and crispy leeks',
        dessert: 'Mille-feuille with mascarpone cream and fresh wild raspberries',
      },
      highlightActivities: [
        'Acoustic cello & guitar arrangements during cocktail golden hour',
        'Interactive olive oil tasting bar with artisan focaccia pairing',
        'Polaroid memory guestbook framed on rustic reclaimed timber easel',
      ],
      invitationWordingDraft:
        'Together with their families, [Names] invite you to celebrate love, wine, and forever beneath the Tuscan canopy. Kindly join us as we say "I Do".',
    },
    {
      id: 'idea-w-2',
      themeTitle: 'Midnight Celestial Glamour & Black Tie',
      tagline: 'Written in the stars, illuminated by starlight and crystal.',
      aestheticDescription:
        'Dramatic midnight obsidian drape with twinkling fiber-optic star ceiling, smoked mirror tables, cascading white orchids, and crystal cut chandeliers.',
      colorPalette: [
        { name: 'Midnight Navy', hex: '#0B132B' },
        { name: 'Stardust Gold', hex: '#D4AF37' },
        { name: 'Silver Moonbeam', hex: '#E0E1DD' },
        { name: 'Onyx Noir', hex: '#1C1C1C' },
      ],
      signatureMenu: {
        cocktailOrBeverage:
          'Midnight Eclipse: Empress 1908 gin, elderflower, and edible gold flakes',
        appetizer: 'Truffled steak tartare on toasted brioche crisps',
        mainCourse: 'Filet mignon with black garlic reduction and parsnip velvet purée',
        dessert: 'Dark chocolate dome melted with warm salted caramel drizzle',
      },
      highlightActivities: [
        'Late-night silent disco after midnight with dual battle DJs',
        'Cold-spark fountain sendoff as the couple departs',
        'Custom tarot & celestial chart readings for intrigued guests',
      ],
      invitationWordingDraft:
        'Two souls align beneath celestial skies. You are cordially invited to celebrate the union of [Names] in an evening of formal elegance and timeless dancing.',
    },
  ],
  birthday: [
    {
      id: 'idea-b-1',
      themeTitle: 'Retro Disco Groove & Neon Velvet',
      tagline: '70s glamour meets modern club chic.',
      aestheticDescription:
        'Suspended mirrored disco balls, retro neon signage, velvet cocktail lounge seating, and pulsating amber and magenta ambient uplighting.',
      colorPalette: [
        { name: 'Electric Magenta', hex: '#D81159' },
        { name: 'Sunburst Gold', hex: '#FFBC42' },
        { name: 'Velvet Teal', hex: '#0496FF' },
        { name: 'Deep Aubergine', hex: '#2E0249' },
      ],
      signatureMenu: {
        cocktailOrBeverage: 'Spicy Paloma with smoked chili salt rim and grapefruit twist',
        appetizer: 'Crispy pork belly bao buns with pickled cucumber and hoisin',
        mainCourse: 'Artisan wood-fired flatbreads & gourmet slider flight',
        dessert: 'Funfetti birthday cake shooters with glitter frosting pipette',
      },
      highlightActivities: [
        'Rollerskate disco dance battle with neon glow accessories',
        'Vintage photo booth with instant customized film prints',
        'Vinyl-only DJ set spinning classic soul and funk records',
      ],
      invitationWordingDraft:
        'Get ready to groove! Dust off your dancing shoes and join us to celebrate [Name] turning [Age] under the disco lights.',
    },
  ],
  community: [
    {
      id: 'idea-c-1',
      themeTitle: 'Harvest Moon Neighborhood Festival & Makers Faire',
      tagline: 'Bringing community together to celebrate local craft, music, and harvest.',
      aestheticDescription:
        'Burlap and timber craft booths, festive string bulb festoons crisscrossing the central plaza, hay bale amphitheater seating, and local wildflower arrangements.',
      colorPalette: [
        { name: 'Harvest Amber', hex: '#D97706' },
        { name: 'Forest Moss', hex: '#2D6A4F' },
        { name: 'Warm Cream', hex: '#FEF3C7' },
        { name: 'Rustic Brick', hex: '#9A3412' },
      ],
      signatureMenu: {
        cocktailOrBeverage: 'Fresh-pressed spiced apple cider with cinnamon stick',
        appetizer: 'Local artisan cheese curds and warm salted soft pretzels',
        mainCourse: 'Farm-to-table food truck rally featuring local culinary vendors',
        dessert: 'Cider donuts dusted with cinnamon sugar and roasted candied pecans',
      },
      highlightActivities: [
        'Community mural wall where residents paint shared neighborhood memories',
        'Acoustic porchfest stage showcasing local high school and indie musicians',
        'Children’s STEM discovery zone with giant bubble making and robotics demos',
      ],
      invitationWordingDraft:
        'You are the heart of our neighborhood! Join us for the Annual Harvest Festival & Makers Faire. Free admission, live entertainment, and festivities for all ages.',
    },
  ],
};

export class IdeaSynthesizer {
  /**
   * Retrieves curated creative ideas customized for the specified event category.
   */
  public static getConcepts(eventType: EventCategory): IdeaConcept[] {
    return CURATED_IDEA_VAULT[eventType] || CURATED_IDEA_VAULT.community;
  }

  /**
   * Generates a customized concept blending user keywords and theme desires.
   */
  public static synthesizePersonalizedConcept(
    eventType: EventCategory,
    userVibe: string,
    guestCount: number
  ): IdeaConcept {
    const base = this.getConcepts(eventType)[0];
    const customizedTitle = userVibe
      ? `${userVibe.charAt(0).toUpperCase() + userVibe.slice(1)} Celebration Experience`
      : base.themeTitle;

    return {
      ...base,
      id: `synth-${Date.now()}`,
      themeTitle: customizedTitle,
      aestheticDescription: `${base.aestheticDescription} Specially calibrated for a curated gathering of ${guestCount} guests.`,
      tagline: `A tailor-made ${eventType} experience celebrating joy and authentic connection.`,
    };
  }
}
