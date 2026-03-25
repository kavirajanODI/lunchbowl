import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import SectionTitle from 'components/Titles/SectionHeading';
import React, {useEffect, useState} from 'react';
import {
  GestureResponderEvent,
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
import PromoBanner from './Components/Carousel';
import FreeTrialCard from './Components/FreeTrialCard';
import Header from './Components/Header';
import PopularMenus from './Components/PopularMenusMarquee';
import SchoolMarquee from './Components/SchoolsServes';
import SearchBar from './Components/Search';
import WhatsAppButton from 'components/buttons/WhatsAppButton';
import EasterEgg from 'components/Fun/EasterEgg';
import HomeSkeleton from 'components/skeletons/HomeSkeleton';
import QuickActions from './Components/QuickActions';
import Highlights from './Components/Highlights';

//############## BANNER MOCK DATA ################

export const mockChallenges = [
  {
    _id: '1',
    name: 'Mindful Breathing',
    description:
      'Practice mindful breathing for 5 minutes every morning to improve focus and reduce stress.',
  },
  {
    _id: '2',
    name: 'Gratitude Journal',
    description:
      'Write down three things you are grateful for each day to build a positive mindset.',
  },
  {
    _id: '3',
    name: 'Acts of Kindness',
    description:
      'Perform one act of kindness every day — it could be a compliment or helping someone in need.',
  },
  {
    _id: '4',
    name: 'Emotional Check-In',
    description:
      'Spend a few minutes each evening identifying and reflecting on your emotions for the day.',
  },
];

const HomeScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserName(parsedUser.fullname?.trim() || null);
          console.log(
            'User Data From Storge -------------------------- :',
            parsedUser.fullname,
          );
          console.log('User loaded :', parsedUser);
        } else {
          setUserName(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUserName(null);
      } finally {
        setTimeout(() => setLoading(false), 2000);
      }
    };

    getUserRole();
  }, []);
  
  function onPressViewAll(event: GestureResponderEvent): void {
    throw new Error('Function not implemented.');
  }

  if (loading) {
    return (
      <ThemeGradientBackground>
        <View style={styles.container}>
          <HomeSkeleton />
        </View>
      </ThemeGradientBackground>
    );
  }

  return (
    <ThemeGradientBackground>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: hp('10%')}}>
          <Header userName={userName ?? 'GuestUSer'} navigation={navigation} />
          <SearchBar
            value={''}
            onChangeText={function (text: string): void {
              throw new Error('Function not implemented.');
            }}
          />
          <PromoBanner navigation={navigation} />
          <SectionTitle> Kick Start your Free Trial</SectionTitle>
          <FreeTrialCard />
          <SectionTitle>Lunch Bowl’s Highlights</SectionTitle>
          <Highlights navigation={navigation} />
          <SectionTitle>Schools We Serve</SectionTitle>
          <SchoolMarquee />
          <View style={styles.headerContainer}>
            <Text style={styles.heading}>Popular Menus</Text>
            <TouchableOpacity onPress={onPressViewAll}>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>
          <PopularMenus />
          <SectionTitle>Quick Actions</SectionTitle>
          <QuickActions navigation={navigation} />
        </ScrollView>
        <EasterEgg />
        <WhatsAppButton />
      </View>
    </ThemeGradientBackground>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('5%'),
  },
  logoutContainer: {
    alignItems: 'flex-end',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 10,
  },
  heading: {
    fontSize: 20,
    color: Colors.black,
    fontFamily: Fonts.Urbanist.semiBold,
    textTransform: 'uppercase',
    marginTop: hp('2.0%'),
    marginLeft: wp('0%'),
    marginVertical: hp('2%'),
    textAlign: 'left',
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
  viewAll: {
    fontSize: 12,
    color: Colors.primaryOrange,
    textTransform: 'uppercase',
    fontFamily: Fonts.Urbanist.bold,
  },
  logoutButton: {
    backgroundColor: Colors.primaryOrange,
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('2%'),
  },
});
