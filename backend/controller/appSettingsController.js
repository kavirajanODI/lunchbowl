/**
 * App Settings Controller
 *
 * Serves runtime-configurable business logic values from environment variables.
 * The dashboard can override these values in the future by updating .env and
 * restarting the server (or via a DB-backed settings collection).
 *
 * All values have sensible hard-coded defaults so the app works even when the
 * env vars are not set.
 */

/**
 * Safely parse an environment variable as a number with a default fallback.
 * Using `?? default` instead of `|| default` ensures that env values of '0'
 * are respected (Number('0') === 0, which is falsy but valid).
 */
const envNumber = (key, defaultValue) => {
  const val = process.env[key];
  if (val == null || val === '') return defaultValue;
  const parsed = Number(val);
  return isNaN(parsed) ? defaultValue : parsed;
};

const getAppSettings = (req, res) => {
  try {
    const settings = {
      // ── Pricing ────────────────────────────────────────────────────────────
      pricePerDayPerChild: envNumber('PRICE_PER_DAY_PER_CHILD', 200),

      // ── Plan durations (working days) ───────────────────────────────────────
      planDurations: {
        oneMonth:    envNumber('PLAN_DAYS_1_MONTH', 22),
        threeMonths: envNumber('PLAN_DAYS_3_MONTHS', 66),
        sixMonths:   envNumber('PLAN_DAYS_6_MONTHS', 132),
      },

      // ── Single-child discount tiers (%) ────────────────────────────────────
      singleChildDiscounts: {
        oneMonth:    envNumber('DISCOUNT_SINGLE_1M', 0),
        threeMonths: envNumber('DISCOUNT_SINGLE_3M', 5),
        sixMonths:   envNumber('DISCOUNT_SINGLE_6M', 10),
      },

      // ── Multi-child (≥ 2) discount tiers (%) ───────────────────────────────
      multiChildDiscounts: {
        oneMonth:    envNumber('DISCOUNT_MULTI_1M', 5),
        threeMonths: envNumber('DISCOUNT_MULTI_3M', 15),
        sixMonths:   envNumber('DISCOUNT_MULTI_6M', 20),
      },

      // ── Misc ────────────────────────────────────────────────────────────────
      // Minimum children required to qualify for multi-child pricing
      multiChildThreshold: envNumber('MULTI_CHILD_THRESHOLD', 2),

      // Price per child for a single holiday meal booking
      holidayMealPricePerChild: envNumber('HOLIDAY_MEAL_PRICE_PER_CHILD', 200),
    };

    return res.status(200).json({ success: true, data: settings });
  } catch (err) {
    console.error('getAppSettings error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load app settings' });
  }
};

module.exports = { getAppSettings };
