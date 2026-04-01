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

type WalletEntry = {
  _id?: string;
  date: string;
  change: number;
  reason?: string;
  childName?: string;
  mealName?: string;
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('default', {month: 'short'});
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const WalletScreen = ({navigation}: any) => {
  const {userId} = useAuth();
  const [walletPoints, setWalletPoints] = useState<number>(0);
  const [history, setHistory] = useState<WalletEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWallet = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const response: any = await PaymentService.getWallet(userId);
      if (response?.success) {
        const wallet = response?.data?.wallet;
        if (wallet) {
          setWalletPoints(wallet.points ?? 0);
          const historyArr = Array.isArray(wallet.history)
            ? [...wallet.history].sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
              )
            : [];
          setHistory(historyArr);
        }
      }
    } catch (err) {
      console.error('Error fetching wallet data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, [userId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchWallet();
    setRefreshing(false);
  }, [userId]);

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
          <HeaderBackButton title="My Wallet" />

          {/* Points Card */}
          <View style={styles.pointsCard}>
            <Text style={styles.pointsLabel}>AVAILABLE POINTS</Text>
            <Text style={styles.pointsValue}>{walletPoints}</Text>
            <Text style={styles.pointsUnit}>POINTS</Text>
          </View>

          {/* How It Works */}
          <View style={styles.howItWorksCard}>
            <Text style={styles.howItWorksTitle}>How It Works</Text>
            <View style={styles.howItWorksList}>
              <Text style={styles.howItWorksItem}>
                • Points are added to your wallet when you cancel a meal.
              </Text>
              <Text style={styles.howItWorksItem}>
                • <Text style={styles.bold}>1 Point = ₹1.</Text>
              </Text>
              <Text style={styles.howItWorksItem}>
                • Saved points can be redeemed in your{' '}
                <Text style={styles.bold}>next subscription.</Text>
              </Text>
              <Text style={styles.howItWorksItem}>
                • Points cannot be{' '}
                <Text style={styles.bold}>transferred</Text> or{' '}
                <Text style={styles.bold}>exchanged for cash.</Text>
              </Text>
            </View>
          </View>

          {/* Recent Activity */}
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {history.length > 0 ? (
            <View style={styles.tableCard}>
              {/* Table Header */}
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>DATE</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>CHILD</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>MEAL</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText, styles.pointsCol]}>
                  POINTS
                </Text>
              </View>
              {history.map((item, idx) => (
                <View
                  key={item._id ?? idx}
                  style={[
                    styles.tableRow,
                    idx < history.length - 1 && styles.rowBorder,
                  ]}>
                  <Text style={styles.tableCell} numberOfLines={2}>
                    {formatDate(item.date)}
                  </Text>
                  <Text style={styles.tableCell} numberOfLines={2}>
                    {item.childName || '-'}
                  </Text>
                  <Text style={styles.tableCell} numberOfLines={2}>
                    {item.mealName || '-'}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.pointsCol,
                      item.change > 0 ? styles.creditText : styles.debitText,
                    ]}>
                    {item.change > 0 ? `+${item.change}` : item.change}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            !loading && <NoDataFound message="No wallet activity yet." />
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
  pointsCard: {
    backgroundColor: Colors.primaryOrange,
    borderRadius: wp('4%'),
    padding: wp('6%'),
    marginBottom: hp('2.5%'),
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: hp('1.8%'),
    color: Colors.white,
    fontFamily: Fonts.Urbanist.medium,
    opacity: 0.9,
    letterSpacing: 1,
  },
  pointsValue: {
    fontSize: hp('5.5%'),
    color: Colors.white,
    fontFamily: Fonts.Urbanist.bold,
    marginVertical: hp('0.8%'),
  },
  pointsUnit: {
    fontSize: hp('1.6%'),
    color: Colors.white,
    fontFamily: Fonts.Urbanist.medium,
    opacity: 0.8,
    letterSpacing: 1,
  },
  howItWorksCard: {
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('2.5%'),
    elevation: 1,
    shadowColor: Colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 1},
  },
  howItWorksTitle: {
    fontSize: hp('2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    marginBottom: hp('1%'),
  },
  howItWorksList: {
    gap: hp('0.6%'),
  },
  howItWorksItem: {
    fontSize: hp('1.7%'),
    fontFamily: Fonts.Urbanist.regular,
    color: Colors.bodyText,
    lineHeight: hp('2.4%'),
  },
  bold: {
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
  },
  sectionTitle: {
    fontSize: hp('2.2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    marginBottom: hp('1.5%'),
  },
  tableCard: {
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    overflow: 'hidden',
    elevation: 1,
    shadowColor: Colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 1},
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('3%'),
    alignItems: 'flex-start',
  },
  tableHeader: {
    backgroundColor: '#F9F9F9',
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCell: {
    flex: 1,
    fontSize: hp('1.6%'),
    fontFamily: Fonts.Urbanist.regular,
    color: Colors.black,
  },
  tableHeaderText: {
    fontFamily: Fonts.Urbanist.bold,
    fontSize: hp('1.5%'),
    color: Colors.bodyText,
    letterSpacing: 0.5,
  },
  pointsCol: {
    flex: 0.8,
    textAlign: 'right',
  },
  creditText: {
    color: Colors.green,
    fontFamily: Fonts.Urbanist.bold,
  },
  debitText: {
    color: Colors.red,
    fontFamily: Fonts.Urbanist.bold,
  },
});

export default WalletScreen;
