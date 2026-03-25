// utils/firebaseConfig.js
import { initializeApp } from '@react-native-firebase/app';

// Optional: If you're using other Firebase services, you can import them here

// This automatically uses google-services.json
const firebaseApp = initializeApp();

export default firebaseApp;
