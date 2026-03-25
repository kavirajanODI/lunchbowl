import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import Head from "next/head";
// import { Helmet } from "react-helmet";
import Mainheader from '@layout/header/Mainheader';
import Mainfooter from '@layout/footer/Mainfooter';
import HomeProductCard from '@components/product/HomeProductCard';
import Letsfindout from '@components/home/Letsfindout';
import Htoworkslider from '@components/home/Htoworkslider';
import Hoteamsslide from '@components/home/Hoteamsslide';
import Accordion from '@components/faq/Accordion';
import HomepopVideo from '@components/home/HomepopVideo';
import NutritiousEnquire from '@components/home/NutritiousEnquirepop';

import Homebanimg from "../../public/home/homebanimg.jpg";
import hintroImgOne from "../../public/home/hintroImg-one.jpg";
import hintroImgTwo from "../../public/home/hintroImg-two.jpg";
import HNutritionImg from "../../public/home/HNutritionImg.jpg";
import banicon1 from "../../public/home/icons/hban/lines.svg";
import banicon2 from "../../public/home/icons/hban/round.svg";
import banicon3 from "../../public/home/icons/hban/lines1.svg";
import banicon4 from "../../public/home/icons/hban/triangle.svg";
import banicon5 from "../../public/home/icons/hban/star2.svg";
import banicon6 from "../../public/home/icons/hban/star1.svg";
import hintroicon1 from "../../public/home/icons/hintro/yellowround-flower.svg";
import hintroicon2 from "../../public/home/icons/hintro/blue-and-orange-star.svg";
import hintroicon3 from "../../public/home/icons/hintro/blur-and-yellow-star.svg";
import hintroicon4 from "../../public/home/icons/hintro/violet-flower.svg";
import hintroicon5 from "../../public/home/icons/hintro/skyblueround-line.svg";
import hintroicon6 from "../../public/home/icons/hintro/orange-star.svg";
import hintroicon7 from "../../public/home/icons/hintro/yellow-flower.svg";
import hlfouticon1 from "../../public/home/icons/letsfindout/arrowround.svg";
import hlteamicon1 from "../../public/home/icons/hteam/white-arrow.svg";
import hlteamicon2 from "../../public/home/icons/hteam/pink-smileflower.svg";
import hlteamicon3 from "../../public/home/icons/hteam/red-triangle.svg";
import hlteamicon4 from "../../public/home/icons/hteam/yellow-flower.svg";
import hlteamicon5 from "../../public/home/icons/hteam/violetandyellow-flower.svg";
import hlteamicon6 from "../../public/home/icons/hteam/yellowround-star.svg";
import hldocticon1 from "../../public/home/icons/hdoctors/pinkstar.svg";
import hldocticon2 from "../../public/home/icons/hdoctors/cupcake.svg";
import hldocticon3 from "../../public/home/icons/hdoctors/orangestar.svg";
import hldocticon4 from "../../public/home/icons/hdoctors/skyblue-round.svg";
import hldocticon5 from "../../public/home/icons/hdoctors/watermelon.svg";
import hldocticon6 from "../../public/home/icons/hdoctors/yellowflower.svg";
import hldocticon7 from "../../public/home/icons/hdoctors/arrowdownblack.svg";
import hfoodicon1 from "../../public/home/icons/hfoodsec/arrowdownIcon.svg";
import hfoodicon2 from "../../public/home/icons/hfoodsec/staricon.svg";
import hfoodicon3 from "../../public/home/icons/hfoodsec/icecreamicon.svg";
import hfoodicon4 from "../../public/home/icons/hfoodsec/yellowround-flower.svg";
import hfoodicon5 from "../../public/home/icons/hfoodsec/bflyIcon.svg";
import hfoodicon6 from "../../public/home/icons/hfoodsec/sunIcon.svg";
import hfoodicon7 from "../../public/home/icons/hfoodsec/wmIcon.svg";
import hfoodicon8 from "../../public/home/icons/hfoodsec/starssIcon.svg";
import hfoodicon9 from "../../public/home/icons/hfoodsec/redflowerIcon.svg";
import { useSession } from "next-auth/react";
import useRegistration from "@hooks/useRegistration";



