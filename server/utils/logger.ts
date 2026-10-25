/**
 * @file PlanAura Structured Logger Utility
 * @description Provides standardized, typed logging with severity levels and request tracing.
 * @module server/utils/logger
 */

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  requestId?: string;
  context?: Record<string, unknown>;
  error?: Error;
}

/**
 * Structured logger for operational observability across PlanAura services.
 */
export class Logger {
  private static formatEntry(
    level: LogLevel,
    message: string,
    requestId?: string,
    context?: Record<string, unknown>
  ): string {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(requestId ? { requestId } : {}),
      ...(context ? { context } : {}),
    };
    return JSON.stringify(entry);
  }

  /**
   * Logs an informational message.
   * @param message - Descriptive message
   * @param requestId - Optional request tracing identifier
   * @param context - Additional structured metadata
   */
  public static info(message: string, requestId?: string, context?: Record<string, unknown>): void {
    const output = this.formatEntry('INFO', message, requestId, context);
    console.info(output);
  }

  /**
   * Logs an operational warning message.
   * @param message - Warning description
   * @param requestId - Optional request tracing identifier
   * @param context - Additional structured metadata
   */
  public static warn(message: string, requestId?: string, context?: Record<string, unknown>): void {
    const output = this.formatEntry('WARN', message, requestId, context);
    console.warn(output);
  }

  /**
   * Logs an error message with stack trace.
   * @param message - Error summary
   * @param error - Caught error instance
   * @param requestId - Optional request tracing identifier
   * @param context - Additional structured metadata
   */
  public static error(
    message: string,
    error?: unknown,
    requestId?: string,
    context?: Record<string, unknown>
  ): void {
    const errObj =
      error instanceof Error
        ? { message: error.message, stack: error.stack, name: error.name }
        : { raw: error };

    const output = this.formatEntry('ERROR', message, requestId, {
      ...context,
      errorDetails: errObj,
    });
    console.error(output);
  }

  /**
   * Logs a debug trace message in non-production environments.
   * @param message - Diagnostic message
   * @param requestId - Optional request tracing identifier
   * @param context - Additional structured metadata
   */
  public static debug(
    message: string,
    requestId?: string,
    context?: Record<string, unknown>
  ): void {
    if (process.env.NODE_ENV !== 'production') {
      const output = this.formatEntry('DEBUG', message, requestId, context);
      console.info(output);
    }
  }
}
