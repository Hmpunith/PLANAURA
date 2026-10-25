/**
 * @file PlanAura Vendor Lifecycle & Checklist Engine
 * @description Manages procurement pipelines, contract checkpoints, and vendor readiness scores.
 */

import { VendorValidationFault } from '../../errors/PlannerError.js';
import { EventCategory } from '../budget/budgetEngine.js';

export type VendorStatus = 'contacted' | 'quoted' | 'contract_pending' | 'booked' | 'paid';

export interface VendorItem {
  id: string;
  category: string;
  name: string;
  serviceDescription: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: VendorStatus;
  quoteAmount: number;
  depositPaid: boolean;
  depositAmount: number;
  balanceRemaining: number;
  contractSigned: boolean;
  notes: string;
}

export interface VendorPipelineMetrics {
  totalVendors: number;
  bookedCount: number;
  pendingCount: number;
  percentReady: number;
  totalCommittedAmount: number;
  totalDepositsPaid: number;
  remainingLiability: number;
}

const DEFAULT_VENDOR_CATALOG: Record<EventCategory, Array<Omit<VendorItem, 'id'>>> = {
  wedding: [
    {
      category: 'Venue & Banquet',
      name: 'Primary Reception Hall',
      serviceDescription: 'Ballroom rental with tables, chiavari chairs, and setup.',
      status: 'booked',
      quoteAmount: 8500,
      depositPaid: true,
      depositAmount: 2500,
      balanceRemaining: 6000,
      contractSigned: true,
      notes: 'Final guest count due 14 days prior.',
    },
    {
      category: 'Catering & Spirits',
      name: 'Artisan Culinary Group',
      serviceDescription: 'Plated 3-course dinner, passed hors d’oeuvres, and premium open bar.',
      status: 'contract_pending',
      quoteAmount: 7200,
      depositPaid: false,
      depositAmount: 1800,
      balanceRemaining: 7200,
      contractSigned: false,
      notes: 'Tasting scheduled next Thursday.',
    },
    {
      category: 'Photography & Cinema',
      name: 'Golden Hour Visuals',
      serviceDescription: '8-hour dual photographer package + 4K highlight cinematic reel.',
      status: 'booked',
      quoteAmount: 3800,
      depositPaid: true,
      depositAmount: 1000,
      balanceRemaining: 2800,
      contractSigned: true,
      notes: 'Drone permit verified for sunset shoot.',
    },
    {
      category: 'Floral & Botanical Design',
      name: 'Lush Petal Atelier',
      serviceDescription: 'Bridal bouquets, ceremony arch installation, and 12 table centerpieces.',
      status: 'quoted',
      quoteAmount: 2400,
      depositPaid: false,
      depositAmount: 600,
      balanceRemaining: 2400,
      contractSigned: false,
      notes: 'White peony, eucalyptus, and champagne roses.',
    },
    {
      category: 'Audio & Live Music',
      name: 'Pulse Entertainment DJ Collective',
      serviceDescription: 'Ceremony PA system, wireless mics, cocktail acoustic duo, and reception DJ.',
      status: 'contacted',
      quoteAmount: 1900,
      depositPaid: false,
      depositAmount: 400,
      balanceRemaining: 1900,
      contractSigned: false,
      notes: 'Do-Not-Play list submitted.',
    },
    {
      category: 'Patisserie & Cake',
      name: 'Velvet Crumb Cakes',
      serviceDescription: '3-tiered almond elderflower wedding cake with fresh floral cascading.',
      status: 'quoted',
      quoteAmount: 750,
      depositPaid: false,
      depositAmount: 250,
      balanceRemaining: 750,
      contractSigned: false,
      notes: 'Gluten-free top tier for bride.',
    },
  ],
  birthday: [
    {
      category: 'Celebration Space',
      name: 'Skyline Terrace Lounge',
      serviceDescription: '4-hour private indoor/outdoor loft rental with panoramic skyline views.',
      status: 'booked',
      quoteAmount: 1800,
      depositPaid: true,
      depositAmount: 500,
      balanceRemaining: 1300,
      contractSigned: true,
      notes: 'Outside caterers permitted.',
    },
    {
      category: 'Bespoke Cake & Desserts',
      name: 'Sugar Artistry Studio',
      serviceDescription: 'Custom sculptured milestone birthday cake and matching mini macarons.',
      status: 'contract_pending',
      quoteAmount: 450,
      depositPaid: true,
      depositAmount: 150,
      balanceRemaining: 300,
      contractSigned: false,
      notes: 'Fondant milestone numbers and sparkler candles.',
    },
    {
      category: 'Sound & Lighting',
      name: 'BeatWave Entertainment',
      serviceDescription: 'Club-style lighting rig, subwoofer sound package, and curated party DJ.',
      status: 'booked',
      quoteAmount: 850,
      depositPaid: true,
      depositAmount: 200,
      balanceRemaining: 650,
      contractSigned: true,
      notes: 'Includes interactive karaoke set.',
    },
    {
      category: 'Balloon & Photo Backdrop',
      name: 'AirGlow Balloon Installations',
      serviceDescription: '12-foot organic balloon arch with custom LED neon sign ("Cheers to You").',
      status: 'quoted',
      quoteAmount: 550,
      depositPaid: false,
      depositAmount: 150,
      balanceRemaining: 550,
      contractSigned: false,
      notes: 'Gold chrome and deep emerald color scheme.',
    },
  ],
  community: [
    {
      category: 'Municipal & Regulatory',
      name: 'Department of Parks & Recreation',
      serviceDescription: 'Public park assembly permit, amplified sound permit, and street closure authorization.',
      status: 'booked',
      quoteAmount: 650,
      depositPaid: true,
      depositAmount: 650,
      balanceRemaining: 0,
      contractSigned: true,
      notes: 'Certificate of insurance provided.',
    },
    {
      category: 'Stage & Production AV',
      name: 'AcousticPro Stage Rentals',
      serviceDescription: '24x16 mobile covered hydraulic stage, line array PA, and stage lighting.',
      status: 'contract_pending',
      quoteAmount: 4200,
      depositPaid: false,
      depositAmount: 1000,
      balanceRemaining: 4200,
      contractSigned: false,
      notes: 'Sound check set for 08:30 AM.',
    },
    {
      category: 'Sanitation & Amenities',
      name: 'CleanRest Event Sanitation',
      serviceDescription: '10 portable restrooms, 4 handwash stations, and 6 recycling/trash dumpsters.',
      status: 'booked',
      quoteAmount: 1200,
      depositPaid: true,
      depositAmount: 400,
      balanceRemaining: 800,
      contractSigned: true,
      notes: 'Servicing sweep scheduled mid-day at 02:00 PM.',
    },
    {
      category: 'Emergency & Safety',
      name: 'Apex First-Aid & Security Services',
      serviceDescription: '2 licensed paramedics with mobile first-aid tent and 4 crowd marshals.',
      status: 'quoted',
      quoteAmount: 1500,
      depositPaid: false,
      depositAmount: 300,
      balanceRemaining: 1500,
      contractSigned: false,
      notes: 'Coordinates with local fire marshal.',
    },
  ],
};

