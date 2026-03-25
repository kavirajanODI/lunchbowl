export const validateLoginForm = ({
  formattedValue,
  isPrivacyChecked,
}: {
  formattedValue: string;
  isPrivacyChecked: boolean;
}) => {
  if (!formattedValue) {
    return 'Please enter your mobile number.';
  }

  const cleanNumber = formattedValue.replace(/\D/g, '');

  if (cleanNumber.length < 10) {
    return 'Mobile number must be at least 10 digits.';
  }

  if (cleanNumber.length > 10) {
    return 'Mobile number cannot exceed 10 digits.';
  }

  if (!/^[0-9]{10}$/.test(cleanNumber)) {
    return 'Please enter a valid 10-digit mobile number.';
  }

  if (!isPrivacyChecked) {
    return 'Please agree to the privacy policy.';
  }

  return null;
};
