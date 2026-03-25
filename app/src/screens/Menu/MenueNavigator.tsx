import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MealCategoryScreen from './Menu';
import {MealProvider} from 'context/MealContext';
import MealDetailScreen from './MealDetailScreen';

const Stack = createStackNavigator();

const MenueNavigator = () => {
  
  return (
    <MealProvider>
      <Stack.Navigator initialRouteName="Menu">
        <Stack.Screen
          name="Menu"
          component={MealCategoryScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MealDetailScreen"
          component={MealDetailScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </MealProvider>
  );
};

export default MenueNavigator;
