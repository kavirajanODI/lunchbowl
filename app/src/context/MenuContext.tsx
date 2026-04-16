import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import UserService from 'services/userService';
import {useAuth} from './AuthContext';
import {
  getSubscriptionBuckets,
  resolveSelectedSubscription,
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

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const fetchChildren = async (data: RequestData) => {
    try {
      const id = data._id;
      if (!id) return;
      const response = await UserService.getRegisteredUSerData(id);
      console.log('📌 Full response:', response);

      const resData = response?.data;
      if (!resData) {
        console.error('No plans data found or response was not successful.');
        return;
      }

      const subs: SubscriptionItem[] = Array.isArray(resData.subscriptions)
        ? resData.subscriptions
        : [];
      const {activeSubscription, upcomingSubscription, upcomingSubscriptions} =
        getSubscriptionBuckets(subs);
      setActiveSubscription(activeSubscription);
      setUpcomingSubscription(upcomingSubscription);

      const nextTab: SubscriptionTab =
        selectedTab === 'upcoming' && !upcomingSubscription
          ? 'active'
          : selectedTab === 'active' && !activeSubscription
          ? 'upcoming'
          : selectedTab;
      if (nextTab !== selectedTab) {
        setSelectedTab(nextTab);
      }

      const selectedSubscription = resolveSelectedSubscription(
        nextTab,
        activeSubscription,
        upcomingSubscriptions,
      );

      let hasSubscriptionChildren = false;
      if (selectedSubscription?.startDate && selectedSubscription?.endDate) {
        setStartDate(toYMD(selectedSubscription.startDate));
        setEndDate(toYMD(selectedSubscription.endDate));
        setPlanId(
          (selectedSubscription._id || selectedSubscription.planId || '') as string,
        );
        if (Array.isArray(selectedSubscription.children)) {
          const formattedChildren = selectedSubscription.children.map(
            (child: any) => ({
              id: child._id ?? child.id,
              name: `${child.childFirstName?.trim() || ''} ${
                child.childLastName?.trim() || ''
              }`.trim(),
            }),
          );
          setChildrenData(formattedChildren);
          hasSubscriptionChildren = formattedChildren.length > 0;
        }
      } else {
        setStartDate('');
        setEndDate('');
        setPlanId('');
      }

      // Fetch children from the dedicated endpoint; account-details does not include them
      if (!hasSubscriptionChildren) {
        const childrenResponse = await UserService.getChildInformation(id);
        const rawChildren: any[] = Array.isArray(childrenResponse?.children)
          ? childrenResponse.children
          : [];
        const formattedChildren = rawChildren.map((child: any) => ({
          id: child._id,
          name: `${child.childFirstName?.trim() || ''} ${
            child.childLastName?.trim() || ''
          }`.trim(),
        }));
        console.log('📌 Formatted children:', formattedChildren);
        setChildrenData(formattedChildren);
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
  }, [userId, selectedTab]);

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
