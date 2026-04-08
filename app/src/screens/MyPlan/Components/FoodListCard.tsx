import React, {useState} from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import Typography from 'components/Text/Typography';
import NoDataMessage from 'components/Error/NoDataMessage';
import {EditIcon} from 'styles/svg-icons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import BottomModal from 'components/Modal/BottomModal';
import PrimaryDropdown from 'components/inputs/PrimaryDropdown';
import PrimaryButton from 'components/buttons/PrimaryButton';
import SecondaryButton from 'components/buttons/SecondaryButton';
import MenuService from 'services/MyPlansApi/MenuService';
import menus from 'services/MenueService/Data/menus.json';

const canEdit = (dateStr: string): boolean => {
  // Next-day logic: a meal is editable only if its date is strictly after today.
  const mealDate = new Date(dateStr);
  mealDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return mealDate > today;
};

const canDelete = (dateStr: string): boolean => {
  // Next-day logic: a meal can be deleted only if its date is strictly after today.
  const mealDate = new Date(dateStr);
  mealDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return mealDate > today;
};

const allMeals = menus.meal_plan.flatMap(day => day.meals);
const mealOptions = allMeals.map(meal => ({label: meal, value: meal}));

interface Meal {
  date: string;
  food: string;
  deleted?: boolean;
}

interface Props {
  childId: string;
  childName: string;
  subscriptionId: string;
  startDate: string;
  endDate: string;
  meals: Meal[];
  userId: string;
  planId: string;
  holidays: {date: string}[];
  onMealUpdated: () => Promise<void>;
}

const formatDisplayDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

