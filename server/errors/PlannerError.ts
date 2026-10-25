/**
 * @file PlanAura Custom Domain Error Hierarchy
 * @description Provides structured, operational error subclasses for all PlanAura subsystems.
 */

export class PlanAuraFault extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'PLANAURA_INTERNAL_FAULT',
    details?: unknown
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/** Error thrown when budget figures or allocations violate logical bounds. */
export class BudgetValidationFault extends PlanAuraFault {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'BUDGET_VALIDATION_FAULT', details);
  }
}

/** Error thrown when timeline dates or run-of-show milestones conflict. */
export class TimelineConflictFault extends PlanAuraFault {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'TIMELINE_CONFLICT_FAULT', details);
  }
}

/** Error thrown when vendor lifecycle status or contact data is invalid. */
export class VendorValidationFault extends PlanAuraFault {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'VENDOR_VALIDATION_FAULT', details);
  }
}

/** Error thrown when upstream Generative AI services fail or exhaust quotas. */
export class AIServiceFault extends PlanAuraFault {
  constructor(message: string, details?: unknown) {
    super(message, 502, 'AI_SERVICE_FAULT', details);
  }
}

/** Error thrown when client exceeds rate limit quotas. */
export class RateLimitExceededFault extends PlanAuraFault {
  constructor(message: string = 'Too many requests. Please slow down.') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
  }
}

/** Error thrown when a requested event or template resource is not found. */
export class ResourceNotFoundFault extends PlanAuraFault {
  constructor(resource: string, identifier?: string) {
    super(
      `Resource '${resource}' ${identifier ? `(${identifier})` : ''} not found.`,
      404,
      'RESOURCE_NOT_FOUND'
    );
  }
}
