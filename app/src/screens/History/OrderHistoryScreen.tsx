import {Colors} from 'assets/styles/colors';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import NoDataFound from 'components/Error/NoDataMessage';
import {LoadingModal} from 'components/LoadingModal/LoadingModal';
import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import SearchBar from 'screens/Dashboard/Components/Search';
import ToolTipSectionHeader from 'screens/Dashboard/Components/TooltipHeader';
import OrderService from 'services/OrderService/orderService';
import {questionIcon} from 'styles/svg-icons';
import SortButtons from '../../components/Filters/SortButtons';
import OrderCard from './Components/OrderCard';
import {IMAGE_BASE_URL} from '../../config/apiConfig';

const defaultImage = require('../../assets/images/Dashboard/Menues/menue1.png');

const OrderHistoryScreen = ({navigation}: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sortKey, setSortKey] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response: any = await OrderService.getCustomerOrders();
      if (response?.success && Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  }, []);

  const filteredOrders = orders.filter(order => {
    const name = (order.user_info?.name || '').toLowerCase();
    const food = (order.cart?.map((c: any) => c.title).join(' ') || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    return name.includes(q) || food.includes(q);
  });

  const sortedOrders = [...filteredOrders].sort((a: any, b: any) => {
    if (sortKey === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  const mapOrderToCard = (order: any) => {
    const imageUrl = order.cart?.[0]?.image;
    const image = imageUrl
      ? {
          uri: imageUrl.startsWith('http')
            ? imageUrl
            : `${IMAGE_BASE_URL}${imageUrl}`,
        }
      : defaultImage;

    const date = order.createdAt
      ? new Date(order.createdAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          weekday: 'long',
        })
      : '-';

    const statusMap: Record<string, string> = {
      delivered: 'Order was Delivered',
      cancelled: 'Order Cancelled',
      pending: 'Order Pending',
      processing: 'Order is Out for Delivery',
    };

    return {
      _id: order._id,
      image,
      title: order.user_info?.name
        ? `${order.user_info.name}'s Lunch Plan`
        : 'Lunch Plan',
      dateTime: date,
      food: order.cart?.map((c: any) => c.title).join(', ') || '-',
      status: statusMap[order.status?.toLowerCase()] || order.status || '-',
    };
  };

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
          <HeaderBackButton title="History" />
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          <ToolTipSectionHeader
            title="Sort your Orders by"
            tooltipText="Sort by date to see your newest orders first"
            icon={questionIcon}
          />
          <SortButtons onSort={(key: string) => setSortKey(key)} />
          {sortedOrders.length > 0
            ? sortedOrders.map(order => {
                const card = mapOrderToCard(order);
                return (
                  <OrderCard
                    key={order._id || order.id}
                    data={card}
                    onPress={() =>
                      navigation.navigate('HistoryDetailPage', {
                        order: card,
                        orderId: order._id,
                      })
                    }
                  />
                );
              })
            : !loading && <NoDataFound />}
        </View>
      </ScrollView>
    </ThemeGradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp('6%'),
    paddingBottom: hp('10%'),
  },
});

export default OrderHistoryScreen;


