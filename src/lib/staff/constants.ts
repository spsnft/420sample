// Fixed per the v1 spec — not per-client, not stored in the DB. Computed on
// the fly from Purchase.quantity against a prescription_id.
export const MONTHLY_QUOTA_GRAMS = 30;

// Ratio of the monthly quota at which the UI switches from the "safe" to the
// "approaching limit" visual state.
export const QUOTA_WARNING_RATIO = 0.8;
