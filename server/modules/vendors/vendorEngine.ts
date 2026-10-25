/**
 * @file PlanAura Vendor Lifecycle & Checklist Engine
 * @description Manages procurement pipelines, contract checkpoints, and vendor readiness scores.
 * @module server/modules/vendors/vendorEngine
 */

import { VendorValidationFault } from '../../errors/PlannerError.js';
import { EventCategory } from '../budget/budgetEngine.js';
import { DEFAULT_VENDOR_CATALOG, VendorItem, VendorStatus } from './vendorTemplates.js';

export type { VendorItem, VendorStatus };

export interface VendorPipelineMetrics {
  totalVendors: number;
  bookedCount: number;
  pendingCount: number;
  percentReady: number;
  totalCommittedAmount: number;
  totalDepositsPaid: number;
  remainingLiability: number;
}

/**
 * Enterprise vendor procurement manager handling lifecycle stage transitions and financial liabilities.
 */
export class VendorEngine {
  /**
   * Initializes standard vendor checklist tailored to the event category.
   * @param eventType - Event category ('wedding' | 'birthday' | 'community')
   * @returns Array of initialized vendor items with unique IDs
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
   * @param vendors - Current array of vendor items
   * @param vendorId - ID of vendor to update
   * @param newStatus - Target lifecycle state
   * @param updatedValues - Optional financial or contract adjustments
   * @returns Updated array of vendors
   * @throws {VendorValidationFault} When vendorId is not found in the array
   */
  public static updateVendorStatus(
    vendors: VendorItem[],
    vendorId: string,
    newStatus: VendorStatus,
    updatedValues?: Partial<
      Pick<VendorItem, 'quoteAmount' | 'depositAmount' | 'depositPaid' | 'contractSigned'>
    >
  ): VendorItem[] {
    const validStatuses: VendorStatus[] = [
      'contacted',
      'quoted',
      'contract_pending',
      'booked',
      'paid',
    ];
    if (!validStatuses.includes(newStatus)) {
      throw new VendorValidationFault(`Invalid vendor status '${newStatus}'.`, {
        newStatus,
        validStatuses,
      });
    }

    const index = vendors.findIndex((v) => v.id === vendorId);
    if (index === -1) {
      throw new VendorValidationFault(
        `Vendor with id '${vendorId}' not found in active checklist.`,
        {
          vendorId,
        }
      );
    }

    const current = vendors[index];
    const quoteAmount = updatedValues?.quoteAmount ?? current.quoteAmount;
    const depositAmount = updatedValues?.depositAmount ?? current.depositAmount;
    const depositPaid = updatedValues?.depositPaid ?? current.depositPaid;
    const contractSigned = updatedValues?.contractSigned ?? current.contractSigned;

    // Financial balance calculation
    let balanceRemaining = quoteAmount;
    if (newStatus === 'paid') {
      balanceRemaining = 0;
    } else if (depositPaid) {
      balanceRemaining = Math.max(0, quoteAmount - depositAmount);
    }

    const updatedItem: VendorItem = {
      ...current,
      status: newStatus,
      quoteAmount,
      depositAmount,
      depositPaid: newStatus === 'paid' ? true : depositPaid,
      contractSigned: newStatus === 'booked' || newStatus === 'paid' ? true : contractSigned,
      balanceRemaining,
    };

    const nextList = [...vendors];
    nextList[index] = updatedItem;
    return nextList;
  }

  /**
   * Computes holistic pipeline KPIs including booked ratio, deposit liabilities, and committed spends.
   * @param vendors - Array of vendor items
   * @returns Pipeline metrics and readiness percentages
   */
  public static computeMetrics(vendors: VendorItem[]): VendorPipelineMetrics {
    const totalVendors = vendors.length;
    if (totalVendors === 0) {
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
    let totalCommittedAmount = 0;
    let totalDepositsPaid = 0;
    let remainingLiability = 0;

    for (const v of vendors) {
      if (v.status === 'booked' || v.status === 'paid') {
        bookedCount++;
      } else {
        pendingCount++;
      }

      totalCommittedAmount += v.quoteAmount;
      if (v.depositPaid) {
        totalDepositsPaid += v.depositAmount;
      }
      remainingLiability += v.balanceRemaining;
    }

    const percentReady = Math.round((bookedCount / totalVendors) * 100);

    return {
      totalVendors,
      bookedCount,
      pendingCount,
      percentReady,
      totalCommittedAmount,
      totalDepositsPaid,
      remainingLiability,
    };
  }
}
