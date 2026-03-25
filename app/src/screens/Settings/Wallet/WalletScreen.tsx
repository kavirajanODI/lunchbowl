import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import NoDataFound from 'components/Error/NoDataMessage';
import {LoadingModal} from 'components/LoadingModal/LoadingModal';
import {useAuth} from 'context/AuthContext';
import React, {useCallback, useEffect, useState} from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import PaymentService from 'services/PaymentService/paymentService';

type Transaction = {
  _id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  date: string;
  status: string;
};

const WalletScreen = ({navigation}: any) => {
  const {userId} = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  const fetchPayments = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const response: any = await PaymentService.getPayments(userId);
      if (response?.success) {
        const data = response.data;
        if (typeof data?.walletBalance === 'number') {
          setWalletBalance(data.walletBalance);
        }
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.transactions)
          ? data.transactions
          : [];
        setTransactions(list);
      }
    } catch (err) {
      console.error('Error fetching wallet data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [userId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPayments();
    setRefreshing(false);
  }, [userId]);

  const totalCredits = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalDebits = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <ThemeGradientBackground>
      <LoadingModal loading={loading} setLoading={setLoading} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primaryOrange]}
          />
        }>
        <View style={styles.container}>
          <HeaderBackButton title="Wallet & Payments" />

          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Wallet Balance</Text>
            <Text style={styles.balanceAmount}>
              ₹{walletBalance != null ? walletBalance.toFixed(2) : '0.00'}
            </Text>
            <View style={styles.balanceRow}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceItemLabel}>Total Credits</Text>
                <Text style={[styles.balanceItemAmount, styles.creditText]}>
                  +₹{totalCredits.toFixed(2)}
                </Text>
              </View>
              <View style={styles.balanceDivider} />
              <View style={styles.balanceItem}>
                <Text style={styles.balanceItemLabel}>Total Debits</Text>
                <Text style={[styles.balanceItemAmount, styles.debitText]}>
                  -₹{totalDebits.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* Transactions */}
          <Text style={styles.sectionTitle}>Transaction History</Text>
          {transactions.length > 0 ? (
            transactions.map(txn => (
              <View key={txn._id} style={styles.txnCard}>
                <View style={styles.txnLeft}>
                  <View
                    style={[
                      styles.txnBadge,
                      txn.type === 'credit'
                        ? styles.creditBadge
                        : styles.debitBadge,
                    ]}>
                    <Text style={styles.txnBadgeText}>
                      {txn.type === 'credit' ? 'CR' : 'DR'}
                    </Text>
                  </View>
                  <View style={styles.txnInfo}>
                    <Text style={styles.txnDescription} numberOfLines={2}>
                      {txn.description || 'Transaction'}
                    </Text>
                    <Text style={styles.txnDate}>
                      {txn.date
                        ? new Date(txn.date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '-'}
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.txnAmount,
                    txn.type === 'credit' ? styles.creditText : styles.debitText,
                  ]}>
                  {txn.type === 'credit' ? '+' : '-'}₹
                  {Math.abs(txn.amount).toFixed(2)}
                </Text>
              </View>
            ))
          ) : (
            !loading && <NoDataFound message="No transactions found" />
          )}
        </View>
      </ScrollView>
    </ThemeGradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('10%'),
  },
  balanceCard: {
    backgroundColor: Colors.primaryOrange,
    borderRadius: wp('4%'),
    padding: wp('5%'),
    marginBottom: hp('3%'),
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: hp('2%'),
    color: Colors.white,
    fontFamily: Fonts.Urbanist.medium,
    opacity: 0.85,
  },
  balanceAmount: {
    fontSize: hp('4.5%'),
    color: Colors.white,
    fontFamily: Fonts.Urbanist.bold,
    marginVertical: hp('1%'),
  },
  balanceRow: {
    flexDirection: 'row',
    marginTop: hp('1%'),
    width: '100%',
    justifyContent: 'space-around',
  },
  balanceItem: {
    alignItems: 'center',
    flex: 1,
  },
  balanceDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: wp('2%'),
  },
  balanceItemLabel: {
    fontSize: hp('1.6%'),
    color: Colors.white,
    fontFamily: Fonts.Urbanist.medium,
    opacity: 0.8,
  },
  balanceItemAmount: {
    fontSize: hp('2%'),
    fontFamily: Fonts.Urbanist.bold,
    marginTop: 2,
  },
  creditText: {
    color: Colors.green,
  },
  debitText: {
    color: Colors.red,
  },
  sectionTitle: {
    fontSize: hp('2.2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    marginBottom: hp('1.5%'),
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
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('3%'),
  },
  creditBadge: {
    backgroundColor: '#E8F5E9',
  },
  debitBadge: {
    backgroundColor: '#FFEBEE',
  },
  txnBadgeText: {
    fontSize: hp('1.5%'),
    fontFamily: Fonts.Urbanist.bold,
  },
  txnInfo: {
    flex: 1,
  },
  txnDescription: {
    fontSize: hp('1.9%'),
    fontFamily: Fonts.Urbanist.semiBold,
    color: Colors.black,
  },
  txnDate: {
    fontSize: hp('1.5%'),
    fontFamily: Fonts.Urbanist.regular,
    color: Colors.bodyText,
    marginTop: 2,
  },
  txnAmount: {
    fontSize: hp('2%'),
    fontFamily: Fonts.Urbanist.bold,
    marginLeft: wp('2%'),
  },
});

export default WalletScreen;
