import { describe, it, expect } from 'vitest';
import { TimelineEngine } from '../../server/modules/timeline/timelineEngine.js';
import { TimelineConflictFault } from '../../server/errors/PlannerError.js';

describe('TimelineEngine Unit Tests', () => {
  it('generates multi-phase milestones for wedding celebrations', () => {
    const futureDate = new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString();
    const pkg = TimelineEngine.generateTimeline('wedding', futureDate);

    expect(pkg.eventType).toBe('wedding');
    expect(pkg.milestones.length).toBeGreaterThanOrEqual(6);
    expect(pkg.milestones.some((m) => m.phase === '6_months_plus')).toBe(true);
    expect(pkg.milestones.some((m) => m.phase === 'day_of')).toBe(true);
    expect(pkg.daysRemaining).toBeGreaterThanOrEqual(119);
  });

  it('generates a complete hour-by-hour day-of run-of-show for weddings', () => {
    const futureDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();
    const pkg = TimelineEngine.generateTimeline('wedding', futureDate);

    expect(pkg.dayOfRunOfShow.length).toBeGreaterThanOrEqual(5);
    expect(pkg.dayOfRunOfShow[0].time).toBeDefined();
    expect(pkg.dayOfRunOfShow[0].activity).toBeDefined();
    expect(pkg.dayOfRunOfShow[0].leadPerson).toBeDefined();
    expect(pkg.dayOfRunOfShow.some((item) => item.activity.includes('Ceremony'))).toBe(true);
  });

  it('generates customized timeline milestones for birthday parties', () => {
    const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const pkg = TimelineEngine.generateTimeline('birthday', futureDate);

    expect(pkg.eventType).toBe('birthday');
    expect(pkg.milestones.some((m) => m.title.includes('Cake'))).toBe(true);
    expect(pkg.dayOfRunOfShow.some((item) => item.activity.includes('Cake'))).toBe(true);
  });

  it('generates civic permit and safety milestones for community events', () => {
    const futureDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
    const pkg = TimelineEngine.generateTimeline('community', futureDate);

    expect(pkg.eventType).toBe('community');
    expect(pkg.milestones.some((m) => m.title.includes('Permits'))).toBe(true);
    expect(pkg.dayOfRunOfShow.some((item) => item.activity.includes('Volunteer'))).toBe(true);
  });

  it('correctly handles dates occurring today or in the immediate future', () => {
    const todayStr = new Date().toISOString();
    const pkg = TimelineEngine.generateTimeline('wedding', todayStr);
    expect(pkg.daysRemaining).toBe(0);
  });

  it('throws TimelineConflictFault on invalid date strings', () => {
    expect(() => TimelineEngine.generateTimeline('wedding', 'not-a-valid-date')).toThrow(
      TimelineConflictFault
    );
  });
});
