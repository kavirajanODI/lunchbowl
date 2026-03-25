export const validateSignUpForm = ({
  firstName,
  lastName,
  email,
  formattedValue,
  isPrivacyChecked,
}: {
  firstName: string;
  lastName: string;
  email: string;
  formattedValue: string;
  isPrivacyChecked: boolean;
}) => {
  if (!firstName || firstName.trim().length < 2) {
    return 'Please enter your full name.';
  }

  if (!lastName || lastName.trim().length < 1) {
    return 'Please enter your last name.';
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Please enter a valid email address.';
  }

  if (!formattedValue) {
    return 'Please enter your mobile number.';
  }

  const cleanNumber = formattedValue.replace(/\D/g, '');

  if (cleanNumber.length !== 10) {
    return 'Mobile number must be exactly 10 digits.';
  }

  if (!/^[0-9]{10}$/.test(cleanNumber)) {
    return 'Please enter a valid 10-digit mobile number.';
  }

  if (!isPrivacyChecked) {
    return 'Please agree to the privacy policy.';
  }

  return null;
};
