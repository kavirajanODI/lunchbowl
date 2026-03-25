
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import FoodService from 'services/MyPlansApi/FoodService';
import { useAuth } from './AuthContext';
import { useMenu } from './MenuContext';

type Meal = {
  childId: string;
  date: string;
  food: string;
};

type ChildWithMeals = {
  id: string;
  name: string;
  meals: Meal[];
};

type FoodContextType = {
  foodList: ChildWithMeals[];
  loading: boolean;
  onViewFoodList: () => Promise<void>;
};

const FoodContext = createContext<FoodContextType | undefined>(undefined);

export const FoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userId } = useAuth();
  const { childrenData } = useMenu();

  const [foodList, setFoodList] = useState<ChildWithMeals[]>([]);
  const [loading, setLoading] = useState(false);

  const onViewFoodList = useCallback(async () => {
    try {
      if (!userId) return;

      setLoading(true);
      const response = await FoodService.getAllFoods('get-saved-meals', userId);
      const menuSelections = response?.data?.menuSelections;

      if (menuSelections && typeof menuSelections === 'object') {
        const meals: Meal[] = [];

        Object.entries(menuSelections).forEach(([date, childMeals]) => {
          Object.entries(childMeals as Record<string, string>).forEach(([childId, mealName]) => {
            meals.push({ childId, date, food: mealName });
          });
        });

        const mergedMeals: ChildWithMeals[] = childrenData.map(child => ({
          ...child,
          meals: meals.filter(meal => meal.childId === child.id),
        }));

        setFoodList(mergedMeals);
      } else {
        console.error('Invalid food data format:', response);
      }
    } catch (error) {
      console.error('Error fetching food list:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, childrenData]);

  // 🔹 Automatically fetch foodList when provider mounts or user/children change
  useEffect(() => {
    if (userId && childrenData.length) {
      onViewFoodList();
    }
    
  }, [userId, childrenData, onViewFoodList]);

  return (
    <FoodContext.Provider value={{ foodList, loading, onViewFoodList }}>
      {children}
    </FoodContext.Provider>
  );
};

export const useFood = () => {
  const context = useContext(FoodContext);
  if (!context) throw new Error('useFood must be used within a FoodProvider');
  return context;
};
