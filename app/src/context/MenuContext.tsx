import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import MenuService from 'services/MyPlansApi/MenuService';
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

export const MenuProvider = ({children}: {children: ReactNode}) => {
  const {userId} = useAuth();
  const [childrenData, setChildrenData] = useState<Child[]>([]);
  const [planId, setPlanId] = useState<string>('');

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const fetchChildren = async (data: RequestData) => {
    try {
      const response = await MenuService.getChildren(data);
      console.log('📌 Full response:', response);

      const plans = response?.data?.plans;
      if (response.success && Array.isArray(plans) && plans.length > 0) {
        const plan = plans[0];

        const formattedChildren = (plan.children || []).map((child: any) => ({
          id: child.id,
          name: `${child.firstName?.trim() || ''} ${
            child.lastName?.trim() || ''
          }`.trim(),
        }));

        const formatDate = (dateStr: string) => {
          const date = new Date(dateStr);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return `${year}-${month}-${day}`;
        };

        setStartDate(formatDate(plan.startDate));
        setEndDate(formatDate(plan.endDate));
        setPlanId(plan.id);
        console.log('📌 Formatted children:', formattedChildren);
        setChildrenData(formattedChildren);
      } else {
        console.error('No plans data found or response was not successful.');
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
