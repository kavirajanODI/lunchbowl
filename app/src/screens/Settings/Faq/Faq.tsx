import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
  Text,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Colors} from 'assets/styles/colors';
import Fonts from 'assets/styles/fonts';

import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import Typography from 'components/Text/Typography';
import SearchBar from 'screens/Dashboard/Components/Search';
import WhatsAppButton from 'components/buttons/WhatsAppButton';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const mockFaqs = [
  {
    id: 1,
    question: 'How do I order a lunch for my child?',
    answer:
      'You can place an order through the app by selecting your child’s school, choosing a meal plan, and confirming the delivery schedule. Payment can be done via card, UPI, or wallet.',
  },
  {
    id: 2,
    question: 'Can I customize my child’s meal?',
    answer:
      'Yes! You can customize meals by selecting dietary preferences such as vegetarian, vegan, gluten-free, or nut-free options to suit your child’s needs.',
  },
  {
    id: 3,
    question: 'What time will the lunch be delivered?',
    answer:
      'Lunch is delivered directly to the school cafeteria or your child’s class before lunchtime, typically between 11:30 AM and 12:30 PM.',
  },
  {
    id: 4,
    question: 'Is there a subscription plan available?',
    answer:
      'Yes! We offer weekly and monthly subscription plans with automatic delivery every school day. You can pause or cancel anytime from the app.',
  },
  {
    id: 5,
    question: 'What if my child has food allergies?',
    answer:
      'You can specify allergies while creating your child’s profile. Our meals are prepared to avoid allergens and we take extra precautions to ensure safety.',
  },
  {
    id: 6,
    question: 'Can I track my order?',
    answer:
      'Yes! The app provides real-time tracking of your child’s lunch delivery so you know exactly when it will arrive.',
  },
  {
    id: 7,
    question: 'What if my child is absent?',
    answer:
      'You can skip the delivery for that day in the app. Refunds or credits are applied according to the subscription plan terms.',
  },
  {
    id: 8,
    question: 'Are the meals nutritious?',
    answer:
      'Absolutely! Our meals are designed by nutritionists to provide balanced nutrition for children, including proteins, vitamins, and healthy fats.',
  },
];


const FaqScreen = ({navigation}: any) => {
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [search, setSearch] = useState('');

  const toggleExpand = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredFaqs = mockFaqs.filter(f =>
    f.question.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <ThemeGradientBackground>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <HeaderBackButton title="FAQ" />

          <SearchBar value={search} onChangeText={setSearch} />

          <Typography style={styles.sectionTitle}>
            Frequently Asked Questions
          </Typography>

          {filteredFaqs.map(faq => {
            const isExpanded = expandedId === faq.id;
            return (
              <View key={faq.id} style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.faqHeader}
                  onPress={() => toggleExpand(faq.id)}>
                  <Typography
                    style={[
                      styles.faqQuestion,
                      isExpanded && styles.faqQuestionActive,
                    ]}
                    numberOfLines={1}>
                    {faq.question}
                  </Typography>
                  <Typography style={styles.arrow}>
                    {isExpanded ? '−' : '+'}
                  </Typography>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.faqAnswerBox}>
                    <Text style={[styles.faqAnswer, {flexWrap: 'wrap'}]}>
                      {faq.answer}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
      <WhatsAppButton />
    </ThemeGradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('8%'),
  },
  sectionTitle: {
    fontSize: hp('2.2%'),
    fontFamily: Fonts.Urbanist.bold,
    color: Colors.black,
    marginBottom: hp('2%'),
  },
  faqItem: {
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    marginBottom: hp('1.5%'),
    overflow: 'hidden',
    elevation: 1,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp('4%'),
  },
  faqQuestion: {
    fontSize: hp('1.9%'),
    fontFamily: Fonts.Urbanist.medium,
    color: Colors.default,
    flex: 1,
    marginRight: wp('2%'),
  },
  faqQuestionActive: {
    color: Colors.primaryOrange,
    fontFamily: Fonts.Urbanist.bold,
  },
  arrow: {
    fontSize: hp('2.5%'),
    color: Colors.default,
    fontFamily: Fonts.Urbanist.bold,
  },
  faqAnswerBox: {
    paddingHorizontal: wp('4%'),
    paddingBottom: wp('4%'),
  },
  faqAnswer: {
    fontSize: hp('1.7%'),
    fontFamily: Fonts.Urbanist.medium,
    color: Colors.bodyText,
    lineHeight: hp('2.4%'),
  },
});

export default FaqScreen;
