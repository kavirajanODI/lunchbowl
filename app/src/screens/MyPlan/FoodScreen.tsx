import {useFocusEffect} from '@react-navigation/native';
import {useAuth} from 'context/AuthContext';
import React, {useCallback, useState} from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import SearchBar from 'screens/Dashboard/Components/Search';
import FoodListCard from 'screens/MyPlan/Components/FoodListCard';
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
import {useFood} from 'context/FoodContext';
import {useDate} from 'context/calenderContext';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import PrimaryButton from 'components/buttons/PrimaryButton';
import SecondaryButton from 'components/buttons/SecondaryButton';

const FoodScreen = () => {
  //######### STATE ############################################
  const [searchText, setSearchText] = useState('');
  const [sortKey, setSortKey] = useState<string>('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedChildFilters, setSelectedChildFilters] = useState<string[]>([]);
  const [pendingChildFilters, setPendingChildFilters] = useState<string[]>([]);

  const {userId} = useAuth();
  const {foodList, loading, onViewFoodList} = useFood();
  const {childrenData, startDate, endDate, planId} = useMenu();
  const {holidays} = useDate();

  useFocusEffect(
    useCallback(() => {
      onViewFoodList();
    }, [userId]),
  );

  //######### SORT + FILTER ######################################
  const getSortedFoodList = () => {
    let sorted = [...foodList];

    // Apply child name filter
    if (selectedChildFilters.length > 0) {
      sorted = sorted.filter(child =>
        selectedChildFilters.includes(child.id),
      );
    }

    if (sortKey === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortKey === 'cuisine') {
      // Sort alphabetically by the first meal's food name as a cuisine proxy.
      // Full cuisine tagging would require backend metadata on each meal.
      sorted.sort((a, b) => {
        const mealA = a.meals[0]?.food ?? '';
        const mealB = b.meals[0]?.food ?? '';
        return mealA.localeCompare(mealB);
      });
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

  //######### CHILD FILTER MODAL ################################
  const openChildFilter = () => {
    setPendingChildFilters([...selectedChildFilters]);
    setFilterModalVisible(true);
  };

  const togglePendingChild = (id: string) => {
    setPendingChildFilters(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id],
    );
  };

  const applyFilter = () => {
    setSelectedChildFilters(pendingChildFilters);
    setFilterModalVisible(false);
  };

  const clearFilter = () => {
    setPendingChildFilters([]);
    setSelectedChildFilters([]);
    setFilterModalVisible(false);
  };

  //######### RENDER ####################################
  return (
    <ThemeGradientBackground>
      <LoadingModal loading={loading} setLoading={() => {}} />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <HeaderBackButton title="Food List" />
          <SearchBar value={searchText} onChangeText={setSearchText} />
          <ToolTipSectionHeader
            title="Sort your Food List by"
            tooltipText="Filter by child name, sort by cuisine or date."
            icon={questionIcon}
          />
          <SortButtons
            onSort={key => setSortKey(key)}
            onChildFilter={openChildFilter}
            activeSort={sortKey}
          />
          {getSortedFoodList()
            .filter(
              child =>
                child.name
                  .toLowerCase()
                  .includes(searchText.toLowerCase()) ||
                child.meals.some(meal =>
                  meal.food.toLowerCase().includes(searchText.toLowerCase()),
                ),
            )
            .map(child => {
              const filteredMeals = child.meals.filter(
                meal =>
                  meal.food
                    .toLowerCase()
                    .includes(searchText.toLowerCase()) ||
                  !searchText,
              );

              // Sort meals within the child card based on the active sort key
              if (sortKey === 'date') {
                filteredMeals.sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime(),
                );
              } else if (sortKey === 'cuisine') {
                filteredMeals.sort((a, b) => a.food.localeCompare(b.food));
              }

              return (
                <FoodListCard
                  key={child.id}
                  childId={child.id}
                  childName={child.name}
                  subscriptionId={planId}
                  startDate={startDate}
                  endDate={endDate}
                  meals={filteredMeals}
                  userId={userId ?? ''}
                  planId={planId}
                  holidays={holidays}
                  onMealUpdated={onViewFoodList}
                />
              );
            })}
        </ScrollView>
      </View>

      {/* Child Name Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.filterSheet}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Child Name</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            {childrenData.map(child => (
              <TouchableOpacity
                key={child.id}
                style={styles.checkboxRow}
                onPress={() => togglePendingChild(child.id)}>
                <View
                  style={[
                    styles.checkbox,
                    pendingChildFilters.includes(child.id) &&
                      styles.checkboxChecked,
                  ]}>
                  {pendingChildFilters.includes(child.id) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                <Text style={styles.checkboxLabel}>{child.name}</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.filterButtons}>
              <SecondaryButton
                title="Clear All"
                onPress={clearFilter}
                style={{flex: 1, marginRight: wp('2%')}}
              />
              <PrimaryButton
                title="Apply"
                onPress={applyFilter}
                style={{flex: 1}}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ThemeGradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('5%'),
    marginBottom: wp('20%'),
  },
  // Filter modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  filterSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    padding: wp('5%'),
    paddingBottom: hp('4%'),
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  filterTitle: {
    fontSize: wp('4.5%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
  },
  closeBtn: {
    fontSize: wp('5%'),
    color: Colors.bodyText,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.2%'),
  },
  checkbox: {
    width: wp('5%'),
    height: wp('5%'),
    borderWidth: 1.5,
    borderColor: Colors.default,
    borderRadius: wp('1%'),
    marginRight: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: Colors.primaryOrange,
    backgroundColor: Colors.primaryOrange,
  },
  checkmark: {
    color: Colors.white,
    fontSize: wp('3%'),
    fontWeight: '700',
  },
  checkboxLabel: {
    fontSize: wp('4%'),
    color: Colors.bodyText,
    fontFamily: Fonts.Urbanist.regular,
  },
  filterButtons: {
    flexDirection: 'row',
    marginTop: hp('3%'),
  },
});

export default FoodScreen;

