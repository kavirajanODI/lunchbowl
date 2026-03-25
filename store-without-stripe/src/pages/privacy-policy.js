import React from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@layout/Breadcrumbs";
import Mainheader from '@layout/header/Mainheader';
import Mainfooter from '@layout/footer/Mainfooter';

import abbanicon1 from "../../public/about/icons/herosec/pink-rounded-lines.svg";
import abbanicon2 from "../../public/about/icons/herosec/pink-smileflower.svg";
const PrivacyPolicy = () => {
  return (
    <div className="privacypolicypage allpolicypage">
      <Mainheader
        title="Privacy Policy"
        description="This is Privacy Policy page"
      />
      <div className="pagebody">
        <section className="pagebansec Policysbanersec relative">
          <div className="container mx-auto relative h-full">
            <div className="pageinconter relative h-full w-full flex items-center justify-center">
              <div className="hworkTitle combtntb comtilte text-center">
                <h1 className="flex flex-col textFF6514">
                  {" "}
                  <span className="block firstspan">Privacy </span>{" "}
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
                  <span className="block">Privacy Policy Statement</span>
                </h3>
                <p>
                  Lunch Bowl services are operated by Earth Tech Concepts
                  Private Limited, a company
                  <br /> registered under the Companies Act, 2013, having its
                  registered office at:
                  <br />
                  1B, KG Natraj Palace, 53/22, Saravana Street, T. Nagar,
                  <br />
                  Chennai – 600017
                  <br />
                  <br /> This policy outlines how we collect, use, and protect
                  your personal data when you use our website or services.
                </p>
              </div>
              <div className="policyintb">
                <h4>1. Information Collected</h4>
                <p>
                  We may collect and store the following types of information:
                </p>
                <ul>
                  <li>
                    Parent/guardian name, contact number, and email address
                  </li>
                  <li>Child’s name, school, class, and dietary preferences</li>
                  <li>
                    Payment and transaction data (processed via secure
                    third-party gateways)
                  </li>
                </ul>
              </div>
              <div className="policyintb">
                <h4>2. Use of Information</h4>
                <p>Your information may be used for:</p>
                <ul>
                  <li>Processing orders and facilitating deliveries</li>
                  <li>Personalizing menus and accommodating dietary needs</li>
                  <li>
                    Communicating order updates, service changes, and
                    promotional offers
                  </li>
                  <li>Internal analytics and service improvement</li>
                </ul>
              </div>
              <div className="policyintb">
                <h4>3. Disclosure of Information</h4>
                <p>
                  We do not sell or rent your personal data. Your information
                  may be shared with trusted partners (such as delivery or
                  payment providers) strictly for the purpose of fulfilling
                  services.
                </p>
              </div>
              <div className="policyintb">
                <h4>4. Data Security</h4>
                <p>
                  We implement reasonable physical, electronic, and managerial
                  safeguards to protect your information. However, no method of
                  transmission over the Internet is 100% secure.
                </p>
              </div>
              <div className="policyintb">
                <h4>5. User Rights</h4>
                <p>
                  You may request access, correction, or deletion of your
                  personal data by contacting us at <Link href="mailto:contactus@lunchbowl.co.in">contactus@lunchbowl.co.in</Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Mainfooter />
    </div>
  );
};

export default PrivacyPolicy;
