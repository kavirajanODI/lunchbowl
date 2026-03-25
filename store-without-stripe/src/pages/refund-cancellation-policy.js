import React from "react";
import Image from "next/image";
import Breadcrumbs from "@layout/Breadcrumbs";
import Mainheader from '@layout/header/Mainheader';
import Mainfooter from '@layout/footer/Mainfooter';

import abbanicon1 from "../../public/about/icons/herosec/pink-rounded-lines.svg";
import abbanicon2 from "../../public/about/icons/herosec/pink-smileflower.svg";

const RefundCancellationPolicy = () => {

  return (
    <div className="RefundCancellationpage allpolicypage">
      <Mainheader
        title="Refund & Cancellation Policy"
        description="This is Refund & Cancellation Policy page"
      />
      <div className="pagebody">
        <section className="pagebansec Policysbanersec relative">
          <div className="container mx-auto relative h-full">
            <div className="pageinconter relative h-full w-full flex items-center justify-center">
              <div className="hworkTitle combtntb comtilte  text-center">
                <h1 className="flex flex-col textFF6514">
                  {" "}
                  <span className="block firstspan">
                    Refund & Cancellation
                  </span>{" "}
                  <span className="block">Policy</span>{" "}
                </h1>
                <Breadcrumbs />
              </div>
            </div>
          </div>
        </section>
        <section className="PolicyCont relative secpaddblock">
          <div className="container mx-auto relative">
            <div className="combtntb comtilte policycomtb">
              <div className="policyintb">
                <h3 className="flex flex-col text4AB138">
                  <span className="block">Refund & Cancellation Terms</span>
                </h3>
                <p>
                  Lunch Bowl services are operated by Earth Tech Concepts
                  Private Limited, a company
                  <br /> registered under the Companies Act, 2013, having its
                  registered office at: <br />
                  1B, KG Natraj Palace, 53/22, Saravana Street, T. Nagar, Chennai – 600017
                  <br />
                  <br />
                  This Refund and Cancellation Policy applies to all
                  subscriptions and payments made through our platform.
                </p>
              </div>
              <div className="policyintb">
                <h4>1. Cancellations</h4>
                <ul>
                  <li>
                    Cancellation requests must be submitted at least forty-eight
                    (48) hours before the scheduled delivery date.
                  </li>
                  <li>
                    Cancellations requested after the specified period may not
                    be eligible for a refund.
                  </li>
                </ul>
              </div>
              <div className="policyintb">
                <h4>2. Refunds</h4>
                <p>Refunds are not applicable; however, if an order is cancelled, the amount will be credited to the Lunch Bowl wallet for use in your next meal.</p>
              </div>
              <div className="policyintb">
                <h4>3. Trial Packages</h4>
                <p>No payment is collected from customers for trial packages.</p>
              </div>
              <div className="policyintb">
                <h4>4. Force Majeure</h4>
                <p>Refunds do not apply for service disruptions caused by events beyond our control, including but not limited to natural disasters, strikes, school holidays, or transport failures.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Mainfooter />
    </div>
  );
};

export default RefundCancellationPolicy;
