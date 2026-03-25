import React from 'react'
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@layout/Breadcrumbs";
import Mainheader from '@layout/header/Mainheader';
import Mainfooter from '@layout/footer/Mainfooter';
import HomeProductCard from '@components/product/HomeProductCard';

import ateamicon1 from "../../public/menulist/icons/ban/yellowround-flower.svg";
import ateamicon2 from "../../public/menulist/icons/ban/redstar.svg";
const Menulist = () => {
  return (
    <>
        <div className="menulistpage">    
            <Mainheader  title="Nutritious Food Subscription for School Kids | Lunchbowl" description="Choose nutritious, healthy, and tasty meals for your kid from Lunchbowl’s food subscription menu. Fresh, balanced lunch options delivered daily to school."/>
            <div className='pagebody'>
              <section className="pagebansec MenusLbanersec relative">
                <div className='container mx-auto relative h-full' >
                  <div className='pageinconter relative h-full w-full flex items-center'>
                    <div className='hworkTitle combtntb comtilte'>
                  <h1 className='flex flex-col textFF6514'> <span className='block firstspan'>TINY TASTY BOWL </span> <span className='block'>HEALTHY WHOLE</span> </h1>
                  <p className=''>Fuel your little one’s day with our specially themed KID’S LUNCH BOWL ; <br />wrapped with fresh veggies, delicious flavors and wholesome grains they will <br />love — NUTRITIOUS for them and WORRY-FREE for you.</p>
                        <Breadcrumbs/>
                    </div>
                  </div>
              <div className='menulIconss'>
                <div className='menulicn iconone absolute'><Image src={ateamicon1} priority alt='Icon' className='iconrotates' /></div>
                <div className='menulicn icontwo absolute'><Image src={ateamicon2} priority alt='Icon' className='iconrotates' /></div>
              </div>
                </div>
              </section>
                <section className='HProlistSec inProListsec bg-FFF4D7 relative  flex py-[12vh]'>
                    <div className='container mx-auto' >
                        <div className='hProListTitle combtntb comtilte textcenter mb-[8vh]'>
                            <h3>Little Plates, Big Flavors</h3>
                            <h2 className='flex flex-col textFF6514'>
                                <span className='block'>30+ Nutritious Picks</span> 
                            </h2>
                            <p className=''>Select your child’s go-to cuisine and check out what’s on the menu.</p>
                        </div>
                        <div className='hProList'>
                            <HomeProductCard/>
                        </div>
                    </div>
                </section>
            </div>
            <Mainfooter/>
        </div>
    </>
  )
}

export default Menulist