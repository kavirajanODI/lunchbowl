import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import Tooltip from 'react-native-walkthrough-tooltip';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {questionIcon} from 'styles/svg-icons';
import Fonts from 'assets/styles/fonts';
import {Colors} from 'assets/styles/colors';

interface SectionHeaderProps {
  title: string;
  tooltipText?: string;
  icon?: string;
  onPress?: () => void;
}

const ToolTipSectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  tooltipText,
  icon,
   onPress,
}) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {tooltipText && icon && (
        <Tooltip
          isVisible={tooltipVisible}
          content={<Text style={styles.tooltipText}>{tooltipText}</Text>}
          placement="bottom"
          onClose={() => setTooltipVisible(false)}>
          {/* <TouchableOpacity onPress={() => setTooltipVisible(true)}>
            <SvgXml xml={questionIcon} width={wp('5.5%')} height={wp('5.5%')} />
          </TouchableOpacity> */}
           <Pressable onPress={onPress}>
        <SvgXml xml={icon} width={24} height={24} />
      </Pressable>
        </Tooltip>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp('2%'),
    paddingVertical: hp('1%'),
  } as ViewStyle,
  sectionTitle: {
    fontFamily: Fonts.Urbanist.semiBold,
    fontSize: hp('2.4%'),
    color: Colors.black,
  } as TextStyle,
  tooltipText: {
    fontFamily: Fonts.Urbanist.bold,
    fontSize: hp('1.7%'),
    color: Colors.bodyText,
  } as TextStyle,
});

export default ToolTipSectionHeader;