const FoodListCard: React.FC<Props> = ({
  childId,
  childName,
  subscriptionId,
  startDate,
  endDate,
  meals,
  userId,
  planId,
  holidays,
  onMealUpdated,
}) => {
  const navigation = useNavigation<any>();
  const [isExpanded, setIsExpanded] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [newMealName, setNewMealName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleEdit = (meal: Meal) => {
    setSelectedMeal(meal);
    setNewMealName(meal.food);
    setEditModalVisible(true);
  };

  const handleDeletePress = (meal: Meal) => {
    setSelectedMeal(meal);
    setDeleteConfirmVisible(true);
  };

  const handleSave = async () => {
    if (!selectedMeal || !newMealName) return;
    setSaving(true);
    try {
      await MenuService.saveMenuSelection({
        _id: userId,
        path: 'save-meals',
        data: {
          userId,
          planId,
          children: [
            {
              childId,
              meals: [
                {
                  mealDate: new Date(selectedMeal.date).toISOString(),
                  mealName: newMealName,
                },
              ],
            },
          ],
        },
      });
      setEditModalVisible(false);
      await onMealUpdated();
    } catch (e) {
      console.error('Save error:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMeal) return;
    setSaving(true);
    try {
      await MenuService.deleteMeal({
        userId,
        subscriptionId,
        childId,
        date: selectedMeal.date,
      });
      setDeleteConfirmVisible(false);
      await onMealUpdated();
    } catch (e) {
      console.error('Delete error:', e);
    } finally {
      setSaving(false);
    }
  };

  const goToWallet = () => {
    navigation.navigate('Home', {screen: 'WalletScreen'});
  };

  /** Holiday / weekend meals were booked via separate payment — no edit/delete/wallet. */
  const isHolidayOrWeekend = (dateStr: string): boolean => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const dow = d.getDay();
    if (dow === 0 || dow === 6) return true; // Sun or Sat
    return holidays.some(h => h.date === dateStr);
  };

  const dateRangeStr =
    startDate && endDate
      ? `(${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)})`
      : '';

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.headerBlock}
        onPress={() => setIsExpanded(prev => !prev)}
        activeOpacity={0.7}>
        <View style={styles.headerRow}>
          <Typography style={styles.header} numberOfLines={1}>
            {childName}
          </Typography>
          <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
        </View>
        {!!dateRangeStr && (
          <Text style={styles.dateRange}>{dateRangeStr}</Text>
        )}
      </TouchableOpacity>

      {isExpanded && (
      <View style={styles.table}>
        <View style={styles.row}>
          <Typography style={[styles.cell, styles.tableHeader]} numberOfLines={1}>
            DATE
          </Typography>
          <Typography style={[styles.cell, styles.tableHeader]} numberOfLines={1}>
            FOOD LIST
          </Typography>
        </View>

        {meals.length === 0 ? (
          <NoDataMessage message="No food items found." />
        ) : (
          meals.map((item, index) => (
            <View key={index}>
              <View style={styles.row}>
                <Typography
                  style={[styles.cell, item.deleted && styles.deletedText]}
                  numberOfLines={1}>
                  {formatDisplayDate(item.date)}
                </Typography>
                <View style={styles.foodCell}>
                   {item.deleted ? (
                     <View style={styles.deletedContainer}>
                       <Text style={styles.deletedLabel}>Deleted</Text>
                       {isHolidayOrWeekend(item.date) ? (
                         <Text style={styles.deletedMessage}>
                           This holiday meal has been deleted. Holiday meals are purchased separately, so no wallet credit applies.
                         </Text>
                       ) : (
                         <>
                           <Text style={styles.deletedMessage}>
                             This meal is deleted. The meal amount is credited to your LunchBowl wallet.
                           </Text>
                           <TouchableOpacity onPress={goToWallet} style={styles.goToWalletBtn}>
                             <Text style={styles.goToWalletText}>Go to Wallet →</Text>
                           </TouchableOpacity>
                         </>
                       )}
                     </View>
                   ) : (
                     <>
                       <Typography style={styles.foodText} numberOfLines={1}>
                         {item.food}
                       </Typography>
                       {!isHolidayOrWeekend(item.date) && (
                       <View style={styles.actionButtons}>
                         {canEdit(item.date) && (
                           <TouchableOpacity
                             style={styles.editButton}
                             onPress={() => handleEdit(item)}>
                             <SvgXml
                               xml={EditIcon}
                               width={wp('4%')}
                               height={wp('4%')}
                             />
                           </TouchableOpacity>
                         )}
                         {canDelete(item.date) && (
                           <TouchableOpacity
                             style={styles.deleteButton}
                             onPress={() => handleDeletePress(item)}>
                             <Text style={styles.deleteIcon}>🗑</Text>
                           </TouchableOpacity>
                         )}
                       </View>
                       )}
                     </>
                   )}
                 </View>
              </View>
              {index < meals.length - 1 && (
                <View style={styles.separator} />
              )}
            </View>
          ))
        )}
      </View>
      )}

      {/* Edit Modal */}
      <BottomModal
        visible={editModalVisible}
        onClose={() => !saving && setEditModalVisible(false)}>
        <Typography style={styles.modalTitle}>Edit Meal</Typography>
        <Text style={styles.modalDate}>
          {selectedMeal ? formatDisplayDate(selectedMeal.date) : ''}
        </Text>
        <PrimaryDropdown
          options={mealOptions}
          placeholder="Select new meal"
          selectedValue={newMealName}
          onValueChange={v => setNewMealName(String(v))}
        />
        {saving ? (
          <ActivityIndicator
            color={Colors.primaryOrange}
            style={{marginTop: hp('2%')}}
          />
        ) : (
          <View style={styles.modalButtons}>
            <SecondaryButton
              title="Cancel"
              onPress={() => setEditModalVisible(false)}
              style={{flex: 1, marginRight: wp('2%')}}
              disabled={saving}
            />
            <PrimaryButton
              title="Save"
              onPress={handleSave}
              style={{flex: 1}}
              disabled={saving || !newMealName}
            />
          </View>
        )}
      </BottomModal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteConfirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => !saving && setDeleteConfirmVisible(false)}>
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>Delete Meal</Text>
            <Text style={styles.confirmMessage}>
              This action cannot be undone.{'\n'}Are you sure you want to delete this meal permanently?
            </Text>
            {saving ? (
              <ActivityIndicator color={Colors.primaryOrange} style={{marginTop: hp('2%')}} />
            ) : (
              <View style={styles.confirmButtons}>
                <SecondaryButton
                  title="Cancel"
                  onPress={() => setDeleteConfirmVisible(false)}
                  style={{flex: 1, marginRight: wp('2%')}}
                  disabled={saving}
                />
                <PrimaryButton
                  title="Confirm"
                  onPress={handleDeleteConfirm}
                  style={{flex: 1, backgroundColor: Colors.red}}
                  disabled={saving}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    padding: wp('2%'),
    marginVertical: hp('1%'),
    elevation: 0.5,
  },
  headerBlock: {
    backgroundColor: Colors.lightRed,
    borderRadius: wp('2%'),
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.8%'),
    marginBottom: hp('0.5%'),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chevron: {
    fontSize: wp('3.5%'),
    color: Colors.primaryOrange,
  },
  header: {
    fontSize: wp('4.2%'),
    color: Colors.primaryOrange,
    fontFamily: Fonts.Urbanist.bold,
  },
  dateRange: {
    fontSize: wp('3.2%'),
    color: Colors.bodyText,
    fontFamily: Fonts.Urbanist.regular,
    marginTop: hp('0.2%'),
  },
  table: {
    marginTop: hp('1%'),
    paddingHorizontal: wp('4%'),
  },
  tableHeader: {
    fontFamily: Fonts.Urbanist.bold,
    fontSize: wp('3.5%'),
    color: Colors.black,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('1%'),
  },
  foodCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: wp('1%'),
  },
  foodText: {
    flex: 1,
    fontSize: wp('4%'),
    color: Colors.black,
    fontFamily: Fonts.Urbanist.regular,
  },
  deletedText: {
    textDecorationLine: 'line-through',
    color: Colors.default,
  },
  deletedContainer: {
    flex: 1,
  },
  deletedLabel: {
    fontSize: wp('3%'),
    color: Colors.red,
    fontFamily: Fonts.Urbanist.bold,
    marginBottom: hp('0.3%'),
  },
  deletedMessage: {
    fontSize: wp('3%'),
    color: Colors.bodyText,
    fontFamily: Fonts.Urbanist.regular,
    lineHeight: hp('2%'),
  },
  goToWalletBtn: {
    marginTop: hp('0.5%'),
  },
  goToWalletText: {
    fontSize: wp('3.2%'),
    color: Colors.primaryOrange,
    fontFamily: Fonts.Urbanist.semiBold,
    textDecorationLine: 'underline',
  },
  cancelledBadge: {
    fontSize: wp('2.8%'),
    color: Colors.red,
    fontFamily: Fonts.Urbanist.semiBold,
    marginLeft: wp('1%'),
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp('1%'),
  },
  editButton: {
    marginLeft: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    marginLeft: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: wp('4%'),
  },
  cell: {
    flex: 1,
    fontSize: wp('3.5%'),
    color: Colors.black,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.Storke,
    marginVertical: hp('0.5%'),
  },
  // Modal
  modalTitle: {
    fontSize: wp('4.5%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    marginBottom: hp('0.5%'),
  },
  modalDate: {
    fontSize: wp('3.5%'),
    color: Colors.primaryOrange,
    fontFamily: Fonts.Urbanist.semiBold,
    marginBottom: hp('1%'),
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: hp('2%'),
    gap: wp('2%'),
  },
  // Delete confirm modal
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBox: {
    backgroundColor: Colors.white,
    borderRadius: wp('4%'),
    padding: wp('6%'),
    width: '85%',
    alignItems: 'center',
  },
  confirmTitle: {
    fontSize: wp('4.5%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    marginBottom: hp('1%'),
  },
  confirmMessage: {
    fontSize: wp('3.8%'),
    fontFamily: Fonts.Urbanist.regular,
    color: Colors.bodyText,
    textAlign: 'center',
    lineHeight: hp('2.8%'),
    marginBottom: hp('2%'),
  },
  confirmButtons: {
    flexDirection: 'row',
    width: '100%',
  },
});

export default FoodListCard;

