import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useAuth } from 'context/AuthContext';
import { useUserProfile } from 'context/UserDataContext';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import Typography from 'components/Text/Typography';
import ErrorMessage from 'components/Error/BoostrapStyleError';
import { LoadingModal } from 'components/LoadingModal/LoadingModal';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Colors } from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import { Edit, Plus } from 'lucide-react-native';
import NoDataFound from 'components/Error/NoDataMessage';

export default function ParentChildInfoScreen({ navigation }: any) {
  const { userId } = useAuth();
  const { profileData, loading, refreshProfileData } = useUserProfile();

  const parent = profileData?.parentDetails || null;
  const children: any[] = (profileData as any)?.children || [];

  return (
    <ThemeGradientBackground>
      <LoadingModal loading={loading} setLoading={() => {}} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <HeaderBackButton title="Parent & Children Info" />

        {/* Parent Info */}
        <Typography style={styles.sectionHeader}>Parent Information</Typography>
        {parent ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.parentName}>
                {parent.fatherFirstName} {parent.fatherLastName}
                {parent.motherFirstName ? ` & ${parent.motherFirstName} ${parent.motherLastName}` : ''}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('MyPlan', {screen: 'Registartion'})}>
                <Edit size={20} color={Colors.primaryOrange} />
              </TouchableOpacity>
            </View>
            {!!parent.mobile && (
              <Text style={styles.parentDetail}>Mobile: {parent.mobile}</Text>
            )}
            {!!parent.address && (
              <Text style={styles.parentDetail}>Address: {parent.address}</Text>
            )}
            {!!parent.email && (
              <Text style={styles.parentDetail}>Email: {parent.email}</Text>
            )}
            {!!parent.city && (
              <Text style={styles.parentDetail}>
                {parent.city}{parent.state ? `, ${parent.state}` : ''}
                {parent.country ? `, ${parent.country}` : ''}
              </Text>
            )}
          </View>
        ) : (
          !loading && <NoDataFound message="No Parent Information Found" />
        )}

        {/* Children Info */}
        <Typography style={styles.sectionHeader}>Children Information</Typography>
        {children.length > 0 ? (
          children.map((child: any) => (
            <View key={child._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.childName}>
                  {child.childFirstName} {child.childLastName}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('MyPlan', {screen: 'Registartion'})}>
                  <Edit size={20} color={Colors.primaryOrange} />
                </TouchableOpacity>
              </View>
              {!!child.dob && (
                <Text style={styles.childDetail}>
                  DOB: {new Date(child.dob).toLocaleDateString('en-IN')}
                </Text>
              )}
              {!!child.school && (
                <Text style={styles.childDetail}>School: {child.school}</Text>
              )}
              {(!!child.childClass || !!child.section) && (
                <Text style={styles.childDetail}>
                  Class: {child.childClass || '-'} {child.section || ''}
                </Text>
              )}
              {!!child.lunchTime && (
                <Text style={styles.childDetail}>Lunch Time: {child.lunchTime}</Text>
              )}
              <Text style={styles.childDetail}>
                Allergies: {child.allergies || 'None'}
              </Text>
            </View>
          ))
        ) : (
          !loading && <NoDataFound message="No Children Found" />
        )}

        {/* Add Child Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('MyPlan', {screen: 'Registartion'})}>
          <Plus size={20} color={Colors.white} />
          <Typography style={styles.addButtonText}>Add / Edit Children</Typography>
        </TouchableOpacity>
      </ScrollView>
    </ThemeGradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: hp('10%'),
    paddingHorizontal: wp('5%'),
  },
  sectionHeader: {
    fontSize: 18,
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
    fontFamily: Fonts.Urbanist.bold,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: wp('4%'),
    marginBottom: hp('2%'),
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  parentName: {
    fontSize: hp('2.1%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    flex: 1,
    flexWrap: 'wrap',
  },
  parentDetail: {
    fontSize: hp('1.8%'),
    fontFamily: Fonts.Urbanist.medium,
    color: Colors.bodyText,
    marginBottom: 3,
  },
  childName: {
    fontSize: hp('2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
  },
  childDetail: {
    fontSize: hp('1.7%'),
    fontFamily: Fonts.Urbanist.medium,
    color: Colors.bodyText,
    marginBottom: 2,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryOrange,
    borderRadius: 25,
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('2%'),
    alignSelf: 'center',
  },
  addButtonText: {
    fontSize: hp('2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.white,
    marginLeft: 8,
  },
});

