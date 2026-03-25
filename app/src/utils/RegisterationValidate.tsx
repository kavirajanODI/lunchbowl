export type ValidationErrors = {[field: string]: string};

// export interface ValidationErrors {
//   fatherFirstName?: string;
//   fatherLastName?: string;
//   motherFirstName?: string;
//   motherLastName?: string;
//   mobileNumber?: string;
//   email?: string;
//   address?: string;
//   pincode?: string;
//   city?: string;
//   state?: string;
//   country?: string;
// }

export const validateParentDetails = (data: {
  fatherFirstName: string;
  fatherLastName: string;
  motherFirstName: string;
  motherLastName: string;
  mobileNumber: string;
  email: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
}): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Father's Name
  if (!data.fatherFirstName?.trim()) {
    errors.fatherFirstName = "Father’s first name is required.";
  }
  if (!data.fatherLastName?.trim()) {
    errors.fatherLastName = "Father’s last name is required.";
  }

  // Mother's Name
  if (!data.motherFirstName?.trim()) {
    errors.motherFirstName = "Mother’s first name is required.";
  }
  if (!data.motherLastName?.trim()) {
    errors.motherLastName = "Mother’s last name is required.";
  }

  // Mobile Number
  if (!data.mobileNumber?.trim()) {
    errors.mobileNumber = "Mobile number is required.";
  } else if (!/^\d+$/.test(data.mobileNumber)) {
    errors.mobileNumber = "Mobile number must contain only digits.";
  } else if (data.mobileNumber.length < 10) {
    errors.mobileNumber = "Mobile number must be at least 10 digits.";
  } else if (data.mobileNumber.length > 12) {
    errors.mobileNumber = "Mobile number cannot exceed 12 digits.";
  }

  // Email
  if (!data.email?.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Enter a valid email address.";
  }

  // Address
  if (!data.address?.trim()) {
    errors.address = "Address is required.";
  }

  // Pincode
  if (!data.pincode?.trim()) {
    errors.pincode = "Pincode is required.";
  } else if (!/^\d{6}$/.test(data.pincode)) {
    errors.pincode = "Pincode must be exactly 6 digits.";
  }

  // City
  if (!data.city?.trim()) {
    errors.city = "City is required.";
  }

  // State
  if (!data.state?.trim()) {
    errors.state = "State is required.";
  }

  // Country
  if (!data.country?.trim()) {
    errors.country = "Country is required.";
  }

  return errors;
};



























export const validateChildrenDetails = (
  children: {
    childName: string;
    dob: string;
    school: string;
    location: string;
    lunchTime: string;
  }[],
): ValidationErrors => {
  const errors: ValidationErrors = {};

  children.forEach((child, idx) => {
    if (!child.childName.trim()) {
      errors[`childName_${idx}`] = 'Child name is required.';
    }
    if (!child.dob.trim()) {
      errors[`dob_${idx}`] = 'Date of Birth is required.';
    }
    if (!child.school.trim()) {
      errors[`school_${idx}`] = 'School is required.';
    }
    if (!child.location.trim()) {
      errors[`location_${idx}`] = 'Location is required.';
    }
    if (!child.lunchTime.trim()) {
      errors[`lunchTime_${idx}`] = 'Lunch Time is required.';
    }
  });

  return errors;
};
