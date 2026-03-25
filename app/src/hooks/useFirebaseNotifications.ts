// import { useEffect } from 'react';
// import { notificationService } from 'services/notificationService/notificationService';

// const useFirebaseNotifications = () => {
//   useEffect(() => {
//     let unsubscribe: (() => void) | undefined;

//     const init = async () => {
//       await notificationService.requestPermissionAndRegisterToken();
//       unsubscribe = notificationService.listenToForegroundMessages();
//     };

//     init();

//     return () => {
//       if (unsubscribe) unsubscribe();
//     };
//   }, []);
// };

// export default useFirebaseNotifications;
