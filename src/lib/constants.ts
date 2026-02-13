// Registration and Fees
export const REGISTRATION_FEE = 20000; // UGX
export const REFERRAL_BONUS_PERCENTAGE = 0.1; // 10%

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Validation
export const MIN_PASSWORD_LENGTH = 6;
export const MIN_INVESTMENT_SLOTS = 1;

// Payment Types
export const PAYMENT_TYPES = {
  REGISTRATION: 'reg_fee',
  INVESTMENT: 'investment',
  REFERRAL_BONUS: 'referral_bonus',
  DIVIDEND: 'dividend',
} as const;

// Project Status
export const PROJECT_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
} as const;

// Investment Status
export const INVESTMENT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Transaction Status
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

// Format currency
export function formatUGX(amount: number): string {
  return `UGX ${amount.toLocaleString()}`;
}

// Calculate referral bonus
export function calculateReferralBonus(amount: number): number {
  return amount * REFERRAL_BONUS_PERCENTAGE;
}

// Calculate monthly dividend
export function calculateMonthlyDividend(
  investmentAmount: number,
  roiPercentage: number
): number {
  return (investmentAmount * roiPercentage) / 100;
}
