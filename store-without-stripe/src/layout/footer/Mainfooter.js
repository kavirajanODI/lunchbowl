import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ctaimg from "../../../public/ctaimg.png";
import myLogo from "../../../public/logo/lunchbowl-logo.svg";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import GetinTouch from "./GetinTouch";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useRegistration from "@hooks/useRegistration";

import hldocticon1 from "../../../public/home/icons/footfrom/violet-and-yellow-star.svg";
import hldocticon2 from "../../../public/home/icons/footfrom/rounded.svg";
import hldocticon3 from "../../../public/home/icons/footfrom/skybluestar.svg";
import hldocticon4 from "../../../public/home/icons/footfrom/greenlayer-yellowstar.svg";
import hldocticon5 from "../../../public/home/icons/footfrom/greenheart.svg";
import hldocticon6 from "../../../public/home/icons/footfrom/pinkstar.svg";
import hldocticon7 from "../../../public/home/icons/footfrom/line-and-pinkround.svg";
import whatsapp from "../../../public/whatsapp-icon.svg";

const Mainfooter = () => {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  const { submitHandler } = useRegistration();
  const [stepCheck, setStepCheck] = useState(null);
  const router = useRouter();

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  // Fetch stepCheck for logged-in users
  useEffect(() => {
    const fetchStep = async () => {
      try {
        if (!session?.user?.id) return;
        const result = await submitHandler({
          path: "Step-Check",
          _id: session.user.id,
        });
        setStepCheck(result?.data?.step);
      } catch (err) {
        console.error("Error fetching stepCheck:", err);
      }
    };
    if (status === "authenticated") {
      fetchStep();
    }
  }, [session?.user?.id, status]);

  return (
    <>
      <section className="HctaSec relative flex py-[12vh]">
        <div className="container mx-auto relative">
          <div className="HctatImg w-[45%] m-auto">
            <Image className="w-full" priority src={ctaimg} alt="logo" />
          </div>
          <div className="HctaTitle combtntb textcenter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <h4 className="">We’d Love to Hear</h4>
            <h3 className="flex flex-col textFF6514">
              {" "}
              <span className="block">From You</span>{" "}
            </h3>
            <p className="">
              We are super excited in cooking and <br />
              providing the best meals to your kids. <br />
              Give us a try.
            </p>
            <p className="parabtn flex mt-[3vh]">
              <button className="emenulink relative" onClick={handleOpenDialog}>
                <span className="block flex items-center relative">
                  Get in Touch
                </span>
              </button>
            </p>
          </div>
          <div className="hfformIconss">
            <div className="hfformicn iconone absolute">
              <Image src={hldocticon1} priority alt="Icon" />
            </div>
            <div className="hfformicn icontwo absolute">
              <Image
                src={hldocticon2}
                priority
                alt="Icon"
                className="iconrotates"
              />
            </div>
            <div className="hfformicn iconthree absolute">
              <Image
                src={hldocticon3}
                priority
                alt="Icon"
                className="iconrotates"
              />
            </div>
            <div className="hfformicn iconfour absolute">
              <Image
                src={hldocticon4}
                priority
                alt="Icon"
                className="iconrotates "
              />
            </div>
            <div className="hfformicn iconfive absolute">
              <Image
                src={hldocticon5}
                priority
                alt="Icon"
                className="zoominoutanimi"
              />
            </div>
            <div className="hfformicn iconsix absolute">
              <Image
                src={hldocticon6}
                priority
                alt="Icon"
                className="iconrotates"
              />
            </div>
            <div className="hfformicn iconseven absolute">
              <Image
                src={hldocticon7}
                priority
                alt="Icon"
                className="iconrubberband"
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="FooterSec relative flex flex-wrap">
        <div className="container mx-auto relative">
          <div className="Footertop m-auto py-[8vh] textcenter">
            <div className="footlogo w-[100px] m-auto mb-[2vh]">
              <Link href="/">
                <Image className="w-full" priority src={myLogo} alt="logo" />
              </Link>
            </div>
            <p className="text-white mb-[2vh]">
              Fresh, healthy school lunches delivered with care, <br />
              making mealtime easy for you.
            </p>
            <div className="SomediaBox flex justify-center  mb-[2vh]">
              <ul className="Somediaul flex justify-center">
                <li className="flex items-center mr-3 transition ease-in-out duration-500">
                  <Link
                    href="https://www.facebook.com/share/1CChGD5qf6/"
                    aria-label="Social Link"
                    rel="noreferrer"
                    target="_blank"
                    className="facebooklink"
                  >
                    <FaFacebookF />
                  </Link>
                </li>
                <li className="flex items-center  mr-3 transition ease-in-out duration-500">
                  <Link
                    href="https://www.instagram.com/lunch_bowl_?igsh=d3kxM3k3cHJwc2F0"
                    aria-label="Social Link"
                    rel="noreferrer"
                    target="_blank"
                    className="instagramlink"
                  >
                    <FaInstagram />
                  </Link>
                </li>
              </ul>
            </div>
            <ul className="footmenu flex justify-center">
              <li>
                <Link href="/" className="relative">
                  <span className="block flex items-center relative">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="relative">
                  <span className="block flex items-center relative">
                    About Us
                  </span>
                </Link>
              </li>
              {/* <li><Link href="/user/my-account" className="relative" ><span className='block flex items-center relative'>My Account</span></Link></li> */}
              <li>
                <Link
                  href="/kids-nutritious-lunch-subscription-menu"
                  className="relative"
                >
                  <span className="block flex items-center relative">
                    Food Menu
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="relative">
                  <span className="block flex items-center relative">
                    Contact Us
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="footcopyrow columns-2 py-3">
            <div className="copycol">
              <p className="text-white">
                Copyright © 2025. Lunch Bowl /&nbsp;
                <Link href="https://opendesignsin.com/" target="_blank">
                  Designed By
                </Link>
              </p>
            </div>
            <div className="copymenucol">
              <ul className="footmenu flex justify-end">
                <li>
                  <Link href="/terms-and-conditions/" className="relative">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy/" className="relative">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/refund-cancellation-policy/"
                    className="relative"
                  >
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          {/* >>> Registration Completion Prompt <<< */}
        </div>
        {session && stepCheck !== 4 && (
          <div className="incomplete-registration-msgspace">&nbsp;</div>
        )}
      </footer>
      {session && stepCheck !== 4 && (
        <div className="incomplete-registration-msg">
          <div className="incregbox">
            If you didn’t complete your registration?{" "}
            <button
              onClick={() => router.push("/user/profile-Step-Form")}
              className="theme-link"
            >
              Please click here
            </button>
          </div>
        </div>
      )}
      <GetinTouch open={open} onClose={handleCloseDialog} />
      <div className="mainwhatsapbox">
        <a
          href="https://web.whatsapp.com/send?phone=919176917602&amp;text="
          target="_blank"
          className="webwhatsapplink"
        >
          <Image src={whatsapp} alt="Whatsapp" />
        </a>
        <a
          href="https://api.whatsapp.com/send?phone=919176917602&amp;text="
          target="_blank"
          className="mobwhatsapplink"
        >
          <Image src={whatsapp} alt="Whatsapp" />
        </a>
      </div>

      <div className="forworking">
        <Link href="https://pro.lunchbowl.co.in/" target="_blank">
          <button className="your-button-style">
            For working professionals & Homes
          </button>
        </Link>
      </div>
    </>
  );
};

export default Mainfooter;
