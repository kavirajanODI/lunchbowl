import React from 'react';
import { useState } from "react";
import Link from "next/link";
import Slider from "react-slick";
import Image from "next/image";
import teamimgone from "../../../public/home/teamimg-one.jpg";

import ArulMadhanImg from "../../../public/home/team/hArulMadhanImg.jpg"
import RavishankarNImg from "../../../public/home/team/hRavishankarNImg.jpg"
import SMuruganImg from "../../../public/home/team/hSMuruganImg.jpg"
import VijayAntonyImg from "../../../public/home/team/hVijayAntonyImg.jpg"
import VijayVImg from "../../../public/home/team/hVijayVImg.jpg"

import MuruganPopup from "@components/about/teams/MuruganPopup";
import ArulMathanThangamPopup from "@components/about/teams/ArulMathanThangamPopup";
import VijayVellanganniPopup from "@components/about/teams/VijayVellanganniPopup";
import VijayAntonyPopup from "@components/about/teams/VijayAntonyPopup";
import RavishankarNPopup from "@components/about/teams/RavishankarNPopup";

const Hoteamsslide = () => {
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024, // Tablet and below
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 800, // Tablet and below
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 650, // Mobile devices
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const [openMurugan, setOpenMurugan] = useState(false);
    const [openArulMathanThangam, setOpenArulMathanThangam] = useState(false);
    const [openVijayVellanganni, setOpenVijayVellanganni] = useState(false);
    const [openVijayAntony, setOpenVijayAntony] = useState(false);
    const [openRavishankarN, setOpenRavishankarN] = useState(false);
  return (
    <>
        <div className="slider-container">
      <Slider {...settings} className='teamsliders'>
                  <div>
                      <div className='flex teambox items-center group relative overflow-hidden layone'>
                          <div className='flex-1 teamboximg overflow-hidden '>
                              <Image className="w-full h-auto m-auto" priority src={SMuruganImg} alt="logo" />
                </div>       
                <div className='flex-1 teamboxcont absolute t-0 l-0 w-full h-full flex flex-col items-center justify-center'>
                              <h4>Murugan</h4>
                              <p><button onClick={() => setOpenMurugan(true)}>
                                  <span>Read More</span>
                              </button></p>
                </div>                    
            </div> 
        </div>
        <div>
                      <div className='flex teambox items-center group relative overflow-hidden laytwo'>
                          <div className='flex-1 teamboximg overflow-hidden '>
                              <Image className="w-full h-auto m-auto" priority src={ArulMadhanImg} alt="logo" />
                </div>       
                <div className='flex-1 teamboxcont absolute t-0 l-0 w-full h-full flex flex-col items-center justify-center'>
                              <h4>Mathan</h4>
                              <p><button onClick={() => setOpenArulMathanThangam(true)}>
                                  <span>Read More</span>
                              </button></p>
                </div>                    
            </div> 
        </div>
        <div>
                      <div className='flex teambox items-center group relative overflow-hidden laythree'>
                          <div className='flex-1 teamboximg overflow-hidden '>
                              <Image className="w-full h-auto m-auto" priority src={VijayVImg} alt="logo" />
                </div>       
                <div className='flex-1 teamboxcont absolute t-0 l-0 w-full h-full flex flex-col items-center justify-center'>
                              <h4>Vijay V</h4>
                              <p><button onClick={() => setOpenVijayVellanganni(true)}>
                                  <span>Read More</span>
                              </button></p>
                </div>                    
            </div> 
        </div>
        <div>
                      <div className='flex teambox items-center group relative overflow-hidden layfour'>
                          <div className='flex-1 teamboximg overflow-hidden '>
                              <Image className="w-full h-auto m-auto" priority src={VijayAntonyImg} alt="logo" />
                </div>       
                <div className='flex-1 teamboxcont absolute t-0 l-0 w-full h-full flex flex-col items-center justify-center'>
                              <h4>Vijay A</h4>
                              <p><button onClick={() => setOpenVijayAntony(true)}>
                                  <span>Read More</span>
                              </button></p>
                </div>                    
            </div> 
                  </div>
                  <div>
                      <div className='flex teambox items-center group relative overflow-hidden layone'>
                          <div className='flex-1 teamboximg overflow-hidden '>
                              <Image className="w-full h-auto m-auto" priority src={RavishankarNImg} alt="logo" />
                          </div>
                          <div className='flex-1 teamboxcont absolute t-0 l-0 w-full h-full flex flex-col items-center justify-center'>
                              <h4>Ravi</h4>
                              <p><button onClick={() => setOpenRavishankarN(true)}>
                                  <span>Read More</span>
                              </button></p>
                          </div>
                      </div>
                  </div>
      </Slider>
    </div>

          <MuruganPopup open={openMurugan} onClose={() => setOpenMurugan(false)} />
          <ArulMathanThangamPopup open={openArulMathanThangam} onClose={() => setOpenArulMathanThangam(false)} />
          <VijayVellanganniPopup open={openVijayVellanganni} onClose={() => setOpenVijayVellanganni(false)} />
          <VijayAntonyPopup open={openVijayAntony} onClose={() => setOpenVijayAntony(false)} />
          <RavishankarNPopup open={openRavishankarN} onClose={() => setOpenRavishankarN(false)} />
    </>
  )
}

export default Hoteamsslide