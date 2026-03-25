import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import PrimaryButton from 'components/buttons/PrimaryButton';
import Typography from 'components/Text/Typography';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

type PlanCardProps = {
  userName: string;
  plan: string;
  amount: string;
  status: string;
  expiry: string;
};

const PlanCard: React.FC<PlanCardProps> = ({
  userName,
  plan,
  amount,
  status,
  expiry,
}) => {
  function upgrade(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Typography style={styles.planTitle} numberOfLines={1} maxWords={2}>
            {`${userName}’s Current Plan`}
          </Typography>

          <Text
            style={[
              styles.status,
              status === 'Not Paid' ? styles.statusExpired : styles.statusPaid,
            ]}>
            {status}
          </Text>
        </View>
        <Text style={styles.planSubText}>
          {plan} – {amount}
        </Text>
        <Text style={styles.expiryText}>Expires on:</Text>
        <Text style={styles.expiryDate}>{expiry}</Text>
        <PrimaryButton
          title="UPGRADE PLAN"
          onPress={upgrade}
          style={{width: '100%'}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp('1%'),
  },
  card: {
    width: wp('86%'),
    maxWidth: 400,
    borderRadius: 25,
    padding: wp('5%'),
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderBottomWidth: 6,
    borderRightWidth: 6,
    borderColor: Colors.primaryOrange,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  planTitle: {
    fontSize: 22,
    color: Colors.primaryOrange,
    fontFamily: Fonts.Urbanist.bold,
  },
  statusPaid: {
    color: 'green',
    fontWeight: '600',
  },

  planSubText: {
    fontSize: 18,
    color: Colors.bodyText,
    marginTop: 4,
    fontFamily: Fonts.Urbanist.regular,
  },
  status: {
    backgroundColor: Colors.white,
    color: Colors.primaryOrange,
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 12,
    padding: 5,
    alignSelf: 'flex-start',
    fontFamily: Fonts.Urbanist.extraBold,
  },
  statusExpired: {
    backgroundColor: Colors.white,
    color: Colors.primaryOrange,
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 12,
    padding: 5,
    alignSelf: 'flex-start',
    fontFamily: Fonts.Urbanist.extraBold,
  },
  expiryText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.bodyText,
    fontFamily: Fonts.Urbanist.regular,
  },
  expiryDate: {
    fontSize: 22,
    color: Colors.black,
    fontFamily: Fonts.Urbanist.semiBold,
    marginVertical: 10,
  },
});

export default PlanCard;
