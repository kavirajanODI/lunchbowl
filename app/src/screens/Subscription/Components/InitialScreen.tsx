import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {SvgXml} from 'react-native-svg';
import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import PrimaryButton from 'components/buttons/PrimaryButton';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import styles from './forms/Styles/styles';
import {LoadingModal} from 'components/LoadingModal/LoadingModal';
interface EmptyPlanStateProps {
  navigation: any;
  vabourCub: string;
  onGetStarted: () => void;
}
const InitialsScreen: React.FC<EmptyPlanStateProps> = ({
  navigation,
  vabourCub,
  onGetStarted,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (loading) {
    return <LoadingModal loading={loading} setLoading={setLoading} />;
  }

  return (
    <ThemeGradientBackground>
      <View style={styles.IInitialScreencontainer}>
        <HeaderBackButton title="My Plan" onPress={() => navigation.goBack()} />

        <View style={styles.illustration}>
          <SvgXml xml={vabourCub} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Looks like you're not Subscribed to any Plan
          </Text>
          <Text style={styles.subtitle}>
            Start a plan today and ensure your child gets healthy, home-style
            meals every day.
          </Text>

          <PrimaryButton
            onPress={onGetStarted}
            style={{width: wp('70%'), marginTop: hp('3%')}}
            title={"LET'S GET STARTED"}
          />
        </View>
      </View>
    </ThemeGradientBackground>
  );
};

export default InitialsScreen;
