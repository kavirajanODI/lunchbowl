import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from 'context/AuthContext';
import UserService from 'services/userService'; // adjust if your file is named differently

// ---------- Types ----------
export type Child = {
  _id: string;
  childFirstName: string;
  childLastName: string;
  dob: string;
  lunchTime: string;
  school: string;
  location: string;
  childClass: string;
  section: string;
  allergies: string;
};

type ChildContextType = {
  childrenList: Child[];
  setChildrenList: React.Dispatch<React.SetStateAction<Child[]>>;
  loading: boolean;
  refreshChildren: () => Promise<void>;
};

// ---------- Create Context ----------
const ChildContext = createContext<ChildContextType | undefined>(undefined);

// ---------- Provider ----------
export const ChildProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userId } = useAuth();
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchChildren = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const response: any = await UserService.getChildInformation(userId); 
      if (response?.children && Array.isArray(response.children)) {
        setChildrenList(response.children);
      } else {
        setChildrenList([]);
      }
    } catch (error) {
      console.error('Error fetching children data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, [userId]);

  return (
    <ChildContext.Provider
      value={{
        childrenList,
        setChildrenList,
        loading,
        refreshChildren: fetchChildren,
      }}
    >
      {children}
    </ChildContext.Provider>
  );
};

// ---------- Hook ----------
export const useChildData = () => {
  const context = useContext(ChildContext);
  if (!context) {
    throw new Error('useChildData must be used within a ChildProvider');
  }
  return context;
};
