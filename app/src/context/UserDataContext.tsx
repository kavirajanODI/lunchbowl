import React, {createContext, useContext, useState, useEffect} from 'react';
// import UserService from 'services/UserService';
import {useAuth} from 'context/AuthContext';
import UserService from 'services/userService';

type Child = {
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

type ParentDetails = {
  fatherFirstName: string;
  fatherLastName: string;
  motherFirstName: string;
  motherLastName: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  email: string;
  country: string;
};

type SubscriptionPlan = {
  planId: string;
  startDate: string;
  endDate: string;
  workingDays: number;
  price: number;
  paymentMethod: string;
  paymentDate: string;
  orderId: string;
  transactionId: string;
};

type ProfileData = {
  parentDetails: ParentDetails;
  subscriptionPlan: SubscriptionPlan;
  subscriptionCount: number;
  step: number;
  paymentStatus: string;
  children: Child[];
};

type UserProfileContextType = {
  profileData: ProfileData | null;
  setProfileData: (data: ProfileData | null) => void;
  loading: boolean;
  refreshProfileData: () => Promise<void>;
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(
  undefined,
);

export const UserProfileProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const {userId} = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfileData = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const response: any = await UserService.getRegisteredUSerData(userId);
      if (response && response.data) {
        setProfileData(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  return (
    <UserProfileContext.Provider
      value={{
        profileData,
        setProfileData,
        loading,
        refreshProfileData: fetchProfileData,
      }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context)
    throw new Error('useUserProfile must be used within UserProfileProvider');
  return context;
};
