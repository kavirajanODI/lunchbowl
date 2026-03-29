import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';

type Transaction = {
  _id: string;
  order_id: string;
  tracking_id: string;
  amount: number;
  order_status: string;
  paidFor: string;
  payment_date: string;
  billing_name: string;
  billing_email: string;
  payment_mode: string;
  currency: string;
};

const TransactionDetailScreen = ({route}: any) => {
  const transaction: Transaction = route?.params?.transaction ?? {};

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return (
      d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) +
      ' ' +
      d.toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'})
    );
  };

  const formatType = (paidFor: string) => {
    if (!paidFor) return 'Payment';
    return paidFor
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/^\w/, c => c.toUpperCase());
  };

  const isSuccess = (status: string) =>
    (status || '').toLowerCase() === 'success';

  const DetailRow = ({label, value}: {label: string; value: string}) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || '—'}</Text>
    </View>
  );

  return (
    <ThemeGradientBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <HeaderBackButton title="Transaction Detail" />

        {/* Status Banner */}
        <View
          style={[
            styles.statusBanner,
            isSuccess(transaction.order_status)
              ? styles.successBanner
              : styles.failedBanner,
          ]}>
          <Text style={styles.statusIcon}>
            {isSuccess(transaction.order_status) ? '✓' : '✕'}
          </Text>
          <Text style={styles.statusLabel}>
            {transaction.order_status || 'Unknown'}
          </Text>
          <Text style={styles.statusAmount}>
            ₹{(transaction.amount || 0).toLocaleString('en-IN')}{' '}
            {transaction.currency || 'INR'}
          </Text>
        </View>

        {/* Detail Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Transaction Details</Text>
          <View style={styles.divider} />
          <DetailRow label="Transaction ID" value={transaction.tracking_id} />
          <View style={styles.rowDivider} />
          <DetailRow label="Order ID" value={transaction.order_id} />
          <View style={styles.rowDivider} />
          <DetailRow label="Email" value={transaction.billing_email} />
          <View style={styles.rowDivider} />
          <DetailRow label="Billed To" value={transaction.billing_name} />
          <View style={styles.rowDivider} />
          <DetailRow label="Paid For" value={formatType(transaction.paidFor)} />
          <View style={styles.rowDivider} />
          <DetailRow
            label="Payment Date & Time"
            value={formatDate(transaction.payment_date)}
          />
          <View style={styles.rowDivider} />
          <DetailRow label="Payment Mode" value={transaction.payment_mode} />
          <View style={styles.rowDivider} />
          <DetailRow
            label="Amount"
            value={`₹${(transaction.amount || 0).toLocaleString('en-IN')}`}
          />
        </View>
      </ScrollView>
    </ThemeGradientBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('10%'),
  },
  statusBanner: {
    borderRadius: wp('4%'),
    padding: wp('6%'),
    alignItems: 'center',
    marginBottom: hp('2.5%'),
  },
  successBanner: {
    backgroundColor: Colors.green,
  },
  failedBanner: {
    backgroundColor: Colors.red,
  },
  statusIcon: {
    fontSize: hp('5%'),
    color: Colors.white,
    fontFamily: Fonts.Urbanist.bold,
    marginBottom: hp('1%'),
  },
  statusLabel: {
    fontSize: hp('2.5%'),
    color: Colors.white,
    fontFamily: Fonts.Urbanist.bold,
    marginBottom: hp('0.5%'),
  },
  statusAmount: {
    fontSize: hp('3.5%'),
    color: Colors.white,
    fontFamily: Fonts.Urbanist.bold,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: wp('4%'),
    padding: wp('5%'),
    elevation: 3,
    shadowColor: Colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
  },
  cardTitle: {
    fontSize: hp('2.2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    marginBottom: hp('1.5%'),
  },
  divider: {
    height: 1,
    backgroundColor: Colors.Storke,
    marginBottom: hp('1.5%'),
  },
  rowDivider: {
    height: 1,
    backgroundColor: Colors.Storke,
    marginVertical: hp('1.2%'),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailLabel: {
    flex: 1,
    fontSize: hp('1.9%'),
    fontFamily: Fonts.Urbanist.medium,
    color: Colors.bodyText,
  },
  detailValue: {
    flex: 2,
    fontSize: hp('1.9%'),
    fontFamily: Fonts.Urbanist.semiBold,
    color: Colors.black,
    textAlign: 'right',
  },
});

export default TransactionDetailScreen;
