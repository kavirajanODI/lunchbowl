import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import NoDataFound from 'components/Error/NoDataMessage';
import {LoadingModal} from 'components/LoadingModal/LoadingModal';
import {useAuth} from 'context/AuthContext';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import PaymentService from 'services/PaymentService/paymentService';

type Payment = {
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

const STATUS_OPTIONS = ['All', 'Success', 'Failed'];

const TransactionHistoryScreen = ({navigation}: any) => {
  const {userId} = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchPayments = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const response: any = await PaymentService.getPayments(userId);
      if (response?.success) {
        const list = Array.isArray(response.payments)
          ? response.payments
          : Array.isArray(response.data?.payments)
          ? response.data.payments
          : [];
        setPayments(list);
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPayments();
    setRefreshing(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const filteredPayments = useMemo(() => {
    if (statusFilter === 'All') return payments;
    return payments.filter(
      p => (p.order_status || '').toLowerCase() === statusFilter.toLowerCase(),
    );
  }, [payments, statusFilter]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + ' ' + d.toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'});
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

  return (
    <ThemeGradientBackground>
      <LoadingModal loading={loading && !refreshing} setLoading={() => {}} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primaryOrange]}
          />
        }>
        <HeaderBackButton title="Transaction History" />

        {/* Status Filter */}
        <View style={styles.filterRow}>
          {STATUS_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.filterChip,
                statusFilter === opt && styles.filterChipActive,
              ]}
              onPress={() => setStatusFilter(opt)}>
              <Text
                style={[
                  styles.filterChipText,
                  statusFilter === opt && styles.filterChipTextActive,
                ]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transaction List */}
        {filteredPayments.length > 0 ? (
          filteredPayments.map(txn => (
            <TouchableOpacity
              key={txn._id}
              style={styles.txnCard}
              onPress={() =>
                navigation.navigate('TransactionDetailScreen', {transaction: txn})
              }>
              <View style={styles.txnLeft}>
                <View
                  style={[
                    styles.txnBadge,
                    isSuccess(txn.order_status)
                      ? styles.successBadge
                      : styles.failedBadge,
                  ]}>
                  <Text style={styles.txnBadgeText}>
                    {isSuccess(txn.order_status) ? '✓' : '✕'}
                  </Text>
                </View>
                <View style={styles.txnInfo}>
                  <Text style={styles.txnType}>{formatType(txn.paidFor)}</Text>
                  <Text style={styles.txnDate}>{formatDate(txn.payment_date)}</Text>
                  <View style={styles.statusRow}>
                    <View
                      style={[
                        styles.statusDot,
                        isSuccess(txn.order_status)
                          ? styles.successDot
                          : styles.failedDot,
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        isSuccess(txn.order_status)
                          ? styles.successText
                          : styles.failedText,
                      ]}>
                      {txn.order_status || 'Unknown'}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={styles.txnAmount}>
                ₹{(txn.amount || 0).toLocaleString('en-IN')}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          !loading && <NoDataFound message="No transactions found" />
        )}
      </ScrollView>
    </ThemeGradientBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('10%'),
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: hp('2%'),
    gap: wp('2%'),
  },
  filterChip: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('5%'),
    backgroundColor: Colors.bg,
    borderWidth: 1,
    borderColor: Colors.lines,
  },
  filterChipActive: {
    backgroundColor: Colors.primaryOrange,
    borderColor: Colors.primaryOrange,
  },
  filterChipText: {
    fontSize: hp('1.8%'),
    fontFamily: Fonts.Urbanist.medium,
    color: Colors.bodyText,
  },
  filterChipTextActive: {
    color: Colors.white,
    fontFamily: Fonts.Urbanist.bold,
  },
  txnCard: {
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('1.5%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  txnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  txnBadge: {
    width: wp('11%'),
    height: wp('11%'),
    borderRadius: wp('5.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('3%'),
  },
  successBadge: {
    backgroundColor: '#E8F5E9',
  },
  failedBadge: {
    backgroundColor: '#FFEBEE',
  },
  txnBadgeText: {
    fontSize: hp('2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.bodyText,
  },
  txnInfo: {
    flex: 1,
  },
  txnType: {
    fontSize: hp('2%'),
    fontFamily: Fonts.Urbanist.semiBold,
    color: Colors.black,
  },
  txnDate: {
    fontSize: hp('1.6%'),
    fontFamily: Fonts.Urbanist.regular,
    color: Colors.bodyText,
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5%'),
  },
  statusDot: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    marginRight: wp('1.5%'),
  },
  successDot: {backgroundColor: Colors.green},
  failedDot: {backgroundColor: Colors.red},
  statusText: {
    fontSize: hp('1.6%'),
    fontFamily: Fonts.Urbanist.medium,
  },
  successText: {color: Colors.green},
  failedText: {color: Colors.red},
  txnAmount: {
    fontSize: hp('2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    marginLeft: wp('2%'),
  },
});

export default TransactionHistoryScreen;
