/**
 * @file PlanAura Timeline & Run-of-Show Engine
 * @description Generates multi-phase milestone countdowns and day-of hour-by-hour itineraries.
 * @module server/modules/timeline/timelineEngine
 */

import { TimelineConflictFault } from '../../errors/PlannerError.js';
import { EventCategory } from '../budget/budgetEngine.js';
import {
  MILESTONE_TEMPLATES,
  RUN_OF_SHOW_TEMPLATES,
  MilestoneTemplate,
  DayOfScheduleTemplate,
} from './timelineTemplates.js';

export type Milestone = MilestoneTemplate;
export type DayOfScheduleItem = DayOfScheduleTemplate;

export interface TimelinePackage {
  eventType: EventCategory;
  eventDate: string;
  milestones: Milestone[];
  dayOfRunOfShow: DayOfScheduleItem[];
  daysRemaining: number;
}

/**
 * Computational engine responsible for milestone sequencing and day-of execution timelines.
 */
export class TimelineEngine {
  /**
   * Generates a comprehensive milestone countdown roadmap and day-of run-of-show schedule.
   * @param eventType - Event category ('wedding' | 'birthday' | 'community')
   * @param eventDateStr - ISO date string of the event target date
   * @returns Complete timeline package with countdowns and schedules
   * @throws {TimelineConflictFault} When eventDateStr is unparseable or invalid
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

  /**
   * Retrieves category-specific milestone checklist templates.
   * @param eventType - Event category
   * @param _eventDate - Event target date object
   * @returns Array of milestone checklists
   */
  private static buildMilestones(eventType: EventCategory, _eventDate: Date): Milestone[] {
    const templates = MILESTONE_TEMPLATES[eventType] || MILESTONE_TEMPLATES.wedding;
    return JSON.parse(JSON.stringify(templates));
  }

  /**
   * Retrieves category-specific day-of run-of-show itinerary templates.
   * @param eventType - Event category
   * @returns Array of schedule line items
   */
  private static buildRunOfShow(eventType: EventCategory): DayOfScheduleItem[] {
    const templates = RUN_OF_SHOW_TEMPLATES[eventType] || RUN_OF_SHOW_TEMPLATES.wedding;
    return JSON.parse(JSON.stringify(templates));
  }
}
