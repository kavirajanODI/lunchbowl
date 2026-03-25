import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
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

interface Meal {
  date: string;
  food: string;
}

interface Props {
  childName: string;
  meals: Meal[];
}

const FoodListCard: React.FC<Props> = ({childName, meals}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const handleEdit = (meal: Meal) => {
    setSelectedMeal(meal);
    setModalVisible(true);
  };

  return (
    <View style={styles.wrapper}>
      <Typography style={styles.header} numberOfLines={1}>
        {childName}
      </Typography>

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
                <Typography style={styles.cell} numberOfLines={1}>
                  {item.date}
                </Typography>
                <View style={styles.foodCell}>
                  <Typography style={styles.foodText} numberOfLines={1}>
                    {item.food}
                  </Typography>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEdit(item)}>
                    <SvgXml xml={EditIcon} width={wp('4%')} height={wp('4%')} />
                  </TouchableOpacity>
                </View>
              </View>
              {index < meals.length - 1 && <View style={styles.separator} />}
            </View>
          ))
        )}
      </View>

      <BottomModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <Typography
          style={{
            fontSize: wp('4.5%'),
            fontFamily: Fonts.Urbanist.bold,
            marginBottom: hp('2%'),
          }}>
          Edit Meal
        </Typography>
      </BottomModal>
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
  header: {
    fontSize: wp('4.2%'),
    backgroundColor: Colors.lightRed,
    padding: wp('2%'),
    borderRadius: wp('2%'),
    color: Colors.primaryOrange,
    fontFamily: Fonts.Urbanist.bold,
  },
  table: {
    marginTop: hp('1%'),
    paddingHorizontal: wp('4%'),
  },
  tableHeader: {
    fontFamily: 'Urbanist-Bold',
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
  editButton: {
    marginLeft: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default FoodListCard;
