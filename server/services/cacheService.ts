/**
 * @file PlanAura In-Memory Cache Service
 * @description Provides fast SHA-256 fingerprint caching with TTL eviction for AI plans and calculations.
 */

import crypto from 'crypto';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class CacheService {
  private store: Map<string, CacheEntry<unknown>> = new Map();
  private defaultTtlMs: number;
  private hits: number = 0;
  private misses: number = 0;

  constructor(defaultTtlMs: number = 15 * 60 * 1000) {
    this.defaultTtlMs = defaultTtlMs;
  }

  /**
   * Generates a deterministic SHA-256 hash for any arbitrary payload or object.
   */
  public generateKey(prefix: string, payload: unknown): string {
    const raw = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const hash = crypto.createHash('sha256').update(raw).digest('hex');
    return `${prefix}:${hash}`;
  }

  /**
   * Retrieves a cached value if present and unexpired.
   */
  public get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry) {
      this.misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return entry.value;
  }

  /**
   * Stores a value in the cache with optional custom TTL.
   */
  public set<T>(key: string, value: T, ttlMs?: number): void {
    const effectiveTtl = ttlMs ?? this.defaultTtlMs;
    this.store.set(key, {
      value,
      expiresAt: Date.now() + effectiveTtl,
    });
  }

  /**
   * Clears expired entries to manage memory footprint.
   */
  public prune(): number {
    const now = Date.now();
    let removed = 0;
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
        removed++;
      }
    }
    return removed;
  }

  /**
   * Returns cache diagnostic performance metrics.
   */
  public getStats(): { size: number; hits: number; misses: number; hitRatio: string } {
    const total = this.hits + this.misses;
    const hitRatio = total === 0 ? '100%' : `${((this.hits / total) * 100).toFixed(1)}%`;
    return {
      size: this.store.size,
      hits: this.hits,
      misses: this.misses,
      hitRatio,
    };
  }

  /**
   * Clears the entire cache store.
   */
  public clear(): void {
    this.store.clear();
    this.hits = 0;
    this.misses = 0;
  }
}

export const planCache = new CacheService();
