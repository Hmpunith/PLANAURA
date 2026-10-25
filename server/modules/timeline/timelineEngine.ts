/**
 * @file PlanAura Timeline & Run-of-Show Engine
 * @description Generates multi-phase milestone countdowns and day-of hour-by-hour itineraries.
 */

import { TimelineConflictFault } from '../../errors/PlannerError.js';
import { EventCategory } from '../budget/budgetEngine.js';

export interface Milestone {
  id: string;
  phase: '6_months_plus' | '3_to_6_months' | '1_to_2_months' | 'final_weeks' | 'day_of';
  timeframeLabel: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  category: 'logistics' | 'vendor' | 'design' | 'guest';
}

export interface DayOfScheduleItem {
  id: string;
  time: string;
  activity: string;
  leadPerson: string;
  location: string;
  notes: string;
}

export interface TimelinePackage {
  eventType: EventCategory;
  eventDate: string;
  milestones: Milestone[];
  dayOfRunOfShow: DayOfScheduleItem[];
  daysRemaining: number;
}

export class TimelineEngine {
  /**
   * Generates a comprehensive milestone countdown roadmap and day-of run-of-show schedule.
   */
  public static generateTimeline(eventType: EventCategory, eventDateStr: string): TimelinePackage {
    const eventDate = new Date(eventDateStr);
    if (isNaN(eventDate.getTime())) {
      throw new TimelineConflictFault('Invalid event date format provided. Expected ISO string.', {
        eventDateStr,
      });
    }

    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const milestones = this.buildMilestones(eventType, eventDate);
    const dayOfRunOfShow = this.buildRunOfShow(eventType);

    return {
      eventType,
      eventDate: eventDateStr,
      milestones,
      dayOfRunOfShow,
      daysRemaining,
    };
  }

  private static buildMilestones(eventType: EventCategory, _eventDate: Date): Milestone[] {
    if (eventType === 'wedding') {
      return [
        {
          id: 'ms-w-1',
          phase: '6_months_plus',
          timeframeLabel: '6+ Months Prior',
          title: 'Secure Ceremony & Reception Venues',
          description: 'Tour and lock contracts for primary and backup weather venues.',
          completed: false,
          category: 'logistics',
        },
        {
          id: 'ms-w-2',
          phase: '6_months_plus',
          timeframeLabel: '6+ Months Prior',
          title: 'Book Core Creative Vendors',
          description: 'Retain lead photographer, videographer, and caterer.',
          completed: false,
          category: 'vendor',
        },
        {
          id: 'ms-w-3',
          phase: '3_to_6_months',
          timeframeLabel: '3 to 6 Months Prior',
          title: 'Send Save-the-Dates & Finalize Guest List',
          description: 'Circulate travel registry details to out-of-town guests.',
          completed: false,
          category: 'guest',
        },
        {
          id: 'ms-w-4',
          phase: '3_to_6_months',
          timeframeLabel: '3 to 6 Months Prior',
          title: 'Menu Tasting & Floral Design Review',
          description: 'Confirm dietary accommodations and floral color story.',
          completed: false,
          category: 'design',
        },
        {
          id: 'ms-w-5',
          phase: '1_to_2_months',
          timeframeLabel: '1 to 2 Months Prior',
          title: 'Formal Invitations & RSVP Cutoff',
          description: 'Establish firm headcount and compile dietary restrictions.',
          completed: false,
          category: 'guest',
        },
        {
          id: 'ms-w-6',
          phase: 'final_weeks',
          timeframeLabel: '2 Weeks Prior',
          title: 'Final Seating Chart & Vendor Call-Sheets',
          description: 'Distribute day-of run-of-show itinerary to bridal party and DJ.',
          completed: false,
          category: 'logistics',
        },
        {
          id: 'ms-w-7',
          phase: 'day_of',
          timeframeLabel: 'Day Of Celebration',
          title: 'Ceremony Execution & First Dance',
          description: 'Execute bridal preparations, processional, cocktail hour, and dinner.',
          completed: false,
          category: 'logistics',
        },
      ];
    }

    if (eventType === 'birthday') {
      return [
        {
          id: 'ms-b-1',
          phase: '3_to_6_months',
          timeframeLabel: '6 to 8 Weeks Prior',
          title: 'Choose Celebration Theme & Secure Space',
          description: 'Reserve private room, rooftop venue, or party lounge.',
          completed: false,
          category: 'logistics',
        },
        {
          id: 'ms-b-2',
          phase: '1_to_2_months',
          timeframeLabel: '4 Weeks Prior',
          title: 'Design Cake & Catering Package',
          description: 'Order bespoke custom cake and curate beverage service.',
          completed: false,
          category: 'vendor',
        },
        {
          id: 'ms-b-3',
          phase: 'final_weeks',
          timeframeLabel: '1 to 2 Weeks Prior',
          title: 'Send Digital Invites & Collect RSVPs',
          description: 'Confirm party games, curated music playlist, and party favors.',
          completed: false,
          category: 'guest',
        },
        {
          id: 'ms-b-4',
          phase: 'day_of',
          timeframeLabel: 'Day Of Celebration',
          title: 'Setup Decor, Balloon Arch & Cake Arrival',
          description: 'Greet guests, conduct party games, and present cake cutting.',
          completed: false,
          category: 'logistics',
        },
      ];
    }

    // Community Events
    return [
      {
        id: 'ms-c-1',
        phase: '6_months_plus',
        timeframeLabel: '4 to 6 Months Prior',
        title: 'Submit Municipal Permits & Park Approvals',
        description: 'File noise variances, street closure, and public safety permits.',
        completed: false,
        category: 'logistics',
      },
      {
        id: 'ms-c-2',
        phase: '3_to_6_months',
        timeframeLabel: '2 to 3 Months Prior',
        title: 'Sponsor Outreach & Volunteer Recruitment',
        description: 'Publish volunteer sign-up rosters and secure community corporate sponsors.',
        completed: false,
        category: 'guest',
      },
      {
        id: 'ms-c-3',
        phase: '1_to_2_months',
        timeframeLabel: '1 Month Prior',
        title: 'AV Stage Setup & Sanitary Facilities',
        description: 'Contract sound engineering, emergency medical tent, and waste management.',
        completed: false,
        category: 'vendor',
      },
      {
        id: 'ms-c-4',
        phase: 'day_of',
        timeframeLabel: 'Day Of Event',
        title: 'Gates Open & Stage Programming',
        description: 'Volunteer briefing, vendor check-in, live entertainment, and crowd marshaling.',
        completed: false,
        category: 'logistics',
      },
    ];
  }

