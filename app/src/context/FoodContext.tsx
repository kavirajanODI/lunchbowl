
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import FoodService from 'services/MyPlansApi/FoodService';
import { useAuth } from './AuthContext';
import { useMenu } from './MenuContext';

type Meal = {
  childId: string;
  date: string;
  food: string;
  deleted?: boolean;
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
  const { childrenData, planId } = useMenu();

  const [foodList, setFoodList] = useState<ChildWithMeals[]>([]);
  const [loading, setLoading] = useState(false);

  const onViewFoodList = useCallback(async () => {
    try {
      if (!userId) return;

      setLoading(true);
      const response = await FoodService.getAllFoods('get-saved-meals', userId);
      // API response: { success, data: { [planId]: { [date]: { [childId]: { mealName, deleted } } } } }
      const data = response?.data;

        if (data && typeof data === 'object') {
          const meals: Meal[] = [];
          const scopedPlanData =
            planId && data[planId] && typeof data[planId] === 'object'
              ? [data[planId]]
              : Object.values(data);

          scopedPlanData.forEach((planDates: any) => {
            if (!planDates || typeof planDates !== 'object') return;
            Object.entries(planDates).forEach(([date, childMeals]) => {
              if (!childMeals || typeof childMeals !== 'object') return;
            Object.entries(childMeals as Record<string, any>).forEach(
              ([childId, mealInfo]) => {
                const mealName =
                  typeof mealInfo === 'string'
                    ? mealInfo
                    : mealInfo?.mealName ?? '';
                // Include all meals; deleted ones shown with strikethrough in UI
                meals.push({
                  childId,
                  date,
                  food: mealName,
                  deleted: mealInfo?.deleted ?? false,
                });
              },
            );
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
  }, [userId, childrenData, planId]);

  // 🔹 Automatically fetch foodList when provider mounts or user/children change
  useEffect(() => {
    if (userId && childrenData.length) {
      onViewFoodList();
    }
    
  }, [userId, childrenData, planId, onViewFoodList]);

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
