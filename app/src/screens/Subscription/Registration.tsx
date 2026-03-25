import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import ErrorMessage from 'components/Error/BoostrapStyleError';
import { LoadingModal } from 'components/LoadingModal/LoadingModal';
import PaginationDots from 'components/paginations.tsx/PrimaryPagination';
import Typography from 'components/Text/Typography';
import { useAuth } from 'context/AuthContext';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import HeaderBackButton from 'screens/Dashboard/Components/BackButton';
import RegistrationService from 'services/RegistartionService/registartion';
import { vabourCub } from 'styles/svg-icons';
import {
  validateChildrenDetails,
  validateParentDetails,
} from 'utils/RegisterationValidate';
import ChildrenDetails from './Components/forms/ChildDetails';
import ParentDetails from './Components/forms/ParentDetails';
import PaymentOptions from './Components/forms/PaymentOptions';
import styles from './Components/forms/Styles/styles';
import SubscriptionPlan from './Components/forms/Subscription';
import InitialsScreen from './Components/InitialScreen';
import { useUserProfile } from 'context/UserDataContext';
import { useChildData } from 'context/ChildContext';

type Step = 1 | 2 | 3 | 4;

export default function Registration({ navigation }: any) {
  const { userId } = useAuth();
const { profileData, refreshProfileData } = useUserProfile();
const { childrenList, refreshChildren } = useChildData();

console.log("profileData from ---------",profileData)

  // ########################### PARENT STATES ##############################

  const [fatherFirstName, setFatherFirstName] = useState('');
  const [fatherLastName, setFatherLastName] = useState('');
  const [motherFirstName, setMotherFirstName] = useState('');
  const [motherLastName, setMotherLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ########################### FEED DATA FROM CONTEXT #########################

  useEffect(() => {
    if (profileData?.parentDetails) {
      const parent = profileData.parentDetails;

      setFatherFirstName(parent.fatherFirstName || '');
      setFatherLastName(parent.fatherLastName || '');

      setMotherFirstName(parent.motherFirstName || '');
      setMotherLastName(parent.motherLastName || '');

      setMobileNumber(parent.mobile || '');
      setAddress(parent.address || '');
      setEmail(parent.email || '');
      setCity(parent.city || '');
      setState(parent.state || '');
      setCountry(parent.country || '');
      setPincode(parent.pincode || '');
    }
     if (profileData?.step) {
      setStep(profileData.step as Step);
      setShowForm(true);
    }
  }, [profileData]);


 useEffect(() => {
    if (childrenList.length > 0) {
      const formattedChildren = childrenList.map(child => ({
        childFirstName: child.childFirstName.trim() || '',
        childLastName: child.childLastName.trim() || '',
        dob: child.dob ? new Date(child.dob).toISOString().split('T')[0] : '',
        school: child.school || '',
        location: child.location || '',
        lunchTime: child.lunchTime || '',
        childClass: child.childClass || '',
        section: child.section || '',
        allergies: child.allergies || '',
      }));
      setChildren(formattedChildren);
    }
  }, [childrenList]);

  

  // ########################### CHILD STATES #################################
  const [children, setChildren] = useState([
    {
      childFirstName: '',
      childLastName:'',
      dob: '',
      school: '',
      location: '',
      lunchTime: '',
      childClass: '',
      section: '',
      allergies: '',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState<Step>(1);

  // ############################ ERROR STATES ##################################

  const [parentErrors, setParentErrors] = useState<any>({});
  const [childrenErrors, setChildrenErrors] = useState<any>({});

  // ################################## PLAN STATES #############################
  const [selectedPlan, setSelectedPlan] = useState('');

  const nextStep = () => setStep(prev => (prev < 4 ? ((prev + 1) as Step) : prev));
  const prevStep = () => setStep(prev => (prev > 1 ? ((prev - 1) as Step) : prev));



  const handleChildChange = (index: number, field: string | null, value: any) => {
    setChildren(prev => {
      const newChildren = [...prev];
      if (field === null) newChildren[index] = { ...newChildren[index], ...value };
      else newChildren[index] = { ...newChildren[index], [field]: value };
      return newChildren;
    });
  };

  // ################################### SCHOOLS #################################

  const [schools, setSchools] = useState<any[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(false);

  useEffect(() => {
    const loadSchools = async () => {
      setLoadingSchools(true);
      try {
        const response: any = await RegistrationService.getAllSchools();
        if (response) setSchools(response);
      } catch (error) {
        console.error('Error fetching schools:', error);
      } finally {
        setLoadingSchools(false);
      }
    };
    loadSchools();
  }, []);


  const addChild = () =>
    setChildren([
      ...children,
      {
        childName: '',
        dob: '',
        school: '',
        location: '',
        lunchTime: '',
        childClass: '',
        section: '',
        allergies: '',
      },
    ]);

  const removeChild = (index: number) => {
    const updated = [...children];
    updated.splice(index, 1);
    setChildren(updated);
  };

  const parseDate = (dob: string) => {
    if (!dob) return null;
    if (/^\d{4}-\d{2}-\d{2}/.test(dob)) return new Date(dob).toISOString();
    const parts = dob.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return new Date(+year, +month - 1, +day).toISOString();
    }
    return new Date(dob).toISOString();
  };

  // ################################## INITIAL SCREEN #######################
  
  if (!showForm) {
    return (
      <InitialsScreen
        navigation={navigation}
        vabourCub={vabourCub}
        onGetStarted={() => {
          setShowForm(true);
          setStep(1);
        }}
      />
    );
  }


// ########################### SUBMIT PARENT DETAILS #########################

  const submitParentDetails = async () => {
    const errors = validateParentDetails({
      fatherFirstName,
      fatherLastName,
      motherFirstName,
      motherLastName,
      mobileNumber,
      email,
      address,
      pincode,
      city,
      state,
      country,
    });

    if (Object.keys(errors).length > 0) {
      setParentErrors(errors);
      return;
    }

    setParentErrors({});
    try {
      setLoading(true);

      const payload = {
        formData: {
          fatherFirstName,
          fatherLastName,
          motherFirstName,
          motherLastName,
          mobile: mobileNumber,
          email,
          address,
          pincode,
          city,
          state,
          country,
          children: [],
        },
        step: 1,
        path: 'step-Form-ParentDetails',
        _id: userId || '',
      };

      const response: any = await RegistrationService.createParentRegistration(payload);
      if (response && response.data) {
        await refreshProfileData();
        console.log('Parent saved:', response.data);
        nextStep();
      } else {
        console.error('Invalid parent response', response);
      }
    } catch (error) {
      console.error('Error saving parent details:', error);
    } finally {
      setLoading(false);
    }
  };

  // ################### SUBMIT CHILDREN DETAILS ##############################

  const submitChildrenDetails = async () => {
    setLoading(true);

    const errors = validateChildrenDetails(children);
    if (Object.keys(errors).length > 0) {
      setChildrenErrors(errors);
      return;
    }

    setChildrenErrors({});
    try {
      const formattedChildren = children.map(child => {
        
        return {
          childFirstName: child.childFirstName,
          childLastName:  child.childLastName,
          dob: parseDate(child.dob),
          lunchTime: child.lunchTime,
          school: child.school,
          location: child.location,
          childClass: child.childClass,
          section: child.section,
          allergies: child.allergies,


          allergies: 'dsfdfsdfsdf',
          _id: '69130af0ee650804b2bfdca7',
          childFirstName: 'asoka',
          childLastName: 'asdsd',
          dob: '2025-10-02',
          lunchTime: '11:00 AM - 12:00 PM',
          school: 'ST Francis Xavier English Medium Matriculation School',
          location: 'Alwarpet',
          childClass: 'Class 5',
          section: 'E',
          user: '6912bf2ca3bfaeee7dbb5566',
          __v: 0,
        };
      });

      const payloadChildData = {
        formData: formattedChildren,
        step: 2,
        path: 'step-Form-ChildDetails',
        _id:  '6912bf2ca3bfaeee7dbb5566',
      };
    console.log("childe data send from server $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",payloadChildData)
      const response: any = await RegistrationService.createChildRegistration(payloadChildData);
      if (response && response.data) {
        await refreshChildren();
        console.log('Children saved:', response.data);
        nextStep();
      } else {
        console.error('Invalid child response', response);
        setError(response?.message || 'Something went wrong.');
      }
    } catch (error) {
      setError('Error saving plan. Please try again.');
      console.error('Error saving children:', error);
    } finally {
      setLoading(false);
    }
  };

  
// ############################### FORM HEADERS #################################

  const formInfo = {
    1: { title: 'Parent’s Details', description: 'Enter your details to continue.' },
    2: { title: 'Children’s Details', description: 'Enter your details to continue.' },
    3: { title: 'Subscription Plan', description: 'Select your plan to continue.' },
    4: { title: 'Payment Options', description: 'Make a payment to activate your plan.' },
  };

  const handleCloseError = () => setError(null);

  return (
    <ThemeGradientBackground>
      <LoadingModal loading={loading} setLoading={setLoading} />
      <View style={styles.formsContainer}>
        <HeaderBackButton title="Back" onPress={prevStep} />
        <PaginationDots totalSteps={4} currentStep={step} />

        <View style={styles.pageHeader}>
          <Typography style={styles.stepTitle}>{formInfo[step].title}</Typography>
          <Typography style={styles.stepDescription}>{formInfo[step].description}</Typography>

           {/* {error && <ErrorMessage error={error} onClose={handleCloseError} />} */}

        </View>

        {step === 1 && (
          <ParentDetails
            fatherFirstName={fatherFirstName}
            setFatherFirstName={setFatherFirstName}
            fatherLastName={fatherLastName}
            setFatherLastName={setFatherLastName}
            motherFirstName={motherFirstName}
            setMotherFirstName={setMotherFirstName}
            motherLastName={motherLastName}
            setMotherLastName={setMotherLastName}
            mobileNumber={mobileNumber}
            setMobileNumber={setMobileNumber}
            email={email}
            setEmail={setEmail}
            address={address}
            setAddress={setAddress}
            pincode={pincode}
            setPincode={setPincode}
            city={city}
            setCity={setCity}
            state={state}
            setState={setState}
            country={country}
            setCountry={setCountry}
            submitRegistration={submitParentDetails}
            errors={parentErrors}
          />
        )}

        {step === 2 && (
          <ChildrenDetails
            children={children}
            handleChildChange={handleChildChange}
            addChild={addChild}
            removeChild={removeChild}
            prevStep={prevStep}
            nextStep={submitChildrenDetails}
            errors={childrenErrors}
            schools={schools}
            loadingSchools={loadingSchools}
          />
        )}

        {step === 3 && (
          <SubscriptionPlan
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            prevStep={prevStep}
            nextStep={nextStep}
            childCount={children.length}
          />
        )}

        {step === 4 && <PaymentOptions prevStep={prevStep} navigation={navigation} />}
      </View>
    </ThemeGradientBackground>
  );
}