  private static buildRunOfShow(eventType: EventCategory): DayOfScheduleItem[] {
    if (eventType === 'wedding') {
      return [
        {
          id: 'ros-1',
          time: '09:00 AM',
          activity: 'Bridal Suite Hair & Makeup Load-In',
          leadPerson: 'Lead Stylist & Maid of Honor',
          location: 'Bridal Suite',
          notes: 'Light brunch and mimosa service provided.',
        },
        {
          id: 'ros-2',
          time: '01:30 PM',
          activity: 'Photographer Arrival & First Look Session',
          leadPerson: 'Lead Photographer',
          location: 'Rose Garden Courtyard',
          notes: 'Capture couple portraits, bridal party, and immediate family.',
        },
        {
          id: 'ros-3',
          time: '04:00 PM',
          activity: 'Guest Arrival & Prelude Music',
          leadPerson: 'Lead Usher & String Quartet',
          location: 'Main Sanctuary / Lawn',
          notes: 'Welcome refreshments served; guests directed to seating.',
        },
        {
          id: 'ros-4',
          time: '04:30 PM',
          activity: 'Processional & Ceremony',
          leadPerson: 'Officiant & Wedding Coordinator',
          location: 'Altar',
          notes: 'Processional music, vows exchange, ring ceremony, and recessional.',
        },
        {
          id: 'ros-5',
          time: '05:30 PM',
          activity: 'Cocktail Hour & Passed Hors d’oeuvres',
          leadPerson: 'Catering Captain',
          location: 'Terrace Pavilion',
          notes: 'Signature cocktails; acoustic duo performance.',
        },
        {
          id: 'ros-6',
          time: '06:45 PM',
          activity: 'Grand Reception Entrance & First Dance',
          leadPerson: 'DJ / Master of Ceremonies',
          location: 'Grand Ballroom',
          notes: 'Welcome toast by father of the bride followed by first dance.',
        },
        {
          id: 'ros-7',
          time: '07:15 PM',
          activity: 'Dinner Service & Speeches',
          leadPerson: 'Executive Chef & Best Man',
          location: 'Grand Ballroom',
          notes: 'Three-course plated dinner; best man and maid of honor toasts.',
        },
        {
          id: 'ros-8',
          time: '08:30 PM',
          activity: 'Cake Cutting & Open Dance Floor',
          leadPerson: 'DJ & Event Coordinator',
          location: 'Grand Ballroom',
          notes: 'Bouquet toss and late-night slider snacks at 10:30 PM.',
        },
      ];
    }

    if (eventType === 'birthday') {
      return [
        {
          id: 'ros-b-1',
          time: '02:00 PM',
          activity: 'Venue Access & Decor Setup',
          leadPerson: 'Party Host & Decor Crew',
          location: 'Main Party Lounge',
          notes: 'Assemble balloon installation, photo backdrop, and guest table centerpieces.',
        },
        {
          id: 'ros-b-2',
          time: '03:30 PM',
          activity: 'Cake & Beverage Delivery',
          leadPerson: 'Bakery Courier & Bartender',
          location: 'Dessert Station',
          notes: 'Verify tiered cake temperature and chill sparkling beverages.',
        },
        {
          id: 'ros-b-3',
          time: '04:30 PM',
          activity: 'Guest Welcome & Signature Punch Bar',
          leadPerson: 'Party Host',
          location: 'Lounge Foyer',
          notes: 'Distribute party badges and start upbeat curated playlist.',
        },
        {
          id: 'ros-b-4',
          time: '06:00 PM',
          activity: 'Trivia & Interactive Group Games',
          leadPerson: 'MC / Game Host',
          location: 'Activity Floor',
          notes: 'Milestone memory trivia and customized prize giveaways.',
        },
        {
          id: 'ros-b-5',
          time: '07:30 PM',
          activity: 'Dinner Buffet & Social Mingle',
          leadPerson: 'Catering Lead',
          location: 'Dining Buffet',
          notes: 'Warm buffet service with vegetarian and gluten-free stations.',
        },
        {
          id: 'ros-b-6',
          time: '08:45 PM',
          activity: 'Candle Lighting & Birthday Toast',
          leadPerson: 'Guest of Honor & Family',
          location: 'Dessert Station',
          notes: 'Sing celebration anthem, photos, and cake distribution.',
        },
      ];
    }

    // Community Events
    return [
      {
        id: 'ros-c-1',
        time: '07:00 AM',
        activity: 'Volunteer Check-in & Perimeter Security Marshaling',
        leadPerson: 'Volunteer Director & Safety Officer',
        location: 'Volunteer Command Tent',
        notes: 'Hand out high-visibility vests, walkie-talkies, and zone assignments.',
      },
      {
        id: 'ros-c-2',
        time: '08:30 AM',
        activity: 'Food Trucks & Exhibitor Booth Load-In',
        leadPerson: 'Logistics Coordinator',
        location: 'Vendor Alley',
        notes: 'Enforce electrical health inspections and fire extinguisher placement.',
      },
      {
        id: 'ros-c-3',
        time: '10:00 AM',
        activity: 'Public Gates Open & Welcome Address',
        leadPerson: 'City Council Representative & MC',
        location: 'Main Festival Stage',
        notes: 'Opening remarks, national anthem, and kickoff of festival activities.',
      },
      {
        id: 'ros-c-4',
        time: '01:00 PM',
        activity: 'Community Talent Showcase & Cultural Performances',
        leadPerson: 'Stage Stage-Manager',
        location: 'Main Festival Stage',
        notes: 'Local youth performances, cultural dances, and sponsor recognitions.',
      },
      {
        id: 'ros-c-5',
        time: '05:00 PM',
        activity: 'Fundraiser Grand Raffle & Award Ceremony',
        leadPerson: 'Foundation Chairperson',
        location: 'Main Stage',
        notes: 'Announce total funds raised and community champion honorees.',
      },
      {
        id: 'ros-c-6',
        time: '07:00 PM',
        activity: 'Event Concludes & Orderly Breakdown',
        leadPerson: 'Sanitation Team & Security Lead',
        location: 'All Zones',
        notes: 'Trash sweep, barricade removal, and street reopening by 09:00 PM.',
      },
    ];
  }
}
