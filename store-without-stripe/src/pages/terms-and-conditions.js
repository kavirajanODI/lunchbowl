import React from "react";
import Image from "next/image";
import Breadcrumbs from "@layout/Breadcrumbs";
import Mainheader from '@layout/header/Mainheader';
import Mainfooter from '@layout/footer/Mainfooter';

import abbanicon1 from "../../public/about/icons/herosec/pink-rounded-lines.svg";
import abbanicon2 from "../../public/about/icons/herosec/pink-smileflower.svg";

const TermAndConditions = () => {

  return (
    <div className="termscondipage allpolicypage">
      <Mainheader
        title="Term And Conditions"
        description="This is Term And Conditions page"
      />
      <div className="pagebody">
        <section className="pagebansec Policysbanersec relative">
          <div className="container mx-auto relative h-full">
            <div className="pageinconter relative h-full w-full flex items-center justify-center">
              <div className="hworkTitle combtntb comtilte text-center">
                <h1 className="flex flex-col textFF6514">
                  {" "}
                  <span className="block firstspan">Terms & </span>{" "}
                  <span className="block">Conditions</span>{" "}
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
                  <span className="block">Terms & Conditions of Use </span>
                </h3>
                <p> Lunch Bowl services are operated by Earth Tech Concepts Private Limited, a company <br /> registered under the Companies Act, 2013, having its
                  registered office at: <br /> <address>1B, KG Natraj Palace, 53/22, Saravana Street, T. Nagar, <br />Chennai – 600017.</address><br /> By accessing or using our website and services, you agree to
                  the following terms and conditions:</p>
              </div>
              <div className="policyintb">
                <h4>1. Eligibility</h4>
                <p>
                  Use of the Lunch Bowl service is available only to individuals
                  who can form legally binding contracts under applicable law.
                  By using this website, you represent that you are a parent or
                  legal guardian of the child for whom the service is being
                  ordered.
                </p>
              </div>
              <div className="policyintb">
                <h4>2. Service Description</h4>
                <p>
                  Lunch Bowl provides subscription-based nutritious lunch
                  delivery services to school-going children. Services are
                  subject to change, enhancement, or discontinuation at our sole
                  discretion.
                </p>
              </div>
              <div className="policyintb">
                <h4>3. User Obligations</h4>
                <p>You agree to:</p>
                <ul>
                  <li>
                    Provide accurate and complete registration information.
                  </li>
                  <li>
                    Review menu items and communicate any dietary restrictions
                    or allergies.
                  </li>
                  <li>
                    Ensure timely payments to maintain uninterrupted service.
                  </li>
                </ul>
              </div>
              <div className="policyintb">
                <h4>4. Ordering and Delivery</h4>
                <p>
                  Orders must be placed according to our operational calendar.
                  Delivery is restricted to affiliated schools only. While every
                  effort is made to ensure timely delivery, Lunch Bowl is not
                  liable for delays caused by school closures, force majeure
                  events, or third-party disruptions.
                </p>
              </div>
              <div className="policyintb">
                <h4>5. Modifications and Termination</h4>
                <p>
                  We reserve the right to amend or terminate services, pricing,
                  or these Terms at any time. Continued use of the website after
                  changes constitutes acceptance.
                </p>
              </div>
              <div className="policyintb">
                <h4>6. Limitation of Liability</h4>
                <p>
                  Lunch Bowl shall not be held liable for any direct, indirect,
                  incidental, or consequential damages arising from the use of
                  our services or website.
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

export default TermAndConditions;
