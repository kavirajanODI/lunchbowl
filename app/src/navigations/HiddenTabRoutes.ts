
export const hiddenTabRoutes: string[] = [
  'Registartion',
  'Login',
  'ProfileSetup',
  'MealDetailScreen',
  'Settings',
  'FoodList',
  'MenuSelection',
  'EditProfile',
  'FaqScreen',
  'OfferDetailScreen',
  'OffersScreen',
  'EditProfileScreen',
  'ParentChildInfoScreen',
  'NotificationScreen',
  'AboutUsScreen',
  'HelpCenterScreen',
  'DietaryTipDetailsScreen',
  'DietaryTipsScreen',
  'HistoryDetailPage'

];

export const isTabHidden = (routeName?: string): boolean => {
  return !!routeName && hiddenTabRoutes.includes(routeName);
};

