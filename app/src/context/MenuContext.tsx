import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import UserService from 'services/userService';
import RegistrationService from 'services/RegistartionService/registartion';
import {useAuth} from './AuthContext';
import {
  getSubscriptionBuckets,
  SubscriptionItem,
  SubscriptionTab,
} from 'utils/subscriptionLogic';
interface Child {
  id: string;
  name: string;
}

interface MenuContextType {
  childrenData: Child[];
  startDate: string;
  endDate: string;
  planId: string;
  selectedTab: SubscriptionTab;
  setSelectedTab: React.Dispatch<React.SetStateAction<SubscriptionTab>>;
  activeSubscription: SubscriptionItem | null;
  upcomingSubscription: SubscriptionItem | null;
  /** All displayable subscriptions (active first, then upcoming in date order). */
  allSubscriptions: SubscriptionItem[];
  /** ID of the subscription currently driving the calendar view. */
  selectedSubscriptionId: string | null;
  /** Switch the calendar to a different subscription without re-fetching. */
  selectSubscription: (id: string) => void;
  fetchChildren: (data: RequestData) => Promise<void>;
}

interface RequestData {
  _id: string | null;
  path?: string;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const toYMD = (dateStr: string): string => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

export const MenuProvider = ({children}: {children: ReactNode}) => {
  const {userId} = useAuth();
  const [childrenData, setChildrenData] = useState<Child[]>([]);
  const [planId, setPlanId] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<SubscriptionTab>('active');
  const [activeSubscription, setActiveSubscription] =
    useState<SubscriptionItem | null>(null);
  const [upcomingSubscription, setUpcomingSubscription] =
    useState<SubscriptionItem | null>(null);
  const [allSubscriptions, setAllSubscriptions] = useState<SubscriptionItem[]>([]);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Apply a subscription's dates/children to the calendar context state.
  const applySubscription = (
    sub: SubscriptionItem | null,
    fallbackUserId?: string,
  ) => {
    if (!sub?.startDate || !sub?.endDate) {
      setStartDate('');
      setEndDate('');
      setPlanId('');
      return;
    }
    setStartDate(toYMD(sub.startDate));
    setEndDate(toYMD(sub.endDate));
    setPlanId((sub._id || sub.planId || '') as string);
    if (Array.isArray(sub.children) && sub.children.length > 0) {
      const formatted = sub.children.map((child: any) => ({
        id: child._id ?? child.id,
        name: `${child.childFirstName?.trim() || ''} ${child.childLastName?.trim() || ''}`.trim(),
      }));
      setChildrenData(formatted);
    } else if (fallbackUserId) {
      // Children not embedded — fetch from dedicated endpoint
      UserService.getChildInformation(fallbackUserId)
        .then((res: any) => {
          const raw: any[] = Array.isArray(res?.children) ? res.children : [];
          setChildrenData(
            raw.map((c: any) => ({
              id: c._id,
              name: `${c.childFirstName?.trim() || ''} ${c.childLastName?.trim() || ''}`.trim(),
            })),
          );
        })
        .catch(() => {});
    }
  };

  /** Switch the calendar to a specific subscription without re-fetching API. */
  const selectSubscription = (id: string) => {
    const sub = allSubscriptions.find(s => (s._id as string) === id) ?? null;
    if (!sub) return;
    setSelectedSubscriptionId(id);
    applySubscription(sub);
  };

  const fetchChildren = async (data: RequestData) => {
    try {
      const id = data._id;
      if (!id) return;
      const response = await RegistrationService.registrationCheck({_id: id, path: 'Step-Check'});
      console.log('📌 Full response:', response);

      const resData = response?.data;
      if (!resData) {
        console.error('No plans data found or response was not successful.');
        return;
      }

      const subs: SubscriptionItem[] = Array.isArray(resData.subscriptions)
        ? resData.subscriptions
        : [];
      const {activeSubscription: activeSub, upcomingSubscription: upcomingSub, upcomingSubscriptions} =
        getSubscriptionBuckets(subs);
      setActiveSubscription(activeSub);
      setUpcomingSubscription(upcomingSub);

      // Build ordered flat list: active first, then upcoming by start date.
      const allSubs: SubscriptionItem[] = [
        ...(activeSub ? [activeSub] : []),
        ...upcomingSubscriptions,
      ];
      setAllSubscriptions(allSubs);

      if (!activeSub && !upcomingSub) {
        setStartDate('');
        setEndDate('');
        setPlanId('');
      }

      // Determine which subscription to display.
      // Preserve the user's current tab selection if it is still valid.
      const defaultSub = activeSub ?? upcomingSubscriptions[0] ?? null;
      const currentSub = selectedSubscriptionId
        ? allSubs.find(s => (s._id as string) === selectedSubscriptionId) ?? null
        : null;
      const subToApply = currentSub ?? defaultSub;

      if (!currentSub && defaultSub) {
        setSelectedSubscriptionId((defaultSub._id as string) ?? null);
      }

      if (subToApply) {
        applySubscription(subToApply, id);
      }

      // (Legacy selectedTab sync — keep active so existing callers still work)
      const nextTab: SubscriptionTab =
        !activeSub && !upcomingSub
          ? selectedTab
          : selectedTab === 'upcoming' && !upcomingSub
          ? 'active'
          : selectedTab === 'active' && !activeSub
          ? 'upcoming'
          : selectedTab;
      if (nextTab !== selectedTab) {
        setSelectedTab(nextTab);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchChildren({
        _id: userId,
      });
    }
  // Intentionally not including selectedTab — switching tabs no longer triggers a re-fetch.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <MenuContext.Provider
      value={{
        childrenData,
        startDate,
        endDate,
        planId,
        selectedTab,
        setSelectedTab,
        activeSubscription,
        upcomingSubscription,
        allSubscriptions,
        selectedSubscriptionId,
        selectSubscription,
        fetchChildren,
      }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
