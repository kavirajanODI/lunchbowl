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

const getAppSettings = (req, res) => {
  try {
    const settings = {
      // ── Pricing ────────────────────────────────────────────────────────────
      pricePerDayPerChild: Number(process.env.PRICE_PER_DAY_PER_CHILD) || 200,

      // ── Plan durations (working days) ───────────────────────────────────────
      planDurations: {
        oneMonth:    Number(process.env.PLAN_DAYS_1_MONTH)  || 22,
        threeMonths: Number(process.env.PLAN_DAYS_3_MONTHS) || 66,
        sixMonths:   Number(process.env.PLAN_DAYS_6_MONTHS) || 132,
      },

      // ── Single-child discount tiers (%) ────────────────────────────────────
      singleChildDiscounts: {
        oneMonth:    Number(process.env.DISCOUNT_SINGLE_1M)  || 0,
        threeMonths: Number(process.env.DISCOUNT_SINGLE_3M)  || 5,
        sixMonths:   Number(process.env.DISCOUNT_SINGLE_6M)  || 10,
      },

      // ── Multi-child (≥ 2) discount tiers (%) ───────────────────────────────
      multiChildDiscounts: {
        oneMonth:    Number(process.env.DISCOUNT_MULTI_1M)  || 5,
        threeMonths: Number(process.env.DISCOUNT_MULTI_3M)  || 15,
        sixMonths:   Number(process.env.DISCOUNT_MULTI_6M)  || 20,
      },

      // ── Misc ────────────────────────────────────────────────────────────────
      // Minimum children required to qualify for multi-child pricing
      multiChildThreshold: Number(process.env.MULTI_CHILD_THRESHOLD) || 2,

      // Price per child for a single holiday meal booking
      holidayMealPricePerChild: Number(process.env.HOLIDAY_MEAL_PRICE_PER_CHILD) || 200,
    };

    return res.status(200).json({ success: true, data: settings });
  } catch (err) {
    console.error('getAppSettings error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load app settings' });
  }
};

module.exports = { getAppSettings };
