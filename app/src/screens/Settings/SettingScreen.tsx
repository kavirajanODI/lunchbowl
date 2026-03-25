import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import {useAuth} from 'context/AuthContext';
import {useUserProfile} from 'context/UserDataContext';
import React from 'react';
import {
  Image,
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
import {SvgXml} from 'react-native-svg';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import {
  aboutUs,
  faq,
  helpCenter,
  history,
  logout,
  NotificationBell,
  offers,
  privacyPolicy,
  RightIcon,
  RightIconWhite,
} from 'styles/svg-icons';

const items = [
  { id: '0', name: 'Child Info',         routeName: 'ParentChildInfoScreen', icon: NotificationBell },
  { id: '1', name: 'Notifications',      routeName: 'NotificationScreen',    icon: NotificationBell },
  { id: '2', name: 'Offers & Coupons',   routeName: 'OffersScreen',          icon: offers           },
  { id: '3', name: 'History',            routeName: 'OrderHistory',          icon: history          },
  { id: '4', name: 'Wallet & Payments',  routeName: 'WalletScreen',          icon: NotificationBell },
  { id: '5', name: 'Change Password',    routeName: 'ChangePasswordScreen',  icon: NotificationBell },
  { id: '6', name: 'About Us',           routeName: 'AboutUsScreen',         icon: aboutUs          },
  { id: '7', name: "FAQ's",              routeName: 'FaqScreen',             icon: faq              },
  { id: '8', name: 'T&C, Privacy Policy',routeName: 'TermsAndPolicyScreen',  icon: privacyPolicy    },
  { id: '9', name: ' Help Center',       routeName: 'HelpCenterScreen',      icon: helpCenter       },
];

const SupportItems = [{ id: '1', name: 'Log out', routeName: 'LogOut', icon: logout }];

const SettingsScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {logout: doLogout, user} = useAuth();
  const {profileData} = useUserProfile();

  const displayName =
    user?.fullname ||
    (profileData?.parentDetails?.fatherFirstName
      ? `${profileData.parentDetails.fatherFirstName} ${profileData.parentDetails.fatherLastName}`
      : 'User');

  const profileImage = (user as any)?.image
    ? (user as any).image
    : 'https://randomuser.me/api/portraits/men/75.jpg';

  const handleSignOut = async () => {
    try {
      await doLogout();
      navigation.reset({ index: 0, routes: [{name: 'Login'}] });
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <ThemeGradientBackground>
      <ScrollView contentContainerStyle={styles.mainScrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.mainContainer}>
          <HeaderBackButton title="Settings" />
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('EditProfile')}>
            <Image source={{uri: profileImage}} style={styles.image} />
            <View style={styles.textSection}>
              <Text style={styles.name}>{displayName}</Text>
              <Text style={styles.subtitle}>Edit Profile</Text>
            </View>
            <SvgXml xml={RightIcon} width={14} height={14} />
          </TouchableOpacity>

          <View style={styles.ItemContainer}>
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                <TouchableOpacity style={styles.item} onPress={() => navigation.navigate(item.routeName)}>
                  <View style={styles.itemContent}>
                    {item.icon && <SvgXml xml={item.icon} style={styles.itemImage} />}
                    <Text style={styles.itemText}>{item.name}</Text>
                  </View>
                  <SvgXml xml={RightIconWhite} width={20} height={20} />
                </TouchableOpacity>
                {index < items.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>

          <View style={styles.ItemContainer}>
            {SupportItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <TouchableOpacity style={styles.item} onPress={handleSignOut}>
                  <View style={styles.itemContent}>
                    {item.icon && <SvgXml xml={item.icon} style={styles.itemImage} />}
                    <Text style={styles.logOutitemText}>{item.name}</Text>
                  </View>
                  <SvgXml xml={RightIconWhite} width={20} height={20} />
                </TouchableOpacity>
                {index < SupportItems.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </View>
      </ScrollView>
    </ThemeGradientBackground>
  );
};

const styles = StyleSheet.create({
  mainScrollContainer: { flexGrow: 1 },
  mainContainer:       { paddingHorizontal: wp('5%') },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.primaryOrange, borderRadius: 12,
    padding: wp('6%'), marginVertical: 10, marginBottom: 20,
    shadowColor: Colors.black, elevation: 2,
  },
  image:       { width: 40, height: 40, borderRadius: 20, marginRight: wp('3%') },
  textSection: { flex: 1 },
  name:        { color: Colors.white, fontSize: 18, fontFamily: Fonts.Urbanist.bold },
  subtitle:    { color: Colors.white, fontSize: 14, fontFamily: Fonts.Urbanist.regular },
  itemContent: { flexDirection: 'row', alignItems: 'center', gap: wp(4), marginVertical: hp(0.9) },
  ItemContainer: { marginBottom: hp(2), backgroundColor: Colors.white, padding: wp('3%'), borderRadius: 10 },
  divider:     { height: 1, backgroundColor: Colors.Storke, marginVertical: hp(1) },
  item: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: hp(0.2), paddingHorizontal: wp(3.75), borderRadius: wp(5),
  },
  itemText:       { fontSize: wp(4), color: Colors.bodyText, fontFamily: Fonts.Urbanist.bold },
  logOutitemText: { fontSize: wp(4), color: Colors.red,      fontFamily: Fonts.Urbanist.bold },
  itemImage:      { width: wp(6), height: wp(6), marginRight: wp(4) },
});

export default SettingsScreen;
