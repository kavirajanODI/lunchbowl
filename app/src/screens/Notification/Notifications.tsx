import { Colors } from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import AnimatedBell from 'components/Animations/AnimatedBell';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { SvgXml } from 'react-native-svg';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import { NONotificationBell, NotificationBell } from 'styles/svg-icons';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
}

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Notifications are delivered via Firebase push.
    // In-app list is populated when backend provides a notifications endpoint.
    setNotifications([]);
  }, []);

  const renderNotification = ({ item }: { item: Notification }) => (
    <View style={styles.notificationCard}>
      <View style={styles.iconCircle}>
        <AnimatedBell xml={NotificationBell} width={40} height={40} />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationDescription}>{item.description}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.illustration}>
        <SvgXml xml={NONotificationBell} />
      </View>
      <View style={styles.ContentContainer}>
        <Text style={styles.emptyTitle}>No Notifications</Text>
        <Text style={styles.emptyDescription}>
          You don't have any notifications yet. All your alerts will appear here.
        </Text>
      </View>
    </View>
  );

  return (
    <ThemeGradientBackground>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: hp('10%') }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<HeaderBackButton title="Notifications" />}
        ListEmptyComponent={<EmptyState />}
      />
    </ThemeGradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: wp('5%'), paddingTop: hp('2%') },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: wp('4%'),
    borderRadius: 12,
    marginBottom: hp('2%'),
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#FFE0B2',
    alignItems: 'center', justifyContent: 'center',
    marginRight: wp('3%'),
  },
  notificationContent: { flex: 1 },
  ContentContainer: { alignItems: 'center', justifyContent: 'center', marginTop: hp('2%') },
  notificationTitle: {
    fontSize: hp('2%'), fontFamily: Fonts.Urbanist.bold,
    color: Colors.black, marginBottom: hp('0.5%'),
  },
  notificationDescription: {
    fontSize: hp('1.7%'), fontFamily: Fonts.Urbanist.medium,
    color: Colors.bodyText, marginBottom: hp('0.5%'),
  },
  notificationTime: {
    fontSize: hp('1.5%'), fontFamily: Fonts.Urbanist.medium, color: Colors.bodyText,
  },
  emptyContainer: { alignItems: 'center', marginTop: hp('10%') },
  illustration: { alignItems: 'center' },
  emptyTitle: { fontSize: hp('2.2%'), fontFamily: Fonts.Urbanist.bold, color: Colors.black },
  emptyDescription: {
    fontSize: hp('1.7%'), fontFamily: Fonts.Urbanist.medium,
    color: Colors.bodyText, textAlign: 'center',
    marginTop: hp('1%'), maxWidth: wp('80%'),
  },
});
