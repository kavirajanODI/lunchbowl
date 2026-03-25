// pages/user/transactionPage.js
import React from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Mainheader from "@layout/header/Mainheader";
import Mainfooter from "@layout/footer/Mainfooter";
import PaymentsTable from "@components/paymentsTable";  // adjust path if needed
import abbanicon1 from "../../../public/enterrequireddetails/redroundedandlines.svg";
import abbanicon2 from "../../../public/enterrequireddetails/yellowroundedflower.svg";
import abbanicon3 from "../../../public/enterrequireddetails/redlittleheart.svg";
import abbanicon4 from "../../../public/enterrequireddetails/lighergreenarrow.svg";
import abbanicon5 from "../../../public/enterrequireddetails/violetyellow-star.svg";
import abbanicon6 from "../../../public/enterrequireddetails/redtriangle.svg";
import abbanicon7 from "../../../public/enterrequireddetails/redlittleflower.svg";
import abbanicon8 from "../../../public/enterrequireddetails/layerflower.svg";

const TransactionPage = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id || null;

  return (
    <div className="steppage">
      <Mainheader
        title="Transaction Details"
        description="View your payment transactions"
      />

      <div className="pagebody">
        <section className="pagebansec setpbanersec relative">
          <div className="container mx-auto relative h-full">
            <div className="pageinconter relative h-full w-full flex items-center justify-center text-center">
              <div className="hworkTitle combtntb comtilte relative">
                <h1 className="flex flex-row textFF6514">
                  <span className="block">Transaction</span>
                  <span className="block firstspan ml-2">Details</span>
                </h1>
                <p>Track all your payments and subscriptions in one place.</p>
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
        <section className="transactionTableSec secpaddblock bg-white">
          <div className="container mx-auto">

            {/*<div className='hworkTitle combtntb comtilte textcenter  mb-[5vh]'>
              <h3 className='flex flex-col text4AB138'> <span className='block'>Transaction Details</span> </h3>
              <p className=''>A simple view of your payment history — clear, quick, and organized.</p>
            </div>*/}
            {/* Pass userId to PaymentsTable */}
            <PaymentsTable _id={userId} />
          </div>
        </section>
      </div>

      <Mainfooter />
    </div>
  );
};

export default TransactionPage;
