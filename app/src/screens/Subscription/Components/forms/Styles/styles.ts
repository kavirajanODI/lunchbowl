import { Colors } from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';
import { StyleSheet } from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({

    //### INITIALS SCREEN STYLE ########

    IInitialScreencontainer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: wp('5%'),

    },
    illustration: {
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        paddingHorizontal: wp('8%'),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp('8%'),
    },
    title: {
        fontSize: wp('5.5%'),
        textAlign: 'center',
        marginBottom: hp('1.5%'),
        color: Colors.black,
        fontFamily: Fonts.Urbanist.semiBold,
    },
    subtitle: {
        fontSize: wp('3.5%'),
        textAlign: 'center',
        color: Colors.bodyText,
        fontFamily: Fonts.Urbanist.regular,
        lineHeight: hp('2.5%'),
    },


    // ############ FORMS STYLE @###############
    pageHeader: {

    },
    hrLine: {
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        marginVertical: 5,
    },

    formTitle: {
        fontSize: wp('5%'),
        fontFamily: Fonts.Urbanist.semiBold,
        marginBottom: hp('2%'),
        color: Colors.black,
    },

    btn: {
        flex: 1,
        marginLeft: 10
    },

    StickyButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        columnGap: 10
    },

    formsContainer: {
        marginHorizontal: 20,
    },
    stepTitle: {
        fontSize: 28,
        fontFamily: Fonts.Urbanist.semiBold,
        color: Colors.primaryOrange,
        marginTop: '5%',
        textAlign: 'left',
        textTransform: 'uppercase'
    },
    stepDescription: {
        fontSize: 16,
        fontFamily: Fonts.Urbanist.regular,
        color: Colors.bodyText,
        textAlign: 'left',
        marginBottom: 10
    },
    flexLabel: {
        flexDirection: 'row', gap: 10, marginTop: hp('2%')
    },

    addchildTab: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('2%'),

    },
    parentFormContainer: {
        marginTop: hp('2%'),
    },
    childFormContainer: {
        marginBottom: hp('35%'),

    },
    addchildTabText: {
        color: Colors.primaryOrange,
        fontFamily: Fonts.Urbanist.bold,
    },
    addchildTabPlusButton: {
        fontFamily: Fonts.Urbanist.bold,
        color: Colors.primaryOrange,
    },
    addchildTabPlusButtonText: {
        fontFamily: Fonts.Urbanist.semiBold,
        color: Colors.black,
        fontSize: wp('3.7%'),
    },
    SubmitButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.bg,
        padding: 15,
        borderTopWidth: 1,
        borderColor: Colors.Storke,
        justifyContent: 'space-between',
        columnGap: wp('4%'),
    },
    parentSubmitButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.bg,
        padding: 15,
        borderTopWidth: 1,
        borderColor: Colors.Storke,
        justifyContent: 'space-between',
        columnGap: wp('4%'),
        marginBottom: hp('33%'),
    },
    TitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },

    removeButtonContainer: {
        alignItems: 'center',
        marginVertical: hp('2%'),
        zIndex: 10,
    },

    removeButtonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },

    removeButtonText: {
        color: Colors.red,
        fontSize: wp('4%'),
        fontFamily: Fonts.Urbanist.semiBold,
        marginLeft: wp('1.3%'),
        textAlign: 'center',
    },

});
export default styles;