const Home = () => {
 const [open, setOpen] = useState(false);

  const { data: session, status } = useSession();
  const { submitHandler } = useRegistration();

  const [stepCheck, setStepCheck] = useState(null);

  useEffect(() => {
    const fetchStepCheck = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          const result = await submitHandler({
            path: 'Step-Check',
            _id: session.user.id
          });
          setStepCheck(result?.data?.step);
        } catch (error) {
          console.error("Error fetching step check:", error);
        }
      }
    };
    fetchStepCheck();
  }, [session?.user?.id, status, submitHandler]);

      const handleOpenDialog = () => {
        setOpen(true);
      };
    
      const handleCloseDialog = () => {
        setOpen(false);
      };

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
    const [popopen, setpopOpen] = useState(false);

    const handlepopOpenDialog = () => {
        setpopOpen(true);
    };

    const handlepopCloseDialog = () => {
        setpopOpen(false);
    };



  return (
    <>
    <div class="homepage">
        <Mainheader title="Fresh & Healthy Lunch Subscription Box for Kids | Lunch Bowl" description="Get a healthy lunch subscription box in Chennai from Lunchbowl with fresh, nutritionist-approved meals for kids. Convenient school delivery of balanced lunchboxes." />
        <div className='pagebody'>
            <section className='HbanSec relative bg-white flex'>
                <div className='hbanLeft flex items-center justify-center' >
                      <div className='hbanCont combtntb relative'>
                        <h1 className='flex flex-col'>
                            <span className='block'>Healthy Bites</span> 
                            <span className='block'>t<strong className="iconone">o</strong> Fuel Y<strong className="icontwo">o</strong>ur</span> 
                            <span className='block'>Child's Mind</span>
                        </h1>
                        <h3>During School Lunch Time!</h3>
                <p>Healthy, delectable alternatives that are loaded with <br />vital vitamins and minerals.</p><p className="parabtn flex"><Link href="/kids-nutritious-lunch-subscription-menu" className="emenulink relative" ><span className='block flex items-center relative'>Explore Menu</span></Link></p>
                          <div className='hbanIconss'>
                              <div className='hbicn iconone absolute'><Image src={banicon1} priority alt='Icon' /></div>
                              <div className='hbicn icontwo absolute'><Image src={banicon2} priority alt='Icon' className='iconrotates' /></div>
                              <div className='hbicn iconthree absolute'><Image src={banicon3} priority alt='Icon' className='iconrubberband' /></div>
                              <div className='hbicn iconfour absolute'><Image src={banicon4} priority alt='Icon' className='iconrotates' /></div>
                <div className='hbicn iconfive absolute'><Image src={banicon5} priority alt='Icon' className='iconrotates' /></div>
                              <div className='hbicn iconsix absolute'><Image src={banicon6} priority alt='Icon' className='iconrotates' /></div>
                <div className='hbicn iconseven absolute'>&nbsp;</div>
                          </div>
                    </div>
                </div>
                <div className='hbanRight relative'>  
                  <div className="w-full h-screen bg-black videoscreenbox">
                    <video className="absolute w-full object-cover" autoPlay muted loop playsInline poster="/lunchbowl-poster.jpg">
                  <source src="/video/lunchbowl2.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className='banimgss displaynone'><div className='banvideobox' onClick={handleOpenDialog}><div className='banvideoinbox'>&nbsp;</div></div><Image className="w-full h-auto" priority src={Homebanimg} alt="Banimg" onClick={handleOpenDialog} /></div>
                </div>
            </section>

              <section className='HintroSec bg-FFF4D7 relative flex secpaddblock'>
                  <div className='container mx-auto relative' >
                    <div className='flex items-center max-md:flex-col-reverse' >
                        <div className='flex-1 hbanLeft flex justify-center flex-col' >
                            <div className='hintroimgone rounded-[50%] overflow-hidden' >
                                <Image className="w-full h-auto" priority src= {hintroImgOne} alt="logo" />
                            </div>
                            <div className='hintroimgtwo rounded-[50%] overflow-hidden self-end' >
                                <Image className="w-full h-auto" priority src= {hintroImgTwo} alt="logo" />
                            </div>
                        </div>
                        <div className='flex-1 flex items-center hintroRight relative px-[4vw]'>
                            <div className='hintroLeft combtntb comtilte'>
                                <h4>The Mission Behind</h4>
                                <h3 className='flex flex-col text4AB138'>
                                    <span className='block'>Lunch Bowl</span> 
                                </h3>
                  <p>We strive to simplify mealtime for parents by delivering <br />thoughtfully crafted, nutritionist- approved lunch boxes <br />that are fresh, flavourful and tailored to children’s <br />preferences. Our commitment to high-quality ingredients, <br />eco-friendly packaging and timely delivery ensures that every <br />meal is a blend of convenience, health and happiness.</p>
                                <p className="parabtn flex"><Link href="/about-us#aboutmissionsec" className="emenulink relative" ><span className='block flex items-center relative'>Read More</span></Link></p>
                            </div>
                        </div>
                    </div>
                      <div className='hintroIconss'>
                          <div className='hintroicn iconone absolute'><Image src={hintroicon1} priority alt='Icon' className='iconrotates' /></div>
                          <div className='hintroicn icontwo absolute'><Image src={hintroicon2} priority alt='Icon' /></div>
                          <div className='hintroicn iconthree absolute'><Image src={hintroicon3} priority alt='Icon' /></div>
                          <div className='hintroicn iconfour absolute'><Image src={hintroicon4} priority alt='Icon' className='iconrotates' /></div>
                          <div className='hintroicn iconfive absolute'><Image src={hintroicon5} priority alt='Icon' className='iconrubberband' /></div>
                          <div className='hintroicn iconsix absolute'><Image src={hintroicon6} priority alt='Icon' /></div>
                          <div className='hintroicn iconseven absolute'><Image src={hintroicon7} priority alt='Icon' className='iconrotates' /></div>
              <div className='hintroicn iconeight absolute'>&nbsp;</div>
              <div className='hintroicn iconnine absolute'>&nbsp;</div>
                      </div>
                  </div>
            </section>
              <section className='HProlistSec bg-FF6514 relative bg-white flex secpaddblock'>
                  <div className='container mx-auto relative' >
                    <div className='hProListTitle combtntb comtilte textcenter mb-[8vh]'>
                        <h3>Small Bites, Huge Impact</h3>
                        <h2 className='flex flex-col text-white'>
                            <span className='block'>30+ Healthy Packs</span> 
                        </h2>
                          <p className='text-white'>Nutrient-dense, well-portioned meals with a variety of flavors that are <br />intended to entertain and feed kids every day.</p>
                    </div>
            <div className='relative'>
                    <div className='hProList'>
                        <HomeProductCard limit={6}/>
                    </div>
              <div className='hProbutSec combtntb comtilte textcenter mt-[5vh]'>                    
                  <p className="parabtn flex"><Link href="/kids-nutritious-lunch-subscription-menu" className="emenulink relative" ><span className='block flex items-center relative'>Explore Menu</span></Link></p>
                    </div>

              <div className='hMenusIconss'>
                <div className='hMenuicn iconone absolute'><Image src={hfoodicon1} priority alt='Icon' /></div>
                <div className='hMenuicn icontwo absolute'><Image src={hfoodicon2} priority alt='Icon' className='iconrotates' /></div>
                <div className='hMenuicn iconthree absolute'><Image src={hfoodicon3} priority alt='Icon' /></div>
                <div className='hMenuicn iconfour absolute'><Image src={hfoodicon4} priority alt='Icon' className='iconrotates' /></div>
                <div className='hMenuicn iconfive absolute'><Image src={hfoodicon5} priority alt='Icon' className='iconrubberband' /></div>
                <div className='hMenuicn iconsix absolute'><Image src={hfoodicon6} priority alt='Icon' className='zoominoutanimi' /></div>
                <div className='hMenuicn iconseven absolute'><Image src={hfoodicon7} priority alt='Icon' /></div>
                <div className='hMenuicn iconeight absolute'><Image src={hfoodicon8} priority alt='Icon' /></div>
                <div className='hMenuicn iconnine absolute'><Image src={hfoodicon9} priority alt='Icon' className='iconrotates' /></div>
              </div>
            </div>
                </div>
            </section>
        {stepCheck != 4 && (
              <section className='HLFOlistSec bg-FFE6E6 relative flex'>
                  <div className='container mx-auto flex flex-col items-start relative' >
                    <div className='hLFOTitle combtntb comtilte mb-[5vh]'>
                        <h3 className='text-[#000000]'>serving your school</h3>
                        <h2 className='flex flex-col text-EA1A27'>
                <span className='block'>Let's Find Out!</span> 
                        </h2>
                        <p className=''>See whether your school is included in our list of schools that provide healthy, <br/>kid-friendly meals.</p>
                    </div>
                      <div className='hLFOintrow '>
                        <Letsfindout/>
                    </div>
                      <div className='hlfoutIconss'>
                          <div className='hlfouticn iconone absolute'><Image src={hlfouticon1} priority alt='Icon' /></div>
                      </div>
                </div>
            </section>
        )}
              <section className='HworktabSec relative bg-white flex secpaddblock'>
                <div className='container mx-auto' >
                    <div className='hworkTitle combtntb comtilte textcenter  mb-[5vh]'>
                        <h4 className='text-[#000000]'>How IT</h4>
                        <h3 className='flex flex-col textFF6514'> <span className='block'>Works?</span> </h3>
                        <p className=''>See how our site works as soon as you register <br/>and create an account with us.</p>
                    </div>
                    <div className='hworkintrow '>
                        <Htoworkslider/>
                    </div>
                </div>
            </section>
          <section className='HteamSec relative bg-FF6514 flex secpaddblock displaynone'>
                  <div className='container mx-auto relative' >
                    <div className='hworkTitle combtntb comtilte textcenter mb-[5vh]'>
                        <h4 className='text-[#000000]'>Meet the team</h4>
                        <h3 className='flex flex-col text-white'> <span className='block'>Behind the Magic</span> </h3>
                        <p className='text-white'>Experts in creating kid-friendly meals who combined inventiveness and fresh <br/>ingredients to create a nourishing and enchanted lunchtime experience.</p>
                    </div>
                    <div className='hworkintrow '>
                        <Hoteamsslide/>
                    </div>
                    <div className='hworkTitle combtntb comtilte textcenter mt-[5vh]'>                    
              <p className="parabtn flex"><Link href="/about-us#HmteamSec" className="emenulink relative" ><span className='block flex items-center relative'>View All</span></Link></p>
                    </div>
                      <div className='hteamIconss'>
              <div className='hteamicn iconone absolute'><Image src={hlteamicon1} priority alt='Icon' /></div>
              <div className='hteamicn icontwo absolute'><Image src={hlteamicon2} priority alt='Icon' className="iconrubberband" /></div>
              <div className='hteamicn iconthree absolute'><Image src={hlteamicon3} priority alt='Icon' className="iconrotates" /></div>
              <div className='hteamicn iconfour absolute'><Image src={hlteamicon4} priority alt='Icon' className="iconrotates" /></div>
                          <div className='hteamicn iconfive absolute'><Image src={hlteamicon5} priority alt='Icon' /></div>
                          <div className='hteamicn iconsix absolute'><Image src={hlteamicon6} priority alt='Icon' className="zoominoutanimi" /></div>
                      </div>
                </div>
            </section>
        <section className='HNutritionSec relative bg-FFF4D7 flex'>
                  <div className='container mx-auto relative' >
            <div className='hNutritionTitle combtntb comtilte textcenter mb-[4vh] relative'>
                        <h4 className='text-[#000000]'>Explore Nutritious food</h4>
                        <h3 className='flex flex-col textFF6514'> <span className='block'>First free session awaits you</span> </h3>
              <div className='hDoctIconss'>
                <div className='hDocticn iconseven absolute'><Image src={hldocticon7} priority alt='Icon' className="iconrubberband" /></div>
              </div>
                    </div>
                    <div className='hNutritionintImg '>
              <div className='hDocInImg'><Image className="w-full" priority src={HNutritionImg} alt="logo" /></div>
                          <div className='hDoctIconss'>
                <div className='hDocticn iconone absolute'><Image src={hldocticon1} priority alt='Icon' className="iconrotates" /></div>
                              <div className='hDocticn icontwo absolute'><Image src={hldocticon2} priority alt='Icon' /></div>
                <div className='hDocticn iconthree absolute'><Image src={hldocticon3} priority alt='Icon' className="iconrotates" /></div>
                <div className='hDocticn iconfour absolute'><Image src={hldocticon4} priority alt='Icon' className="iconrotates" /></div>
                              <div className='hDocticn iconfive absolute'><Image src={hldocticon5} priority alt='Icon' /></div>
                <div className='hDocticn iconsix absolute'><Image src={hldocticon6} priority alt='Icon' className="iconrotates" /></div>
                          </div>
                    </div>
                    <div className='hNutritionTitle combtntb comtilte textcenter mt-[4vh]'>      
              <p className=''>Sujatha Sasikumar is a Registered Dietitian under the Indian Dietetic Association. She has a Master's in Clinical Nutrition and has <br />her own independent clinical practice in Chennai. She is also certified in Sport Specific Nutrition Management, Nutrigenetics, <br />Critical  Care Nutrition and is a Certified Diabetes Educator. She helps people across all age groups modify their eating <br />habits to suit their goals for better health, fitness and performance.</p>      
              <p className="parabtn flex"><button className="emenulink relative" onClick={handlepopOpenDialog}><span className='block flex items-center relative'>Let's Talk</span></button></p>
                    </div>
                </div>
            </section>
            <section className='HfaqSec relative bg-4AB138 flex'>
                <div className='Hfaqinrow w-full relative py-[12vh]' >
                    <div className='container mx-auto' >
                        <div className='faqcontain py-[6vw] px-[8vw] bg-white relative' >
                            <div className='hfaqTitle combtntb comtilte mb-[4vh]'>
                                <h4 className='text-[#000000]'>Frequently Asked</h4>
                                <h3 className='flex flex-col text4AB138'> <span className='block'>Questions</span> </h3>
                                <p>Quickly get answers to guarantee a seamless and <br/>knowledgeable lunch bowl experience.</p>
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
        <HomepopVideo open={open} onClose={handleCloseDialog}/>
          <NutritiousEnquire open={popopen} onClose={handlepopCloseDialog} />
    </div>
    </>
  );
}

export default Home;