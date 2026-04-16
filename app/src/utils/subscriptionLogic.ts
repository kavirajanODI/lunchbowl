import {getNextCalendarDay} from './dateUtils';

export type SubscriptionTab = 'active' | 'upcoming';

export type SubscriptionItem = {
  _id?: string;
  planId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  children?: any[];
};

const toLocalYMD = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const asDate = (value?: string): Date | null => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d;
};

export const classifySubscription = (
  subscription: SubscriptionItem,
  today: Date = new Date(),
): SubscriptionTab | 'expired' | null => {
  const start = asDate(subscription.startDate);
  const end = asDate(subscription.endDate);
  if (!start || !end) return null;
  const now = new Date(today);
  now.setHours(0, 0, 0, 0);
  if (now >= start && now <= end) return 'active';
  if (now < start) return 'upcoming';
  return 'expired';
};

export const getSubscriptionBuckets = (
  subscriptions: SubscriptionItem[] = [],
  today: Date = new Date(),
) => {
  const activeCandidates = subscriptions
    .filter(s => classifySubscription(s, today) === 'active')
    .sort(
      (a, b) =>
        (asDate(b.startDate)?.getTime() ?? 0) -
        (asDate(a.startDate)?.getTime() ?? 0),
    );

  const upcomingSubscriptions = subscriptions
    .filter(s => classifySubscription(s, today) === 'upcoming')
    .sort(
      (a, b) =>
        (asDate(a.startDate)?.getTime() ?? 0) -
        (asDate(b.startDate)?.getTime() ?? 0),
    );

  return {
    activeSubscription: activeCandidates[0] ?? null,
    upcomingSubscriptions,
    upcomingSubscription: upcomingSubscriptions[0] ?? null,
    hasMultipleActive: activeCandidates.length > 1,
  };
};

export const resolveSelectedSubscription = (
  tab: SubscriptionTab,
  activeSubscription: SubscriptionItem | null,
  upcomingSubscriptions: SubscriptionItem[] = [],
): SubscriptionItem | null => {
  if (tab === 'active') {
    return activeSubscription ?? upcomingSubscriptions[0] ?? null;
  }
  return upcomingSubscriptions[0] ?? activeSubscription ?? null;
};

export const calculateRenewalStartDate = ({
  today = new Date(),
  activeSubscriptionEndDate,
}: {
  today?: Date;
  activeSubscriptionEndDate?: string;
}): Date => {
  const activeEnd = asDate(activeSubscriptionEndDate);
  if (activeEnd) {
    activeEnd.setDate(activeEnd.getDate() + 1);
    activeEnd.setHours(0, 0, 0, 0);
    return activeEnd;
  }
  return getNextCalendarDay(today);
};

export const calculateEndDateByWorkingDays = ({
  startDate,
  workingDays,
  holidays = [],
}: {
  startDate: Date;
  workingDays: number;
  holidays?: {date: string}[];
}): Date => {
  const holidaySet = new Set(holidays.map(h => h.date));
  let count = 0;
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  while (count < workingDays) {
    const dateStr = toLocalYMD(current);
    const isSunday = current.getDay() === 0;
    const isHoliday = holidaySet.has(dateStr);
    if (!isSunday && !isHoliday) {
      count++;
    }
    if (count < workingDays) {
      current.setDate(current.getDate() + 1);
    }
  }

  return current;
};

export const getSubscriptionWorkingDates = ({
  startDate,
  endDate,
  holidays = [],
}: {
  startDate?: string;
  endDate?: string;
  holidays?: {date: string}[];
}): string[] => {
  const start = asDate(startDate);
  const end = asDate(endDate);
  if (!start || !end || start > end) return [];

  const holidaySet = new Set(holidays.map(h => h.date));
  const dates: string[] = [];
  const current = new Date(start);
  while (current <= end) {
    const dateStr = toLocalYMD(current);
    if (current.getDay() !== 0 && !holidaySet.has(dateStr)) {
      dates.push(dateStr);
    }
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

export const calculateWalletRedemption = ({
  totalPrice,
  walletPoints,
  applyWallet,
  maxPercent = 0.8,
}: {
  totalPrice: number;
  walletPoints: number;
  applyWallet: boolean;
  maxPercent?: number;
}) => {
  const safePrice = Math.max(0, Number(totalPrice) || 0);
  const safeWallet = Math.max(0, Number(walletPoints) || 0);
  const maxRedeemable = Math.floor(safePrice * maxPercent);
  const redeemedPoints = applyWallet ? Math.min(safeWallet, maxRedeemable) : 0;
  const finalAmount = Math.max(0, safePrice - redeemedPoints);
  return {
    maxRedeemable,
    redeemedPoints,
    remainingWalletPoints: safeWallet - redeemedPoints,
    finalAmount,
  };
};

export const normalizeSelectedChildren = (
  children: Array<{_id?: string; id?: string}> = [],
  selectedIds: string[] = [],
): string[] => {
  const validIds = new Set(
    children.map(c => String(c._id ?? c.id ?? '')).filter(Boolean),
  );
  return selectedIds.filter(id => validIds.has(String(id)));
};

export const toggleChildSelection = (
  selectedIds: string[],
  childId: string,
): string[] =>
  selectedIds.includes(childId)
    ? selectedIds.filter(id => id !== childId)
    : [...selectedIds, childId];
