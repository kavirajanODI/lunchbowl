import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Head from "next/head";
import Marquee from "react-fast-marquee";
import Breadcrumbs from "@layout/Breadcrumbs";
import Mainheader from '@layout/header/Mainheader';
import Mainfooter from '@layout/footer/Mainfooter';
import AboutVideoSlider from "@components/about/AboutVideoSlider";
import Htoworkslider from '@components/home/Htoworkslider';
import hintroImgOne from "../../public/home/hintroImg-one.jpg"
import hintroImgTwo from "../../public/home/hintroImg-two.jpg"
import ArulMadhanImg from "../../public/about/team/ArulMadhanImg.jpg"
import RavishankarNImg from "../../public/about/team/RavishankarNImg.jpg"
import SMuruganImg from "../../public/about/team/SMuruganImg.jpg"
import VijayAntonyImg from "../../public/about/team/VijayAntonyImg.jpg"
import VijayVImg from "../../public/about/team/VijayVImg.jpg"
import visionimg from "../../public/about/vision-img.png"
import img1 from "../../public/about/environ-img1.jpg";
import img2 from "../../public/about/environ-img2.jpg";
import img3 from "../../public/about/environ-img3.jpg";
import img4 from "../../public/about/environ-img4.jpg";
import img5 from "../../public/about/environ-img5.jpg";
import img6 from "../../public/about/environ-img6.jpg";

import abtintroImgOne from "../../public/about/abtintroImgOne.jpg";
import abtintroImgTwo from "../../public/about/abtintroImgTwo.png";

import hintroicon1 from "../../public/home/icons/hintro/yellowround-flower.svg";
import hintroicon2 from "../../public/home/icons/hintro/blue-and-orange-star.svg";
import hintroicon3 from "../../public/home/icons/hintro/blur-and-yellow-star.svg";
import hintroicon4 from "../../public/home/icons/hintro/violet-flower.svg";
import hintroicon5 from "../../public/home/icons/hintro/skyblueround-line.svg";
import hintroicon6 from "../../public/home/icons/hintro/orange-star.svg";
import hintroicon7 from "../../public/home/icons/hintro/yellow-flower.svg";
import abbanicon1 from "../../public/about/icons/herosec/pink-rounded-lines.svg";
import abbanicon2 from "../../public/about/icons/herosec/pink-smileflower.svg";
import ateamicon1 from "../../public/about/icons/meetteam/pinksmileyflower.svg";
import ateamicon2 from "../../public/about/icons/meetteam/red-triangle.svg";
import ateamicon3 from "../../public/about/icons/meetteam/yellowstar.svg";
import ateamicon4 from "../../public/about/icons/meetteam/skyblue-leaf.svg";
import ateamicon5 from "../../public/about/icons/meetteam/red-flower.svg";
import ateamicon6 from "../../public/about/icons/meetteam/violetyellow-star.svg";
import ateamicon7 from "../../public/about/icons/meetteam/pinkroundedlines.svg";
import ateamicon8 from "../../public/about/icons/meetteam/darkgreen-arrow.svg";

import MuruganPopup from "@components/about/teams/MuruganPopup";
import ArulMathanThangamPopup from "@components/about/teams/ArulMathanThangamPopup";
import VijayVellanganniPopup from "@components/about/teams/VijayVellanganniPopup";
import VijayAntonyPopup from "@components/about/teams/VijayAntonyPopup";
import RavishankarNPopup from "@components/about/teams/RavishankarNPopup";


