// AIDEV-NOTE: Tier helper — reads ACCOUNT_TIER env var to drive conditional test assertions.
// Valid values: 'free' | 'pro' | 'enterprise'. Defaults to 'pro' when unset (CI / staging default).
// Usage: import { isFree, isPro, isEnterprise, getTier } from '../utils/tierGuard';

export type AccountTier = 'free' | 'pro' | 'enterprise';

export function getTier(): AccountTier {
  const raw = process.env['ACCOUNT_TIER'];
  if (raw === 'free' || raw === 'pro' || raw === 'enterprise') {
    return raw;
  }
  return 'pro';
}

export function isFree(): boolean {
  return getTier() === 'free';
}

export function isPro(): boolean {
  return getTier() === 'pro';
}

export function isEnterprise(): boolean {
  return getTier() === 'enterprise';
}

/**
 * Returns the email and password for the current ACCOUNT_TIER.
 *
 * Resolution order (per tier):
 *   free       → FREE_EMAIL / FREE_PASSWORD
 *   enterprise → ENTERPRISE_EMAIL / ENTERPRISE_PASSWORD (falls back to EMAIL / PASSWORD)
 *   pro        → PRO_EMAIL / PRO_PASSWORD (falls back to EMAIL / PASSWORD)
 *
 * EMAIL / PASSWORD remain the pipeline-injected defaults and always act as pro fallback.
 */
export function getCredentials(): { email: string; password: string } {
  const tier = getTier();

  if (tier === 'free') {
    return {
      email: process.env['FREE_EMAIL'] ?? '',
      password: process.env['FREE_PASSWORD'] ?? '',
    };
  }

  if (tier === 'enterprise') {
    return {
      email: process.env['ENTERPRISE_EMAIL'] ?? process.env['EMAIL'] ?? '',
      password: process.env['ENTERPRISE_PASSWORD'] ?? process.env['PASSWORD'] ?? '',
    };
  }

  // pro (default)
  return {
    email: process.env['PRO_EMAIL'] ?? process.env['EMAIL'] ?? '',
    password: process.env['PRO_PASSWORD'] ?? process.env['PASSWORD'] ?? '',
  };
}
