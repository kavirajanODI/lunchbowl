import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, ScrollView} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import Typography from 'components/Text/Typography';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import PrimaryButton from 'components/buttons/PrimaryButton';
import {LoadingModal} from 'components/LoadingModal/LoadingModal';
import OrderService from 'services/OrderService/orderService';
import {IMAGE_BASE_URL} from 'config/apiConfig';

const defaultImage = require('../../assets/images/Dashboard/Menues/menue1.png');

type HistoryDetailProps = {
  navigation: any;
  route: any;
};

const statusColorMap: Record<string, string> = {
  'Order was Delivered': Colors.green,
  'Order Cancelled': Colors.red,
  'Order Pending': Colors.primaryOrange,
  'Order is Out for Delivery': Colors.primaryOrange,
};

const HistoryDetailPage: React.FC<HistoryDetailProps> = ({route}) => {
  const {order: routeOrder, orderId} = route.params || {};
  const [order, setOrder] = useState<any>(routeOrder || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (orderId) {
      const fetchOrderDetail = async () => {
        try {
          setLoading(true);
          const response: any = await OrderService.getOrderById(orderId);
          if (response?.success && response?.data) {
            const d = response.data;
            const imageUrl = d.cart?.[0]?.image;
            const image = imageUrl
              ? {
                  uri: imageUrl.startsWith('http')
                    ? imageUrl
                    : `${IMAGE_BASE_URL}${imageUrl}`,
                }
              : defaultImage;

            const date = d.createdAt
              ? new Date(d.createdAt).toLocaleDateString('en-IN', {
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

            setOrder({
              _id: d._id,
              image,
              title: d.user_info?.name
                ? `${d.user_info.name}'s Lunch Plan`
                : 'Lunch Plan',
              date,
              food: d.cart?.map((c: any) => c.title).join(', ') || '-',
              status:
                statusMap[d.status?.toLowerCase()] || d.status || '-',
              subTotal: d.subTotal,
              shippingCost: d.shippingCost,
              total: d.total,
              paymentMethod: d.paymentMethod,
            });
          }
        } catch (err) {
          console.error('Error fetching order detail:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrderDetail();
    }
  }, [orderId]);

  if (!order) {
    return (
      <ScrollView style={styles.container}>
        <HeaderBackButton title="Order Detail" />
        <LoadingModal loading={loading} setLoading={() => {}} />
      </ScrollView>
    );
  }

  const statusColor = statusColorMap[order.status] || Colors.primaryOrange;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LoadingModal loading={loading} setLoading={() => {}} />

      {/* Header */}
      <HeaderBackButton title={order.title || 'Order Detail'} />

      {/* Status Button */}
      <View style={styles.statusWrapper}>
        <PrimaryButton
          onPress={() => {}}
          title={order.status}
          style={[styles.statusButton, {backgroundColor: statusColor}]}
          textStyle={[styles.statusText, {color: Colors.white}]}
        />
      </View>

      {/* Meal Image */}
      <View style={styles.imageWrapper}>
        <Image source={order.image} style={styles.image} />
      </View>

      {/* Order Details */}
      <View style={styles.section}>
        <Typography style={styles.sectionTitle}>Order Details</Typography>
        <View style={styles.detailRow}>
          <Typography style={styles.label}>Date:</Typography>
          <Typography style={styles.value}>{order.date || order.dateTime || '-'}</Typography>
        </View>
        <View style={styles.detailRow}>
          <Typography style={styles.label}>Food Items:</Typography>
          <Typography style={styles.value}>{order.food}</Typography>
        </View>
        {order.paymentMethod && (
          <View style={styles.detailRow}>
            <Typography style={styles.label}>Payment:</Typography>
            <Typography style={styles.value}>{order.paymentMethod}</Typography>
          </View>
        )}
        {order.total != null && (
          <View style={styles.detailRow}>
            <Typography style={styles.label}>Total:</Typography>
            <Typography style={styles.value}>₹{order.total}</Typography>
          </View>
        )}
      </View>

      {/* Feedback Section */}
      <View style={styles.section}>
        <Typography style={styles.sectionTitle}>Share Your Experience</Typography>
        <PrimaryButton
          title="Write your feedback"
          onPress={() => {}}
          style={styles.statusButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: wp('5%'),
  },
  statusWrapper: {
    marginVertical: hp('2%'),
    alignItems: 'center',
  },
  statusButton: {
    borderRadius: wp('3%'),
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('8%'),
    width: wp('85%'),
  },
  imageWrapper: {},
  image: {
    width: '100%',
    resizeMode: 'cover',
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('2%'),
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: Fonts.Urbanist.bold,
    fontSize: wp('4.2%'),
    color: Colors.black,
    marginBottom: hp('1.5%'),
  },
  detailRow: {
    marginBottom: hp('1%'),
  },
  label: {
    fontFamily: Fonts.Urbanist.bold,
    fontSize: wp('3.8%'),
    color: Colors.black,
  },
  value: {
    fontFamily: Fonts.Urbanist.regular,
    fontSize: wp('3.8%'),
    color: Colors.bodyText,
  },
  statusText: {
    fontFamily: Fonts.Urbanist.bold,
    fontSize: wp('4%'),
  },
});

export default HistoryDetailPage;