const AboutUs = () => {


  const [openMurugan, setOpenMurugan] = useState(false);
  const [openArulMathanThangam, setOpenArulMathanThangam] = useState(false);
  const [openVijayVellanganni, setOpenVijayVellanganni] = useState(false);
  const [openVijayAntony, setOpenVijayAntony] = useState(false);
  const [openRavishankarN, setOpenRavishankarN] = useState(false);

  return (
    <div className="aboutuspage">
      <Mainheader title="Vegetarian Lunch Box Delivery for School Kids | Lunchbowl" description="Get in touch with Lunchbowl, your trusted lunch subscription service for school kids in Chennai. Fresh, nutritious meals delivered daily. Subscribe today." />
      <div className="pagebody">
        <section className="pagebansec aboutbanersec relative">
          <div className="container mx-auto relative h-full">
            <div className="pageinconter relative h-full w-full flex items-center">
              <div className="hworkTitle combtntb comtilte">
                <h1 className="flex flex-col textFF6514">
                  {" "}
                  <span className="block firstspan">The Story Behind</span>{" "}
                  <span className="block">Every Bite</span>{" "}
                </h1>
                <p className="">
                  As food is an emotion, there will be a story <br />
                  behind every recipe. Let’s explore!
                </p>
                <Breadcrumbs />
              </div>
            </div>
            <div className="abbanIconss">
              <div className="abbanicn iconone absolute">
                <Image
                  src={abbanicon1}
                  priority
                  alt="Icon"
                  className="iconrotates"
                />
              </div>
              <div className="abbanicn icontwo absolute">
                <Image src={abbanicon2} priority alt="Icon" className="iconrubberband" />
              </div>
            </div>
          </div>
        </section>
        <section className="HintroSec aboutintrosec introbrsec relative bg-white flex py-[12vh]">
          <div className="container mx-auto relative">
            <div className="flex items-center max-md:flex-col-reverse aboutintroRow flex-wrap">
              <div className="flex items-center relative aboutintroCol aboutintroTCol">
                <div className="hintroLeft combtntb comtilte">
                  <h4>Our Story</h4>
                  <h3 className="flex flex-col text4AB138">
                    <span className="block">Why We Created Lunch Bowl</span>
                  </h3>
                  <p>Let’s be honest—packing lunch every single day is hard work. Between picky eaters, tight mornings, and the never-ending quest for something that’s both healthy and kid-approved, parents (especially moms) are juggling a lot.</p>
                  <div className="hintroIntb">
                    <p>That’s where the idea for <strong>Lunch Bowl</strong> was born.</p>
                    <p className="mobspilt">We asked ourselves: <br /><strong>“What if lunch didn’t have to be another daily stress?”</strong></p>
                    <p>So, we cooked up a solution: <strong>Lunch Bowl</strong> is your lunchtime lifesaver. We deliver fresh, delicious, and nutritious meals straight to your child—hot and ready to enjoy. No last-minute chopping, no repeat sandwich cycles, and no lunchbox guilt.</p>
                    <p><strong>Here’s what we bring to the table:</strong></p>
                    <ul className="list-disc pl-5">
                      <li>Tasty, kid-friendly meals crafted by real nutritionists (and tested by real kids!).</li>
                      <li>A fun, easy-to-use meal planning that lets you mix and match based on your child’s tastes.</li>
                      <li>Fresh deliveries, right before lunchtime—because soggy sandwiches are so last year.</li>
                      <li>Flexible, affordable plans that make sense for busy families.</li>
                    </ul>
                    <p>At Lunch Bowl, we’re here to take one big thing off your plate, while putting something great into your kid’s.</p>
                    <p><strong>Healthy. Happy. Hassle-free.</strong> That’s how we do lunch.</p>
                  </div>
                </div>
              </div>

              <div className="hbanLeft flex justify-center flex-col aboutintroCol aboutintroRCol">
                <div className="hintroimgone rounded-[50%] overflow-hidden">
                  <Image
                    className="w-full h-auto"
                    priority
                    src={abtintroImgOne}
                    alt="logo"
                  />
                </div>
                <div className="hintroimgtwo rounded-[50%] overflow-hidden self-end">
                  <Image
                    className="w-full h-auto"
                    priority
                    src={abtintroImgTwo}
                    alt="logo"
                  />
                </div>
              </div>
            </div>
            {/*<div className="aintroIconss">
              <div className="aintroicn iconone absolute">
                <Image
                  src={hintroicon1}
                  priority
                  alt="Icon"
                  className="iconrotates"
                />
              </div>
              <div className="aintroicn icontwo absolute">
                <Image src={hintroicon2} priority alt="Icon" />
              </div>
              <div className="aintroicn iconthree absolute">
                <Image src={hintroicon3} priority alt="Icon" />
              </div>
              <div className="aintroicn iconfour absolute">
                <Image
                  src={hintroicon4}
                  priority
                  alt="Icon"
                  className="iconrotates"
                />
              </div>
              <div className="aintroicn iconfive absolute">
                <Image
                  src={hintroicon5}
                  priority
                  alt="Icon"
                  className="iconrubberband"
                />
              </div>
              <div className="aintroicn iconsix absolute">
                <Image src={hintroicon6} priority alt="Icon" />
              </div>
              <div className="aintroicn iconseven absolute">
                <Image
                  src={hintroicon7}
                  priority
                  alt="Icon"
                  className="iconrotates"
                />
              </div>
            </div>*/}
          </div>
        </section>
        <section className="HintroSec aboutmissionsec introbrsec relative bg-FFF4D7 flex py-[12vh]" id="aboutmissionsec">
          <div className="container mx-auto relative">
            <div className="flex items-center max-md:flex-col-reverse">
              <div className="flex-1 hbanLeft flex justify-center flex-col">
                <div className="hintroimgone rounded-[50%] overflow-hidden">
                  <Image
                    className="w-full h-auto"
                    priority
                    src={hintroImgOne}
                    alt="logo"
                  />
                </div>
                <div className="hintroimgtwo rounded-[50%] overflow-hidden self-end">
                  <Image
                    className="w-full h-auto"
                    priority
                    src={hintroImgTwo}
                    alt="logo"
                  />
                </div>
              </div>
              <div className="flex-1 flex items-center hintroRight relative px-[4vw]">
                <div className="hintroLeft combtntb comtilte">
                  <h4>The Mission Behind</h4>
                  <h3 className="flex flex-col text4AB138">
                    <span className="block">Lunch Bowl</span>
                  </h3>
                  <p>We strive to simplify mealtime for parents by delivering thoughtfully crafted, nutritionist- approved lunch boxes that are fresh, flavourful and tailored to children’s preferences. Our commitment to high-quality ingredients, eco-friendly packaging and timely delivery ensures that every meal is a blend of convenience, health and happiness.</p>
                </div>
              </div>
            </div>
            <div className="hintroIconss">
              <div className="hintroicn iconone absolute">
                <Image
                  src={hintroicon1}
                  priority
                  alt="Icon"
                  className="iconrotates"
                />
              </div>
              <div className="hintroicn icontwo absolute">
                <Image src={hintroicon2} priority alt="Icon" />
              </div>
              <div className="hintroicn iconthree absolute">
                <Image src={hintroicon3} priority alt="Icon" />
              </div>
              <div className="hintroicn iconfour absolute">
                <Image
                  src={hintroicon4}
                  priority
                  alt="Icon"
                  className="iconrotates"
                />
              </div>
              <div className="hintroicn iconfive absolute">
                <Image
                  src={hintroicon5}
                  priority
                  alt="Icon"
                  className="iconrubberband"
                />
              </div>
              <div className="hintroicn iconsix absolute">
                <Image src={hintroicon6} priority alt="Icon" />
              </div>
              <div className="hintroicn iconseven absolute">
                <Image
                  src={hintroicon7}
                  priority
                  alt="Icon"
                  className="iconrotates"
                />
              </div>
              <div className="hintroicn iconeight absolute">
                &nbsp;
              </div>
            </div>
          </div>
        </section>
        <section className="HmteamSec relative bg-FFE6E6 flex py-[12vh] displaynone" id="HmteamSec">
          <div className="container mx-auto relative">
            <div className="hintroLeft combtntb comtilte text-center mb-[5vh]">
              <h5>Meet the team</h5>
              <h3 className="flex flex-col text4AB138">
                <span className="block">Behind the Magic</span>
              </h3>
              <p>
                Experts in creating kid-friendly meals who combined
                inventiveness and fresh <br />
                ingredients to create a nourishing and enchanted lunchtime
                experience.
              </p>

              <div className="ateamIconss">
                <div className="ateamicn iconone absolute">
                  <Image src={ateamicon1} priority alt="Icon" className="iconrubberband" />
                </div>
                <div className="ateamicn iconeight absolute">
                  <Image src={ateamicon8} priority alt="Icon" className="zoominoutanimi" />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center mteamitembox ">   

              <div className="flex-none flex mteambox relative">
                <div className="mteamfront w-full text-center">
                  <div className="mteamimg">
                    <Image
                      className="w-full h-auto"
                      priority
                      src={SMuruganImg}
                      alt="logo"
                    />
                  </div>
                  <h3>Murugan</h3>
                </div>
                <div className="mteamback muruganbg">
                  <h3>Murugan</h3>
                  <p>He is an award-winning culinary professional with over 25 years of experience, including 13 years in management roles within the hospitality industry. </p>
                  <p> <button onClick={() => setOpenMurugan(true)}>
                      <span>Read More</span>
                  </button> </p>
                </div>
              </div>

              <div className="flex-none flex mteambox relative">
                <div className="mteamfront w-full text-center">
                  <div className="mteamimg">
                    <Image
                      className="w-full h-auto"
                      priority
                      src={ArulMadhanImg}
                      alt="logo"
                    />
                  </div>
                  <h3>Mathan</h3>
                </div>
                <div className="mteamback arulmathanbg">
                  <h3>Mathan</h3>
                  <p>Our Sous Chef, is a skilled culinary professional with expertise in food production, customer service, and maintaining quality standards.</p>
                  <p>
                    <button onClick={() => setOpenArulMathanThangam(true)}>
                      <span>Read More</span>
                    </button>
                  </p>
                </div>
              </div>

              <div className="flex-none flex mteambox relative">
                <div className="mteamfront w-full text-center">
                  <div className="mteamimg">
                    <Image
                      className="w-full h-auto"
                      priority
                      src={VijayVImg}
                      alt="logo"
                    />
                  </div>
                  <h3>Vijay V</h3>
                </div>
                <div className="mteamback vijayvellbg">
                  <h3>Vijay V</h3>
                  <p>Our Commis 1,a remarkably talented baker and continental cuisine chef. With a flair for baking, Vijay crafts irresistible cookies, brownies, and an array of continental specialties. </p>
                  <p>
                    <button onClick={() => setOpenVijayVellanganni(true)}>
                      <span>Read More</span>
                    </button>
                  </p>
                </div>
              </div>

              <div className="flex-none flex mteambox relative">
                <div className="mteamfront w-full text-center">
                  <div className="mteamimg">
                    <Image
                      className="w-full h-auto"
                      priority
                      src={VijayAntonyImg}
                      alt="logo"
                    />
                  </div>
                  <h3>Vijay A</h3>
                </div>
                <div className="mteamback vijayantonybg">
                  <h3>Vijay A</h3>
                  <p>Our Commis 3, holds a diploma in hotel and catering management from Villupuram.</p>
                  <p>
                    <button onClick={() => setOpenVijayAntony(true)}>
                      <span>Read More</span>
                    </button>
                  </p>
                </div>
              </div>

              <div className="flex-none flex mteambox relative">
                <div className="mteamfront w-full text-center">
                  <div className="mteamimg">
                    <Image
                      className="w-full h-auto"
                      priority
                      src={RavishankarNImg}
                      alt="logo"
                    />
                  </div>
                  <h3>Ravi</h3>
                </div>
                <div className="mteamback ravishankarbg">
                  <h3>Ravi</h3>
                  <p>Ravi is an experienced operations specialist and supervisor with a strong background in managing processes across several notable private firms.</p>
                  <p>
                    <button onClick={() => setOpenRavishankarN(true)}>
                      <span>Read More</span>
                    </button>
                  </p>
                </div>
              </div>

            </div>
            <div className="ateamIconss">
              <div className="ateamicn icontwo absolute">
                <Image
                  src={ateamicon2}
                  priority
                  alt="Icon"
                  className="iconrotates"
                />
              </div>
              <div className="ateamicn iconthree absolute">
                <Image
                  src={ateamicon3}
                  priority
                  alt="Icon"
                  className="iconrotates"
                />
              </div>
              <div className="ateamicn iconfour absolute">
                <Image src={ateamicon4} priority alt="Icon" />
              </div>
              <div className="ateamicn iconfive absolute">
                <Image
                  src={ateamicon5}
                  priority
                  alt="Icon"
                  className="iconrotates"
                />
              </div>
              <div className="ateamicn iconsix absolute">
                <Image src={ateamicon6} priority alt="Icon" />
              </div>
              <div className="ateamicn iconseven absolute">
                <Image
                  src={ateamicon7}
                  priority
                  alt="Icon"
                  className="zoominoutanimi"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="HmvisionSec relative bg-FF6514 flex ">
          <div className="container mx-auto">
            <div className="Hmvisioninrow flex items-center">
              <div className="HmvisionCol ColLeft flex-none w-[60%] visimgcol">
                <Image
                  className="w-full h-auto"
                  priority
                  src={visionimg}
                  alt="logo"
                />
              </div>
              <div className="HmvisionCol ColRight flex-none w-[40%]">
                <div className="hintroLeft combtntb comtilte ">
                  <h4 className="text-white">The vision Behind</h4>
                  <h3 className="flex flex-col text-white">
                    <span className="block">Lunch Bowl</span>
                  </h3>
                  <p className="text-white">
                    To make healthy eating effortless for children and stress free for parents, ensuring every child enjoys a nutritious, delicious and exciting lunch everyday.
                  </p>
                  {/* <p className="text-white">To use vibrant, fresh foods organized in a way that sparks interest and delight in order to create a lunch experience that turns eating into an adventure. </p> */}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="HworktabSec relative bg-white flex py-[12vh]">
          <div className="container mx-auto">
            <div className="hworkTitle combtntb comtilte textcenter  mb-[5vh]">
              <h5 className="text-[#000000]">How IT</h5>
              <h3 className="flex flex-col textFF6514">
                {" "}
                <span className="block">Works?</span>{" "}
              </h3>
              <p className="">
                See how our site works as soon as you register <br />
                and create an account with us.
              </p>
            </div>
            <div className="hworkintrow ">
              <Htoworkslider />
            </div>
          </div>
        </section>
        <section className="abtvideoSec relative">
          <div className="abtvideorow ">
            <AboutVideoSlider />
          </div>
        </section>
        <section className="HOEnviroSec relative bg-4AB138 flex py-[10vh] displaynone">
          <div className="OEnvicontainer">
            <div className="hOEnviroTitle combtntb comtilte textcenter  mb-[5vh]">
              <h4 className="">Our</h4>
              <h3 className="flex flex-col text-white">
                {" "}
                <span className="block">Environment</span>{" "}
              </h3>
              <p className="text-white">
                According to the saying, cleanliness is next to godliness,{" "}
                <br />
                we make sure our workspace is neat and tidy.
              </p>
            </div>
            <div className="hOEnvirorow ">
              <Marquee speed={50} delay={0}>
                <div className="image_wrapper">
                  <Image src={img1} alt="" />
                </div>
                <div className="image_wrapper imgsmlbox">
                  <Image src={img2} alt="" />
                </div>
                <div className="image_wrapper">
                  <Image src={img3} alt="" />
                </div>
                <div className="image_wrapper imgsmlbox">
                  <Image src={img4} alt="" />
                </div>
                <div className="image_wrapper ">
                  <Image src={img5} alt="" />
                </div>
                <div className="image_wrapper imgsmlbox">
                  <Image src={img6} alt="" />
                </div>
              </Marquee>
            </div>
          </div>
        </section>
      </div>
      <Mainfooter />
      <MuruganPopup open={openMurugan} onClose={() => setOpenMurugan(false)} />
      <ArulMathanThangamPopup open={openArulMathanThangam} onClose={() => setOpenArulMathanThangam(false)} />
      <VijayVellanganniPopup open={openVijayVellanganni} onClose={() => setOpenVijayVellanganni(false)} />
      <VijayAntonyPopup open={openVijayAntony} onClose={() => setOpenVijayAntony(false)} />
      <RavishankarNPopup open={openRavishankarN} onClose={() => setOpenRavishankarN(false)} />
    </div>
  );
};

export default AboutUs;
