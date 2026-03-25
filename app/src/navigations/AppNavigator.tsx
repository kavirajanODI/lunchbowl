import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useEffect} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SvgXml} from 'react-native-svg';

import HistoryNavigator from 'screens/History/HistoryNavigator';
import MenueNavigator from 'screens/Menu/MenueNavigator';
import MyPlanNavigator from 'screens/MyPlan/MyPlanNavigator';
import DashboardNavigator from './Dashboard/DashboardNavigator';

import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import {useToast} from 'components/Error/Toast/ToastProvider';
import {RegistrationProvider} from 'context/RegistrationContext';
import {useNetwork} from 'hooks/useNetwork';
import LinearGradient from 'react-native-linear-gradient';
import {
  HistoryIconActive,
  HistoryIconInactive,
  HomeIconActive,
  HomeIconInactive,
  MenuIconActive,
  MenuIconInactive,
  MyPlanIconActive,
  MyPlanIconInactive,
} from 'styles/svg-icons';
import {hiddenTabRoutes, isTabHidden} from './HiddenTabRoutes';
import CustomerNavigator from './Dashboard/Child/CustomerNavigator';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const {isConnected} = useNetwork();
  const {showToast} = useToast();

  useEffect(() => {
    if (isConnected === false) {
      showToast({
        type: 'error',
        title: 'No Internet',
        message: 'Please check your network settings',
      });
    }
  }, [isConnected]);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          let iconXml;

          switch (route.name) {
            case 'Home':
              iconXml = focused ? HomeIconActive : HomeIconInactive;
              break;
            case 'Menu':
              iconXml = focused ? MenuIconActive : MenuIconInactive;
              break;
            case 'MyPlan':
              iconXml = focused ? MyPlanIconActive : MyPlanIconInactive;
              break;
            case 'History':
              iconXml = focused ? HistoryIconActive : HistoryIconInactive;
              break;
          }

          return (
            <View style={styles.iconWrapper}>
              {focused ? (
                <LinearGradient
                  colors={['#f37a164c', '#ffcccc6a', '#ffcccc76']}
                  start={{x: 0, y: 0}}
                  end={{x: 0, y: 1}}
                  style={styles.iconWrapperFocused}>
                  <View style={styles.topIndicator} />
                  <SvgXml
                    xml={iconXml ?? ''}
                    width={wp('6.5%')}
                    height={wp('6.5%')}
                  />
                </LinearGradient>
              ) : (
                <SvgXml
                  xml={iconXml ?? ''}
                  width={wp('6.5%')}
                  height={wp('6.5%')}
                />
              )}
            </View>
          );
        },
        tabBarButton: props => (
          <Pressable
            onPress={props.onPress}
            style={({pressed}) => [{flex: 1, opacity: pressed ? 0.6 : 1}]}>
            {props.children}
          </Pressable>
        ),
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: Fonts.Urbanist.regular,
          fontSize: 14,
          marginTop: '25%',
        },
        tabBarActiveTintColor: Colors.primaryOrange,
        tabBarStyle: styles.tabBar,
        headerShown: false,
      })}>
      <Tab.Screen
        name="Home"
        component={DashboardNavigator}
        options={({route}) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? '';
          if (hiddenTabRoutes.includes(routeName)) {
            return {tabBarStyle: {display: 'none'}};
          }
          return {};
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenueNavigator}
        options={({route}) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? '';
          if (isTabHidden(routeName)) {
            return {tabBarStyle: {display: 'none'}};
          }
          return {};
        }}
      />

      <Tab.Screen
        name="MyPlan"
        options={({route}) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? '';
          if (hiddenTabRoutes.includes(routeName)) {
            return {tabBarStyle: {display: 'none'}};
          }
          return {};
        }}>
        {() => (
          <RegistrationProvider>
            <MyPlanNavigator />
          </RegistrationProvider>
        )}
      </Tab.Screen>

      <Tab.Screen name="History" component={HistoryNavigator} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: wp('0.5%'),
    right: wp('0.5%'),
    borderTopLeftRadius: wp('8%'),
    borderTopRightRadius: wp('8%'),
    backgroundColor: Colors.white,
    elevation: 10,
    height: hp('10%'),
    paddingBottom: hp('0.7%'),
    overflow: 'hidden',
  },

  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('4%'),
    marginLeft: wp('17%'),
  },

  iconWrapperFocused: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: hp('4%'),
    paddingRight: hp('4%'),
    paddingTop: hp('4%'),
    paddingBottom: hp('6%'),
    marginTop: hp('2.9%'),
  },

  topIndicator: {
    position: 'absolute',
    top: 0,
    width: wp('15%'),
    height: hp('0.5%'),
    borderTopLeftRadius: wp('2%'),
    borderTopRightRadius: wp('2%'),
    backgroundColor: Colors.primaryOrange,
  },
});

export default AppNavigator;
