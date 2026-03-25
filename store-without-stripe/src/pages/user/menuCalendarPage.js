import React from 'react';
import Image from "next/image";
import Mainheader from "@layout/header/Mainheader";
import Mainfooter from "@layout/footer/Mainfooter";
import Accordion from '@components/faq/Accordion';
import MenuCalendar from '@components/MenuCalendar/MenuCalendar';
import abbanicon1 from "../../../public/enterrequireddetails/redroundedandlines.svg";
import abbanicon2 from "../../../public/enterrequireddetails/yellowroundedflower.svg";
import abbanicon3 from "../../../public/enterrequireddetails/redlittleheart.svg";
import abbanicon4 from "../../../public/enterrequireddetails/lighergreenarrow.svg";
import abbanicon5 from "../../../public/enterrequireddetails/violetyellow-star.svg";
import abbanicon6 from "../../../public/enterrequireddetails/redtriangle.svg";
import abbanicon7 from "../../../public/enterrequireddetails/redlittleflower.svg";
import abbanicon8 from "../../../public/enterrequireddetails/layerflower.svg";

const MenuCalendarPage = () => {

  const faqItems = [
    {
      title: "In what way are the lunch dishes sealed to keep them fresh and stop leaks?",
      content:
        "Our Lunch dishes are tightly sealed with Plastic free, eco-friendly leak proof and Sugarcane Bagasse Canisters. To preserve freshness and maintain the right temperature until noon, we also use insulated bags for delivery purposes.",
    },
    {
      title: "Can I order meals for a specific day only?",
      content:
        (
          <>
            Yes, you can order adhoc meals for ₹250 per meal by calling or messaging us on <a href="tel:+919176917602">9176 9176 02</a>.
          </>
        ),
    },
    {
      title: "Over time, what type of variation can I anticipate in the lunch bowl options?",
      content:
        "We provide a varied and ever-changing menu to keep your child engaged. Our culinary team regularly introduces new recipes and seasonal ingredients to ensure a range of wholesome and appealing options.",
    },
    {
      title: "What safeguards are in place to guarantee a clean atmosphere for food preparation?",
      content:
        "Our cooking facilities follow the highest hygiene standards. All surfaces and equipment are routinely sterilized, staff wear protective gear, and adhere to strict handwashing guidelines. Regular inspections are conducted in line with food safety regulations.",
    },
    {
      title: "How can I share feedback or resolve any issues with the lunch bowl?",
      content: (
        <>
          We value your feedback. Please contact our customer service team by phone at <strong><a href="tel:+919176917602">+91 91769 17602</a></strong> or email us at <strong><a href="mailto:contactus@lunchbowl.co.in">contactus@lunchbowl.co.in</a></strong>. We take all complaints seriously and are committed to resolving them quickly to ensure your child’s satisfaction.
        </>
      ),
    },
    {
      title: "How do you ensure the food is nutritious and safe for my child?",
      content:
        "Our meals are nutritionist-designed, prepared with fresh, high-quality ingredients, and made under strict hygiene standards. We also customize meals for dietary needs and take extra care to avoid allergens.",
    },
    {
      title: "How does the delivery process work, and can I trust it will arrive on time?",
      content:
        "We deliver meals directly to schools in temperature-controlled vehicles, scheduled to arrive just before lunchtime. In the rare event of a delay, we’ll notify you immediately.",
    },
    {
      title: "What if my child has specific dietary restrictions or allergies?",
      content:
        "We take special care to accommodate dietary restrictions and allergies. Our team follows strict preparation practices to ensure meals are safe and free from cross-contamination.",
    },
    {
      title: "What if I need food on Sunday?",
      content: (
        <>
          Our regular service is available Monday to Friday. If you need meals on a Sunday, please call us at <strong><a href="tel:+919176917602">+91 91769 17602</a></strong> in advance. Our team will confirm availability and make special arrangements based on your request and location.
        </>
      ),
    },
    {
      title: "Can I get a free trial on Sunday?",
      content:
        "We don’t offer free trials on Sundays. Please choose any weekday or Saturday slot for your trial.",
    },
    {
      title: "What if I don’t need a meal on a day during my subscription? Will I get a refund?",
      content:
        "Any unused meal days will be credited to your wallet and can be redeemed during your next subscription.",
    },
    {
      title: "What if I want to terminate the service?",
      content:
        "You can request service termination at any time. The unconsumed meal days will be calculated, and a refund will be processed. Please contact customer service for termination assistance.",
    },
    {
      title: "How do I earn wallet points and where can I see them?",
      content:
        "You earn wallet points when you don’t need a meal on a particular date and delete that meal at least one day in advance using the Delete icon. Each deleted meal’s value is added to your wallet (₹1 = 1 point). You can view your wallet balance under My Account → Wallet, where you’ll find your total points, a 'How It Works' guide, and complete history of points earned and redeemed.",
    },
    {
      title: "When can I redeem my wallet points and is there any limit?",
      content:
        "Wallet points can be redeemed only during subscription renewal. If points are available, a redemption option will appear when selecting your new plan. If your wallet points exceed the renewal amount, only 80% of your wallet value will be applied, and the remaining points will stay in your wallet for future renewals.",
    },
    {
      title: "Can wallet points be transferred or shared?",
      content:
        "No. Wallet points are non-transferable and cannot be shared with another account or another child. Points can only be used by the account holder who earned them.",
    },
    {
      title: "What do I do when I don’t need a meal on a particular day?",
      content:
        "If your child is not attending school on a particular day, you can go to your subscription and delete the meal for that date using the Delete icon. This must be done a day prior. The meal will not be delivered, and the meal value will be automatically added to your wallet.",
    },
  ];
  return (

    <div className="steppage">    
        <Mainheader  title="Home" description="This is Home page"/>
        <div className='pagebody'>
            <section className="pagebansec setpbanersec relative">
                <div className='container mx-auto relative h-full' >
                  <div className='pageinconter relative h-full w-full flex items-center justify-center text-center'>
              <div className='hworkTitle combtntb comtilte relative'>
                <h1 className='flex flex-row textFF6514'> <span className='block firstspan'>Create Your child’s </span> <span className='block ml-2'>Perfect Plate</span></h1>
                <p className=''>Make your child's mealplate perfect and savoury by selecting the dish.</p>

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

            <div className="calandySecs py-[12vh]">
              <div className="container mx-auto relative ">
                <div className="w-full bg-white MCcalendy rounded-xl overflow-hidden">
                  <MenuCalendar />
                </div>
              </div>
            </div> 
            <section className='HfaqSec senddesfaq relative bg-4AB138 flex'>
              <div className='Hfaqinrow w-full relative py-[12vh]' >
                  <div className='container mx-auto' >
                      <div className='faqcontain py-[6vw] px-[8vw] bg-white relative' >
                          <div className='hfaqTitle combtntb comtilte mb-[4vh]'>
                              <h4 className='text-[#000000]'>Frequently Asked</h4>
                              <h3 className='flex flex-col text4AB138'> <span className='block'>Questions</span> </h3>
                          </div>
                          <div className='hfaqAccordion '>
                              <Accordion items={faqItems}/>
                          </div>
                      </div>
                  </div>
              </div>
          </section>

        </div>
      <Mainfooter/>
    </div>
  );
};

export default MenuCalendarPage;
