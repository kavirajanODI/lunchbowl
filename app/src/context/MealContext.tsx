import React, {createContext, useContext, useState, useEffect} from 'react';
import MealService from 'services/MealService/mealService';
import {IMAGE_BASE_URL} from '../config/apiConfig';
import { useNetwork } from '../hooks/useNetwork';

const defaultMealImage = require('../assets/images/Default/default.png');

type Meal = {
  id: string;
  title: string;
  description: string;
  image: any;
  dishImage2?: any;
  nutritionValues: any[];
  cuisine: string;
  ingredients?: any;
};

type MealContextType = {
  meals: Meal[];
  categories: {
    dishImage2: unknown;
    title: string;
    image: any;
  }[];
  loading: boolean;
  error: string | null;
  refreshMeals: () => Promise<void>;
};

const MealContext = createContext<MealContextType | undefined>(undefined);

export const MealProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const data: any = await MealService.getAllMealsList();

      if (Array.isArray(data)) {
        const activeMeals = data.filter(
          (meal: any) => meal.status === 'active',
        );

        const mappedMeals: Meal[] = activeMeals.map((meal: any) => {
          const imageSource = meal.image
            ? meal.image.startsWith('http')
              ? {uri: meal.image}
              : {uri: `${IMAGE_BASE_URL}${meal.image}`}
            : defaultMealImage;

          const dishImage2Source = meal.dishImage2
            ? meal.dishImage2.startsWith('http')
              ? {uri: meal.dishImage2}
              : {uri: `${IMAGE_BASE_URL}${meal.dishImage2}`}
            : null;

          return {
            id: meal._id,
            title: meal.primaryDishTitle,
            description: meal.shortDescription || meal.description,
            image: imageSource,
            dishImage2: dishImage2Source,
            nutritionValues: meal.nutritionValues || [],
            cuisine: meal.cuisine || 'Other',
            ingredients: meal.Idescription || '',
          };
        });

        setMeals(mappedMeals);
        const cuisineMap: Record<string, any> = {};
        mappedMeals.forEach(meal => {
          if (!cuisineMap[meal.cuisine]) {
            cuisineMap[meal.cuisine] = {
              title: meal.cuisine,
              image: meal.image || defaultMealImage,
              dishImage2: meal.dishImage2 || meal.image || defaultMealImage, 
            };
          }
        });

        setCategories([
          {
            title: 'All',
            image: defaultMealImage,
            dishImage2: defaultMealImage, 
          },
          ...Object.values(cuisineMap),
        ]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load meals');
    } finally {
      setLoading(false);
    }
  };

  useNetwork({ onReconnect: fetchMeals });
  useEffect(() => {
    fetchMeals();
  }, []);


  return (
    <MealContext.Provider
      value={{
        meals,
        categories,
        loading,
        error,
        refreshMeals: fetchMeals,
      }}>
      {children}
    </MealContext.Provider>
  );
};

export const useMeals = () => {
  const ctx = useContext(MealContext);
  if (!ctx) throw new Error('useMeals must be used inside MealProvider');
  return ctx;
};


