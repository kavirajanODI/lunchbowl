import ThemeGradientBackground from 'components/Backgrounds/GradientBackground';
import ErrorMessage from 'components/Error/BoostrapStyleError';
import { LoadingModal } from 'components/LoadingModal/LoadingModal';
import PaginationDots from 'components/paginations.tsx/PrimaryPagination';
import Typography from 'components/Text/Typography';
import { useAuth } from 'context/AuthContext';
import React, { useEffect, useRef, useState } from 'react';
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

export default function Registration({ navigation, route }: any) {
  const { userId } = useAuth();
  const { profileData, refreshProfileData } = useUserProfile();
  const { childrenList, refreshChildren } = useChildData();

  // Prevents childrenList useEffect from overwriting local form state after a save
  const hasLoadedChildren = useRef(false);

  // When navigated here from the "LET'S GET STARTED" button on the InitialsScreen,
  // skip the InitialsScreen inside this component and go straight to the form.
  const [showForm, setShowForm] = useState(!!(route?.params?.startForm));

  // Children enriched with DB IDs — used as the source of truth for step 3
  const [savedChildrenForPlan, setSavedChildrenForPlan] = useState<any[]>([]);

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
    // Only run once per mount to set up savedChildrenForPlan for step-3+ resume.
    // Never overwrite the `children` form state from DB records — accumulated
    // historical DB children must NOT appear in the step-2 form.
    if (childrenList.length > 0 && !hasLoadedChildren.current) {
      hasLoadedChildren.current = true;
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
        _id: (child as any)._id || '',
      }));
      // Populate savedChildrenForPlan so step 3 works on app resume.
      // Do NOT call setChildren() here — the form always starts with a fresh
      // blank entry to prevent accumulated historical records from appearing.
      setSavedChildrenForPlan(formattedChildren);
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
        if (response?.success && Array.isArray(response.data)) setSchools(response.data);
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
        childFirstName: '',
        childLastName: '',
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
    const errors = validateChildrenDetails(children);
    if (Object.keys(errors).length > 0) {
      setChildrenErrors(errors);
      return;
    }

    setChildrenErrors({});

    // If children have already been saved in this session and the form content
    // (first/last name) hasn't changed, skip the API and advance directly.
    // This prevents duplicate DB records when the user goes back from step 3
    // and presses NEXT again without editing children.
    if (
      savedChildrenForPlan.length === children.length &&
      savedChildrenForPlan.length > 0
    ) {
      const allMatch = children.every((child, i) => {
        const saved = savedChildrenForPlan[i];
        return (
          saved &&
          saved.childFirstName.trim() === child.childFirstName.trim() &&
          saved.childLastName.trim() === child.childLastName.trim()
        );
      });
      if (allMatch) {
        nextStep();
        return;
      }
    }

    setLoading(true);
    try {
      const formattedChildren = children.map(child => {
        return {
          childFirstName: child.childFirstName,
          childLastName: child.childLastName,
          dob: parseDate(child.dob),
          lunchTime: child.lunchTime,
          school: child.school,
          location: child.location,
          childClass: child.childClass,
          section: child.section,
          allergies: child.allergies,
        };
      });

      const payloadChildData = {
        formData: formattedChildren,
        step: 2,
        path: 'step-Form-ChildDetails',
        _id: userId || '',
      };
      const response: any = await RegistrationService.createChildRegistration(payloadChildData);
      if (response && response.data) {
        // response.data is an array of the newly-created child IDs
        const savedIds: string[] = Array.isArray(response.data) ? response.data : [];

        if (savedIds.length !== children.length) {
          // ID count mismatch — use what we have and leave unmatched children without IDs
          console.warn(
            `Children ID mismatch: expected ${children.length}, got ${savedIds.length}`,
          );
        }

        // Build the plan-selector list from local form state + saved IDs.
        // This ensures step 3 only shows the children just submitted, not all
        // accumulated records from previous sessions in the DB.
        const enrichedChildren = children.map((child, i) => ({
          ...child,
          _id: savedIds[i] || '',
        }));
        setSavedChildrenForPlan(enrichedChildren);

        await refreshChildren();
        console.log('Children saved:', savedIds);
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
            childrenData={savedChildrenForPlan}
            isRenewal={false}
          />
        )}

        {step === 4 && <PaymentOptions prevStep={prevStep} navigation={navigation} />}
      </View>
    </ThemeGradientBackground>
  );
}
