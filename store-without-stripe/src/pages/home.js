import React from 'react';
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import Mainheader from '@layout/header/Mainheader';
import Mainfooter from '@layout/footer/Mainfooter';
import HomeProductCard from '@components/product/HomeProductCard';
import Letsfindout from '@components/home/Letsfindout';
import Htoworkslider from '@components/home/Htoworkslider';
import Hoteamsslide from '@components/home/Hoteamsslide';
import Accordion from '@components/faq/Accordion';
import Homebanimg from "../../public/home/homebanimg.jpeg"
import hintroImgOne from "../../public/home/hintroImg-one.jpg"
import hintroImgTwo from "../../public/home/hintroImg-two.jpg"
import HNutritionImg from "../../public/home/HNutritionImg.jpg"

const Home = () => {

    const faqItems = [
        {
          title: "How do you ensure the food is nutritious and safe for my child?",
          content: "We do quality tests, adhere to stringent cleanliness, and utilize only the freshest products. We adapt dishes to dietary requirements and address allergies."
        },
        {
          title: "What if my child has specific dietary restrictions or allergies?",
          content: "We do quality tests, adhere to stringent cleanliness, and utilize only the freshest products. We adapt dishes to dietary requirements and address allergies."
        },
        {
          title: "How does the delivery process work, and can I trust it will arrive on time?",
          content: "We do quality tests, adhere to stringent cleanliness, and utilize only the freshest products. We adapt dishes to dietary requirements and address allergies."
        },
        {
          title: "In what way are the lunch dishes sealed to keep them fresh and stop leaks?",
          content: "We do quality tests, adhere to stringent cleanliness, and utilize only the freshest products. We adapt dishes to dietary requirements and address allergies."
        },
        {
          title: "Over time, what type of variation can I anticipate in the lunch bowl options? ",
          content: "We do quality tests, adhere to stringent cleanliness, and utilize only the freshest products. We adapt dishes to dietary requirements and address allergies."
        },
        {
          title: "What safeguards are in place to guarantee a clean atmosphere for food preparation?",
          content: "We do quality tests, adhere to stringent cleanliness, and utilize only the freshest products. We adapt dishes to dietary requirements and address allergies."
        },
        {
          title: "How can I go about giving comments or resolving any issues I might have with the lunch bowls? ",
          content: "We do quality tests, adhere to stringent cleanliness, and utilize only the freshest products. We adapt dishes to dietary requirements and address allergies."
        },
      ];

  return (
    <div class="homepage">
        <Mainheader  title="Home" description="This is Home page"/>
        <div className='pagebody'>
            <section className='HbanSec relative bg-white flex'>
                <div className='hbanLeft flex items-center justify-center' >
                    <div className='hbanCont combtntb'>
                        <h1 className='flex flex-col'>
                            <span className='block'>Healthy Bites</span> 
                            <span className='block'>t<strong className="iconone">o</strong> Fuel Y<strong className="icontwo">o</strong>ur</span> 
                            <span className='block'>Child’s Mind</span>
                        </h1>
                        <h3>During School Lunch Time!</h3>
                        <p>Healthy, delectable alternatives that are loaded with <br/>vital vitamins and minerals.</p>
                        <p className="parabtn flex"><Link href="/" className="emenulink relative" ><span className='block flex items-center relative'>Explore Menu</span></Link></p>

                          <div className='hbanIconss'>
                              <div className='hbicn iconone'></div>
                              <div className='hbicn icontwo'></div>
                              <div className='hbicn iconthree'></div>
                              <div className='hbicn iconfour'></div>
                              <div className='hbicn iconfive'></div>
                              <div className='hbicn iconsix'></div>
                              <div className='hbicn iconseven'></div>
                          </div>

                    </div>
                </div>
                <div className='hbanRight relative'>
                    <Image className="w-full h-auto" priority src= {Homebanimg} alt="logo" />
                </div>
            </section>

            <section className='HintroSec bg-FFF4D7 relative bg-white flex py-[12vh]'>
                <div className='container mx-auto' >
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
                                <p>The goal of Lunch Bowl is to transform how kids get <br/>wholesome meals during the school day while directly <br/>addressing the difficulties experienced by working parents. <br/>In order to guarantee that every kid receives a nutritious, <br/>tasty meal that supports their learning and development, <br/>we are dedicated to delivering freshly made, healthful <br/>meals directly to schools.</p>
                                <p className="parabtn flex"><Link href="/" className="emenulink relative" ><span className='block flex items-center relative'>Read More</span></Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='HProlistSec bg-FF6514 relative bg-white flex py-[12vh]'>
                <div className='container mx-auto' >
                    <div className='hProListTitle combtntb comtilte textcenter mb-[8vh]'>
                        <h3>The Mission Behind</h3>
                        <h2 className='flex flex-col text-white'>
                            <span className='block'>30+ Nutritious Picks</span> 
                        </h2>
                        <p className='text-white'>Nutrient-dense, well-portioned meals with a variety of flavors that are <br/>intended to entertain and feed kids every day.</p>
                    </div>
                    <div className='hProList'>
                        <HomeProductCard/>
                    </div>
                      <div className='hProListTitle HProlistbtb combtntb comtilte textcenter mt-[5vh]'>                    
                        <p className="parabtn flex"><Link href="/" className="emenulink relative" ><span className='block flex items-center relative'>Explore Menu</span></Link></p>
                    </div>
                </div>
            </section>
            <section className='HLFOlistSec bg-FFE6E6 relative  flex pt-[20vh] pb-[12vh]'>
                <div className='container mx-auto flex flex-col items-start' >
                    <div className='hLFOTitle combtntb comtilte mb-[5vh]'>
                        <h3 className='text-[#000000]'>serving your school</h3>
                        <h2 className='flex flex-col text-EA1A27'>
                            <span className='block'>Lets Find Out!</span> 
                        </h2>
                        <p className=''>See whether your school is included in our list of schools that provide healthy, <br/>kid-friendly meals.</p>
                    </div>
                    <div className='hLFOintrow '>
                        <Letsfindout/>
                    </div>
                </div>
            </section>
            <section className='HworktabSec relative bg-white flex py-[12vh]'>
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
            <section className='HteamSec relative bg-FF6514 flex py-[12vh]'>
                <div className='container mx-auto' >
                    <div className='hworkTitle combtntb comtilte textcenter mb-[5vh]'>
                        <h4 className='text-[#000000]'>Meet the team</h4>
                        <h3 className='flex flex-col text-white'> <span className='block'>Behind the Magic</span> </h3>
                        <p className='text-white'>Experts in creating kid-friendly meals who combined inventiveness and fresh <br/>ingredients to create a nourishing and enchanted lunchtime experience.</p>
                    </div>
                    <div className='hworkintrow '>
                        <Hoteamsslide/>
                    </div>
                    <div className='hworkTitle combtntb comtilte textcenter mt-[5vh]'>                    
                        <p className="parabtn flex"><Link href="/" className="emenulink relative" ><span className='block flex items-center relative'>Explore Menu</span></Link></p>
                    </div>
                </div>
            </section>
            <section className='HNutritionSec relative bg-FFF4D7 flex py-[12vh]'>
                <div className='container mx-auto' >
                    <div className='hNutritionTitle combtntb comtilte textcenter mb-[4vh]'>
                        <h4 className='text-[#000000]'>Let's Talk Nutrition</h4>
                        <h3 className='flex flex-col textFF6514'> <span className='block'>Your First Session Is Free!</span> </h3>
                    </div>
                    <div className='hNutritionintImg '>
                        <Image className="w-full" priority src= {HNutritionImg} alt="logo" />
                    </div>
                    <div className='hNutritionTitle combtntb comtilte textcenter mt-[4vh]'>    
                        <p className=''>Experts in creating kid-friendly meals who combined inventiveness and fresh <br/>ingredients to create a nourishing and enchanted lunchtime experience.</p>                
                        <p className="parabtn flex"><Link href="/" className="emenulink relative" ><span className='block flex items-center relative'>Lets Talk</span></Link></p>
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
}

export default Home;