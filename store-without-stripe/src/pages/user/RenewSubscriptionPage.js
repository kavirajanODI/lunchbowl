// pages/user/renew-subscription.js
import React, { useState, useEffect } from "react";
import Mainheader from "@layout/header/Mainheader";
import Mainfooter from "@layout/footer/Mainfooter";
import SubscriptionPlanStep from "@components/profile-Step-Form/subscriptionPlanStep";
import PaymentStep from "@components/profile-Step-Form/PaymentStep"; // Import the PaymentStep component
import { useSession } from "next-auth/react";
import useRegistration from "@hooks/useRegistration";

const RenewSubscriptionPage = () => {
  const { data: session } = useSession();
  const _id = session?.user?.id;
  const { submitHandler } = useRegistration();
  const [childCount, setChildCount] = useState(0);
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null); // To store the selected plan

  const featchData = async () => {
    try {
      const response = await submitHandler({
        path: "get-customer-form",
        _id,
      });
      const child = response?.data?.children?.length || 0;
      setChildCount(child);
    } catch (error) {
      console.error("Error fetching customer form data:", error);
    }
  };

  useEffect(() => {
    if (_id) {
      featchData();
    }
  }, [_id]);

  // Custom next step handler for renewal
  const handleNext = (plan) => {
    setSelectedPlan(plan); // Store the selected plan
    setShowPaymentStep(true); // Show the payment step
  };

  // Custom previous step handler
  const handlePrev = () => {
    if (showPaymentStep) {
      setShowPaymentStep(false); // Go back to subscription selection
    } else {
      window.location.href = "/user/userDashBoard";
    }
  };

  return (
    <div className="steppage">
      <Mainheader
        title="Renew Subscription"
        description="Renew your subscription plan"
      />

      <div className="pagebody">
        <section className="pagebansec setpbanersec relative">
          <div className="container mx-auto relative h-full">
            <div className="pageinconter relative h-full w-full flex items-center justify-center text-center">
              <div className="hworkTitle combtntb comtilte">
                <h1 className="flex flex-row textFF6514">
                  <span className="block">Renew Your </span>
                  <span className="block firstspan ml-2">Subscription</span>
                </h1>
                <p className="">
                  {showPaymentStep
                    ? "Complete your payment to renew your subscription"
                    : "Choose a new subscription plan to continue enjoying our services."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {showPaymentStep ? (
            <PaymentStep
              prevStep={handlePrev}
              _id={_id}
              selectedPlan={selectedPlan}
            />
          ) : (
            <SubscriptionPlanStep
              nextStep={handleNext}
              prevStep={handlePrev}
              _id={_id}
              numberOfChildren={childCount}
            />
          )}
        </div>
      </div>

      <Mainfooter />
    </div>
  );
};

export default RenewSubscriptionPage;