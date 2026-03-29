import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import UserService from 'services/userService';
import {useAuth} from './AuthContext';
interface Child {
  id: string;
  name: string;
}

interface MenuContextType {
  childrenData: Child[];
  startDate: string;
  endDate: string;
  planId: string;
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

      const subs: any[] = Array.isArray(resData.subscriptions)
        ? resData.subscriptions
        : [];
      const activeSub =
        subs.find((s: any) => s.status === 'active') ??
        subs[subs.length - 1] ??
        null;

      if (activeSub) {
        setStartDate(toYMD(activeSub.startDate));
        setEndDate(toYMD(activeSub.endDate));
        // Use the subscription document's MongoDB _id as the plan identifier
        setPlanId((activeSub._id || activeSub.planId || '') as string);
      } else {
        console.error('No plans data found or response was not successful.');
      }

      const rawChildren: any[] = Array.isArray(resData.children)
        ? resData.children
        : [];
      const formattedChildren = rawChildren.map((child: any) => ({
        id: child._id,
        name: `${child.childFirstName?.trim() || ''} ${
          child.childLastName?.trim() || ''
        }`.trim(),
      }));
      console.log('📌 Formatted children:', formattedChildren);
      setChildrenData(formattedChildren);
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
  }, [userId]);

  return (
    <MenuContext.Provider
      value={{childrenData, startDate, endDate, planId, fetchChildren}}>
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
