import {useFocusEffect} from '@react-navigation/native';
import {useAuth} from 'context/AuthContext';
import React, {useCallback, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import SearchBar from 'screens/Dashboard/Components/Search';
import FoodListCard from 'screens/MyPlan/Components/FoodListCard';
import FoodService from 'services/MyPlansApi/FoodService';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import {LoadingModal} from 'components/LoadingModal/LoadingModal';
import {useMenu} from 'context/MenuContext';
import SortButtons from 'components/Filters/SortButtons';
import ToolTipSectionHeader from 'screens/Dashboard/Components/TooltipHeader';
import {questionIcon} from 'styles/svg-icons';
import { useFood } from 'context/FoodContext';

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

const FoodScreen = () => {
  
  //######### STATE ############################################  
  const [searchText, setSearchText] = useState('');
  const {userId} = useAuth();

  //######### GET FOOD VIA CONTEXT ##############################
  const {foodList, loading, onViewFoodList} = useFood();
console.log(
  "foodlist-------------------------",
  JSON.stringify(foodList, null, 2)
);

  //######### HOOKS ############################################
  const {childrenData} = useMenu();
  console.log('childrensData----------------', childrenData);

  useFocusEffect(
    useCallback(() => {
      onViewFoodList();
    }, [userId]),
  );



  const [sortKey, setSortKey] = useState<string>('');

  const getSortedFoodList = () => {
    let sorted = [...foodList];

    if (sortKey === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortKey === 'status') {
      sorted.sort((a, b) => b.meals.length - a.meals.length);
    } else if (sortKey === 'date') {
      sorted.sort((a, b) => {
        const dateA = a.meals[0]?.date
          ? new Date(a.meals[0].date).getTime()
          : 0;
        const dateB = b.meals[0]?.date
          ? new Date(b.meals[0].date).getTime()
          : 0;
        return dateA - dateB;
      });
    }

    return sorted;
  };
  //######### RENDER ####################################
  return (
    <ThemeGradientBackground>
      <LoadingModal loading={loading} setLoading={() => {}} />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <HeaderBackButton title="My Saved Meals" />
          <SearchBar value={searchText} onChangeText={setSearchText} />
          <ToolTipSectionHeader
            title="Sort your Food List by"
            tooltipText="You can sort your saved meals by Child Name, Status (number of meals), or Date."
            icon={questionIcon}
          />
          <SortButtons onSort={setSortKey} />
          {getSortedFoodList()
            .filter(
              child =>
                child.name.toLowerCase().includes(searchText.toLowerCase()) ||
                child.meals.some(meal =>
                  meal.food.toLowerCase().includes(searchText.toLowerCase()),
                ),
            )
            .map(child => {
              const filteredMeals = child.meals.filter(meal =>
                meal.food.toLowerCase().includes(searchText.toLowerCase()),
              );

              return (
                <FoodListCard
                  key={child.id}
                  childName={child.name}
                  meals={filteredMeals}
                />
              );
            })}
        </ScrollView>
      </View>
    </ThemeGradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('5%'),
    marginBottom: wp('20%'),
  },
});

export default FoodScreen;
