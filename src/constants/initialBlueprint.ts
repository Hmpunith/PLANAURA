/**
 * @file PlanAura Default Fallback Event Blueprint
 * @description Curated baseline blueprint utilized during initial load and offline client states.
 * @module src/constants/initialBlueprint
 */

import { EventBlueprint } from '../types';

/**
 * Standard baseline celebration blueprint for initial application state.
 */
export const INITIAL_BLUEPRINT: EventBlueprint = {
  eventName: 'The Grand Celebration',
  eventType: 'wedding',
  eventDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
  guestCount: 100,
  currency: 'USD',
  budget: {
    currency: 'USD',
    totalBudget: 25000,
    totalAllocated: 25000,
    totalActual: 11000,
    remainingBudget: 14000,
    isOverBudget: false,
    variancePercentage: 0,
    allocationsByCategory: {
      'Venue & Catering': { allocated: 11250, actual: 8500, percentOfTotal: 45 },
      'Photography & Video': { allocated: 3000, actual: 2500, percentOfTotal: 12 },
      'Music & Entertainment': { allocated: 2500, actual: 0, percentOfTotal: 10 },
      'Floral & Decor': { allocated: 2500, actual: 0, percentOfTotal: 10 },
      'Attire & Beauty': { allocated: 2000, actual: 0, percentOfTotal: 8 },
      'Planner & Coordination': { allocated: 1750, actual: 0, percentOfTotal: 7 },
      'Contingency Buffer': { allocated: 1250, actual: 0, percentOfTotal: 5 },
      'Stationery & Favors': { allocated: 750, actual: 0, percentOfTotal: 3 },
    },
    alerts: [],
    costOptimizationTips: [
      'Lock vendor early-booking discounts by committing contracts at least 6 months prior to event date.',
      'Consider buffet-style or family-style service to trim per-guest catering costs by 18-25%.',
    ],
    items: [
      {
        id: 'b-1',
        category: 'Venue & Catering',
        name: 'Reception Ballroom & Dinner',
        allocatedAmount: 11250,
        actualAmount: 8500,
        status: 'committed',
      },
      {
        id: 'b-2',
        category: 'Photography & Video',
        name: '8-Hour Photo & Cinema',
        allocatedAmount: 3000,
        actualAmount: 2500,
        status: 'committed',
      },
      {
        id: 'b-3',
        category: 'Music & Entertainment',
        name: 'Ceremony PA & Reception DJ',
        allocatedAmount: 2500,
        actualAmount: 0,
        status: 'quoted',
      },
      {
        id: 'b-4',
        category: 'Floral & Decor',
        name: 'Centerpieces & Arch',
        allocatedAmount: 2500,
        actualAmount: 0,
        status: 'quoted',
      },
      {
        id: 'b-5',
        category: 'Contingency Buffer',
        name: 'Emergency Overtime Reserve',
        allocatedAmount: 1250,
        actualAmount: 0,
        status: 'pending',
      },
    ],
  },
  timeline: {
    eventType: 'wedding',
    eventDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    daysRemaining: 180,
    milestones: [
      {
        id: 'm-1',
        phase: '6_months_plus',
        timeframeLabel: '6+ Months Out',
        title: 'Secure Ceremony & Reception Venues',
        description: 'Review floorplans, capacity caps, and curfew restrictions.',
        completed: true,
        category: 'logistics',
      },
      {
        id: 'm-2',
        phase: '6_months_plus',
        timeframeLabel: '6+ Months Out',
        title: 'Book Lead Photographer & Videographer',
        description: 'Review portfolio highlight reels and sign service agreement.',
        completed: true,
        category: 'vendor',
      },
      {
        id: 'm-3',
        phase: '3_to_6_months',
        timeframeLabel: '3 to 6 Months Out',
        title: 'Tasting & Beverage Menu Lock',
        description: 'Schedule tasting with caterer and select signature cocktails.',
        completed: false,
        category: 'vendor',
      },
      {
        id: 'm-4',
        phase: '1_to_2_months',
        timeframeLabel: '1 to 2 Months Out',
        title: 'Distribute Invitations & Track RSVPs',
        description: 'Collect dietary restrictions and finalize headcount.',
        completed: false,
        category: 'guest',
      },
    ],
    dayOfRunOfShow: [
      {
        id: 'ros-1',
        time: '09:00 AM',
        activity: 'Bridal Suite Load-In & Makeup',
        leadPerson: 'Maid of Honor',
        location: 'Bridal Suite',
        notes: 'Catering light brunch and mimosas.',
      },
      {
        id: 'ros-2',
        time: '01:30 PM',
        activity: 'First Look & Couple Portraits',
        leadPerson: 'Photographer',
        location: 'Garden Pavilion',
        notes: 'Family portraits scheduled for 02:30 PM.',
      },
      {
        id: 'ros-3',
        time: '04:30 PM',
        activity: 'Ceremony Processional',
        leadPerson: 'Officiant & Planner',
        location: 'Main Sanctuary',
        notes: 'Cellist begins prelude music at 04:00 PM.',
      },
      {
        id: 'ros-4',
        time: '06:30 PM',
        activity: 'Grand Reception Entrance',
        leadPerson: 'DJ / MC',
        location: 'Ballroom',
        notes: 'Followed immediately by first dance.',
      },
    ],
  },
  vendors: {
    items: [
      {
        id: 'v-1',
        category: 'Venue & Banquet',
        name: 'The Glasshouse Estate',
        serviceDescription: 'Private estate grounds and glass pavilion ballroom.',
        status: 'booked',
        quoteAmount: 8500,
        depositPaid: true,
        depositAmount: 2500,
        balanceRemaining: 6000,
        contractSigned: true,
        notes: 'COI submitted and approved by estate manager.',
      },
      {
        id: 'v-2',
        category: 'Photography',
        name: 'Lumina Wedding Cinematics',
        serviceDescription: 'Full day coverage with drone aerial video.',
        status: 'booked',
        quoteAmount: 3800,
        depositPaid: true,
        depositAmount: 1000,
        balanceRemaining: 2800,
        contractSigned: true,
        notes: 'Includes engagement photo session album.',
      },
      {
        id: 'v-3',
        category: 'Live Music & DJ',
        name: 'Soundwave Collective',
        serviceDescription: 'Acoustic duo for ceremony and 5-piece band for party.',
        status: 'quoted',
        quoteAmount: 2400,
        depositPaid: false,
        depositAmount: 600,
        balanceRemaining: 2400,
        contractSigned: false,
        notes: 'Awaiting revised playlist agreement.',
      },
    ],
    metrics: {
      totalVendors: 3,
      bookedCount: 2,
      pendingCount: 1,
      percentReady: 67,
      totalCommittedAmount: 14700,
      totalDepositsPaid: 3500,
      remainingLiability: 11200,
    },
  },
  personalizedIdeas: {
    curatedVault: [
      {
        id: 'vault-1',
        themeTitle: 'Gilded Baroque Garden',
        tagline: 'Opulent European romanticism amidst botanical architecture',
        aestheticDescription:
          'Candlelit antique gold candelabras, trailing ivy, velvet napkins, and warm ambient string lighting.',
        colorPalette: [
          { name: 'Gilded Gold', hex: '#D4AF37' },
          { name: 'Emerald Velvet', hex: '#0F3E2B' },
          { name: 'Champagne Blush', hex: '#F7E7CE' },
          { name: 'Obsidian Night', hex: '#1C1C1E' },
        ],
        signatureMenu: {
          cocktailOrBeverage: 'Rosemary French 75 with edible gold dust garnish',
          appetizer: 'Black truffle burrata crostini with balsamic drizzle',
          mainCourse: 'Herb-crusted pan-seared sea bass with saffron risotto',
          dessert: 'Mille-feuille with Madagascar vanilla bean cream and berries',
        },
        highlightActivities: [
          'Interactive Champagne Wall Seating Escort',
          'Live Oil Painting of First Dance',
          'Vintage Polaroid Guestbook Station',
        ],
        invitationWordingDraft:
          'Together with their families, Savannah and Liam request the honor of your presence as they unite in marriage.',
      },
    ],
    bespokeConcept: {
      id: 'bespoke-1',
      themeTitle: 'Ethereal Celestial Starlight',
      tagline: 'Constellation elegance under an illuminated midnight canopy',
      aestheticDescription:
        'Twinkling fiber optic ceiling drapery, deep navy velvet accents, and crystal glassware.',
      colorPalette: [
        { name: 'Midnight Celestial', hex: '#0A1128' },
        { name: 'Stardust Silver', hex: '#E0E1DD' },
        { name: 'Luminous Gold', hex: '#F9D342' },
        { name: 'Deep Indigo', hex: '#1C2541' },
      ],
      signatureMenu: {
        cocktailOrBeverage: 'The Galaxy Shimmer: Empress gin, violette, prosecco',
        appetizer: 'Smoked salmon tartare with gold leaf and micro basil',
        mainCourse: 'Filet mignon with blackberry port reduction',
        dessert: 'Dark chocolate dome with flaming Grand Marnier pour',
      },
      highlightActivities: [
        'Late-Night Astrologer Reading Lounge',
        'Starlit Fog Effect on First Dance',
        'Custom Constellation Cocktail Station',
      ],
      invitationWordingDraft:
        'Written in the stars: Join us under the night sky for an unforgettable evening celebrating love and destiny.',
    },
  },
};
