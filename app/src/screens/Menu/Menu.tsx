import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import ErrorMessage from 'components/Error/BoostrapStyleError';
import SectionTitle from 'components/Titles/SectionHeading';
import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import SearchBar from 'screens/Dashboard/Components/Search';
import CategoryItem from './Components/CategoryItem';
import MealCard from './Components/MealCard';

import NoDataFound from 'components/Error/NoDataMessage';
import OfflineNotice from 'components/Error/OfflineNotice';
import {
  CategorySkeleton,
  MealListSkeleton,
} from 'components/skeletons/MealCategorySkeleton';
import { useMeals } from 'context/MealContext';

const MealCategoryScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {meals, categories, loading, error} = useMeals();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMeals = meals.filter(meal => {
    const matchesCategory =
      selectedCategory === 'All' || meal.cuisine === selectedCategory;
    const matchesSearch =
      meal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <ThemeGradientBackground>
      {error && <ErrorMessage error={error} onClose={() => {}} />}

      <View style={styles.container}>
        <HeaderBackButton title="My Plan" />
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <OfflineNotice />
        <SectionTitle>Select your Category</SectionTitle>

        {loading ? (
          <>
            <CategorySkeleton />
            <MealListSkeleton />
          </>
        ) : (
          <>
            <FlatList
              data={categories}
              keyExtractor={item => item.title}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: wp('4%'),
                marginBottom: hp('2%'),
                height: hp('22%'),
              }}
              renderItem={({item}) => (
                <CategoryItem
                  title={item.title}
                  image={item.image}
                  dishImage2={item.dishImage2}
                  selected={item.title === selectedCategory}
                  onPress={() => setSelectedCategory(item.title)}
                />
              )}
            />

            <ScrollView
              contentContainerStyle={styles.mealList}
              showsVerticalScrollIndicator={false}>
              {filteredMeals.length > 0 ? (
                filteredMeals.map(meal => (
                  <MealCard
                    key={meal.id}
                    image={meal.image}
                    title={meal.title}
                    description={meal.description}
                    onPress={() =>
                      navigation.navigate('MealDetailScreen', {mealId: meal.id})
                    }
                  />
                ))
              ) : (
                <NoDataFound message="No meals found for this category." />
              )}
            </ScrollView>
          </>
        )}
      </View>
    </ThemeGradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('5%'),
    marginBottom: '20%',
  },
  mealList: {},
});

export default MealCategoryScreen;
