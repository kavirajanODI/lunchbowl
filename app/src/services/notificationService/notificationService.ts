// import messaging from '@react-native-firebase/messaging';
// import NotificationApi from 'api/notificationsApi/notificationApi';
// import { Alert } from 'react-native';

// class NotificationService {
//   async requestPermissionAndRegisterToken(): Promise<void> {
//     const authStatus = await messaging().requestPermission();
//     const enabled =
//       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//     if (!enabled) {
//       Alert.alert('Notification permission denied');
//       return;
//     }

//     const token = await messaging().getToken();
//     console.log('📱 FCM Token:', token);

//     try {
//       await NotificationApi.sendToken(token);
//       console.log(' Token sent to backend');
//     } catch (err: any) {
//       console.error(' Token API error:', err.message);
//     }
//   }

//   listenToForegroundMessages() {
//     return messaging().onMessage(async remoteMessage => {
//       console.log(' Foreground Notification:', remoteMessage);
//       Alert.alert(
//         remoteMessage.notification?.title ?? 'Notification',
//         remoteMessage.notification?.body ?? ''
//       );
//     });
//   }

// }

// export const notificationService = new NotificationService();
