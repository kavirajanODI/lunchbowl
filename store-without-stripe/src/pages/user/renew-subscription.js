// pages/user/renew-subscription.js
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Mainheader from "@layout/header/Mainheader";
import Mainfooter from "@layout/footer/Mainfooter";
import RenewSubscriptionPlanStep from "@components/renew-subflow/RenewSubscriptionPlanStep";
import RenewChildDetailsStep from "@components/renew-subflow/RenewChildDetailsStep";
import RenewPaymentStep from "@components/renew-subflow/RenewPaymentStep";
import StepHeader from "@components/renew-subflow/StepHeader"; // ✅ Imported StepHeader

import { useSession } from "next-auth/react";
import useRegistration from "@hooks/useRegistration";
import abbanicon1 from "../../../public/enterrequireddetails/redroundedandlines.svg";
import abbanicon2 from "../../../public/enterrequireddetails/yellowroundedflower.svg";
import abbanicon3 from "../../../public/enterrequireddetails/redlittleheart.svg";
import abbanicon4 from "../../../public/enterrequireddetails/lighergreenarrow.svg";
import abbanicon5 from "../../../public/enterrequireddetails/violetyellow-star.svg";
import abbanicon6 from "../../../public/enterrequireddetails/redtriangle.svg";
import abbanicon7 from "../../../public/enterrequireddetails/redlittleflower.svg";
import abbanicon8 from "../../../public/enterrequireddetails/layerflower.svg";

const RenewSubscriptionPage = () => {
  const { data: session } = useSession();
  const _id = session?.user?.id;
  const { submitHandler } = useRegistration();

  const [childCount, setChildCount] = useState(0);
  const [showChildStep, setShowChildStep] = useState(true);
  const [showPlanStep, setShowPlanStep] = useState(false);
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [childFormData, setChildFormData] = useState({ children: [] });
  const [walletUsed, setWalletUsed] = useState(0);
  const [remainingWallet, setRemainingWallet] = useState(0);



  // ✅ Handle plan change
  const handlePlanChange = useCallback((plan) => {
    setSelectedPlan(plan);
  }, []);

  // ✅ Fetch customer data
  const fetchData = async () => {
    try {
      const response = await submitHandler({
        path: "get-customer-form",
        _id,
      });
      setChildCount(response?.data?.children?.length || 0);
      setChildFormData({ children: response?.data?.children || [] });
    } catch (error) {
      console.error("Error fetching customer form data:", error);
    }
  };

  useEffect(() => {
    if (_id) {
      fetchData();
    }
  }, [_id]);

  // ✅ Step navigation logic
  const handleChildNext = () => {
    setShowChildStep(false);
    setShowPlanStep(true);
  };

  const handlePlanNext = (plan) => {
    setSelectedPlan(plan);
    setShowPlanStep(false);
    setShowPaymentStep(true);
  };

  const handlePrev = () => {
    if (showPaymentStep) {
      setShowPaymentStep(false);
      setShowPlanStep(true);
    } else if (showPlanStep) {
      setShowPlanStep(false);
      setShowChildStep(true);
    } else {
      window.location.href = "/user/userDashBoard";
    }
  };

  // ✅ Determine current step number for StepHeader
  const currentStep = showChildStep ? 1 : showPlanStep ? 2 : showPaymentStep ? 3 : 1;

  return (
    <div className="steppage">
      <Mainheader
        title="Renew Subscription"
        description="Renew your subscription plan"
      />

      <div className="pagebody">
        {/* Banner */}
        <section className="pagebansec setpbanersec relative">
          <div className="container mx-auto relative h-full">
            <div className="pageinconter relative h-full w-full flex items-center justify-center text-center">
              <div className="hworkTitle combtntb comtilte relative">
                <h1 className="flex flex-row textFF6514">
                  <span className="block">Renew Your </span>
                  <span className="block firstspan ml-2">Subscription</span>
                </h1>
                <p className="">
                  {/*{showPaymentStep
                    ? "Complete your payment to renew your subscription"
                    : showPlanStep
                      ? "Choose your subscription plan"
                      : "Update or confirm child details"}*/}
                  Keep the healthy lunches coming! Renew your plan today to <br />ensure uninterrupted meal service for your child.
                </p>

                <div className="psfbanIconss">
                  <div className="psfbanicn iconone absolute">
                    <Image src={abbanicon1} priority alt="Icon" className="iconrotates" />
                  </div>
                  <div className="psfbanicn icontwo absolute">
                    <Image src={abbanicon2} priority alt="Icon" className="iconrotates" />
                  </div>
                  <div className="psfbanicn iconthree absolute">
                    <Image src={abbanicon3} priority alt="Icon" className="iconrubberband" />
                  </div>
                  <div className="psfbanicn iconfour absolute">
                    <Image src={abbanicon4} priority alt="Icon" />
                  </div>
                  <div className="psfbanicn iconfive absolute">
                    <Image src={abbanicon5} priority alt="Icon" />
                  </div>
                  <div className="psfbanicn iconsix absolute">
                    <Image src={abbanicon6} priority alt="Icon" className="iconrotates" />
                  </div>
                  <div className="psfbanicn iconseven absolute">
                    <Image src={abbanicon7} priority alt="Icon" className="iconrotates" />
                  </div>
                  <div className="psfbanicn iconeight absolute">
                    <Image src={abbanicon8} priority alt="Icon" className="iconrotates" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Steps section */}
        <section className="overenewSec secpaddblock relative">
          <div className="container mx-auto">
            {/* ✅ Added StepHeader */}
            <StepHeader step={currentStep} />

            {showChildStep && (
              <RenewChildDetailsStep
                formData={childFormData}
                setFormData={setChildFormData}
                nextStep={handleChildNext}
                prevStep={handlePrev}
                _id={_id}
                setChildCount={setChildCount}
              />
            )}

            {showPlanStep && (
              <RenewSubscriptionPlanStep
                nextStep={(walletUsed, remainingWallet) => {
                  setWalletUsed(walletUsed);
                  setRemainingWallet(remainingWallet);
                  setShowPlanStep(false);
                  setShowPaymentStep(true);
                }}
                prevStep={handlePrev}
                _id={_id}
                initialSubscriptionPlan={selectedPlan}
                onSubscriptionPlanChange={handlePlanChange}
                childrenData={childFormData.children}
              />
            )}

            {showPaymentStep && (
              <RenewPaymentStep
                prevStep={handlePrev}
                _id={_id}
                walletUsed={walletUsed}
                remainingWallet={remainingWallet}
              />

            )}
          </div>
        </section>
      </div>

      <Mainfooter />
    </div>
  );
};

export default RenewSubscriptionPage;