export class VendorEngine {
  /**
   * Initializes standard vendor checklist tailored to the event category.
   */
  public static getInitialChecklist(eventType: EventCategory): VendorItem[] {
    const templates = DEFAULT_VENDOR_CATALOG[eventType] || DEFAULT_VENDOR_CATALOG.community;
    return templates.map((tmpl, idx) => ({
      ...tmpl,
      id: `vdr-${eventType}-${idx + 1}`,
    }));
  }

  /**
   * Validates and updates a vendor's lifecycle status, recomputing balance remaining.
   */
  public static updateVendorStatus(
    vendors: VendorItem[],
    vendorId: string,
    newStatus: VendorStatus,
    updatedValues?: Partial<VendorItem>
  ): VendorItem[] {
    const validStatuses: VendorStatus[] = ['contacted', 'quoted', 'contract_pending', 'booked', 'paid'];
    if (!validStatuses.includes(newStatus)) {
      throw new VendorValidationFault(`Invalid vendor status '${newStatus}'.`, { validStatuses });
    }

    let found = false;
    const updated = vendors.map((v) => {
      if (v.id === vendorId) {
        found = true;
        const merged = { ...v, ...updatedValues, status: newStatus };
        if (newStatus === 'paid') {
          merged.depositPaid = true;
          merged.balanceRemaining = 0;
        } else if (merged.depositPaid && merged.quoteAmount > 0) {
          merged.balanceRemaining = Math.max(0, merged.quoteAmount - merged.depositAmount);
        }
        return merged;
      }
      return v;
    });

    if (!found) {
      throw new VendorValidationFault(`Vendor with ID '${vendorId}' not found in checklist.`, {
        vendorId,
      });
    }

    return updated;
  }

  /**
   * Calculates pipeline completion percentages and aggregate financial liabilities.
   */
  public static computeMetrics(vendors: VendorItem[]): VendorPipelineMetrics {
    if (!Array.isArray(vendors) || vendors.length === 0) {
      return {
        totalVendors: 0,
        bookedCount: 0,
        pendingCount: 0,
        percentReady: 0,
        totalCommittedAmount: 0,
        totalDepositsPaid: 0,
        remainingLiability: 0,
      };
    }

    let bookedCount = 0;
    let pendingCount = 0;
    let totalCommitted = 0;
    let totalDeposits = 0;
    let remainingLiability = 0;

    for (const v of vendors) {
      if (v.status === 'booked' || v.status === 'paid') {
        bookedCount++;
      } else {
        pendingCount++;
      }

      totalCommitted += v.quoteAmount;
      if (v.depositPaid) {
        totalDeposits += v.depositAmount;
      }
      remainingLiability += v.balanceRemaining;
    }

    const percentReady = Math.round((bookedCount / vendors.length) * 100);

    return {
      totalVendors: vendors.length,
      bookedCount,
      pendingCount,
      percentReady,
      totalCommittedAmount: totalCommitted,
      totalDepositsPaid: totalDeposits,
      remainingLiability,
    };
  }
}
