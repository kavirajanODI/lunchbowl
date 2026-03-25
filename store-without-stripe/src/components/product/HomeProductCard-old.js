import React from 'react';
import { useState } from 'react';
import Image from "next/image";
import Proimgbiriyani from "../../../public/home/biriyani-img.png"
import Proimgtwobiriyani from "../../../public/home/biriyani-img-two.png"
import logtrialicon from "../../../public/logtrial-icon.svg"
import ProdetilProps from '@components/product/ProdetilProps';


const HomeProductCard = () => {
    const [open, setOpen] = useState(false);

    const handleOpenDialog = () => {
      setOpen(true);
    };
  
    const handleCloseDialog = () => {
      setOpen(false);
    };
  return (    
    <>
        <div className='flex flex-row max-md:flex-col-reverse flex-wrap' >
            <div className='group progroupitem basis-sm flex-none relative rounded-[15px] overflow-hidden' onClick={handleOpenDialog} >            
                <div className='proboxfront px-[2vw] py-[5vh] bg-FFF4D7 relative z-50 group-hover:z-0'>
                    <div className='fontanimi pointer-events-none'>
                        <div className='animitext animiOne'><span>Veg Biriyani</span><span>Veg Biriyani</span></div>
                        <div className='animitext animiTwo'><span>Biriyani Veg</span><span>Biriyani Veg</span></div>
                    </div>
                    <div className='profbboxs'>
                        <div className='textcenter proboxtitle mb-[3vh]'>
                            <h5>Veg</h5>
                            <h3>Biriyani</h3>
                            <p>Taste our delicious veg biryani. <br/>A small bite of pure delight awaits.</p>
                        </div>
                        <div className='proImage'>
                            <Image className="w-full h-auto" priority src= {Proimgbiriyani} alt="logo" />
                        </div>
                    </div>
                </div>
                <div className='proboxBack px-[2vw] py-[3vh] bg-FFF4D7 absolute w-full h-full top-0 left-0 opacity-0 z-0 transition transition-all duration-[1s] ease-in-out group-hover:opacity-100 group-hover:z-50'>
                    <div className='arrowIcon absolute right-[2vw] top-[5vh] w-[45px] aspect-square bg-white rounded-full p-[12px]'><Image className="w-full h-auto" priority src= {logtrialicon} alt="logo" /></div>
                    <div className='fontanimi pointer-events-none'>
                        <div className='animitext animiOne'><span>Veg Biriyani</span><span>Veg Biriyani</span></div>
                        <div className='animitext animiTwo'><span>Biriyani Veg</span><span>Biriyani Veg</span></div>
                    </div>
                    <div className='profbboxs relative h-full flex flex-col'>
                        <div className='proImage px-[2vw] h-full flex items-center'>
                            <Image className="w-full h-auto" priority src= {Proimgtwobiriyani} alt="logo" />
                        </div>
                        <div className='nutritionboxs mt-[auto] flex flex-wrap'>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Calories</h5>
                                <ul className="flex items-center w-[50%] onebox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Carbs</h5>
                                <ul className="flex items-center w-[50%] twobox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Proteins</h5>
                                <ul className="flex items-center w-[50%] threebox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Fats</h5>
                                <ul className="flex items-center w-[50%] fourbox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Vitamins</h5>
                                <ul className="flex items-center w-[50%] fivebox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Minerals</h5>
                                <ul className="flex items-center w-[50%] threebox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='group progroupitem basis-sm flex-none relative rounded-[15px] overflow-hidden' onClick={handleOpenDialog} >            
                <div className='proboxfront px-[2vw] py-[5vh] bg-FFF4D7 relative z-50 group-hover:z-0'>
                    <div className='fontanimi pointer-events-none'>
                        <div className='animitext animiOne'><span>Veg Biriyani</span><span>Veg Biriyani</span></div>
                        <div className='animitext animiTwo'><span>Biriyani Veg</span><span>Biriyani Veg</span></div>
                    </div>
                    <div className='profbboxs'>
                        <div className='textcenter proboxtitle mb-[3vh]'>
                            <h5>Veg</h5>
                            <h3>Biriyani</h3>
                            <p>Taste our delicious veg biryani. <br/>A small bite of pure delight awaits.</p>
                        </div>
                        <div className='proImage'>
                            <Image className="w-full h-auto" priority src= {Proimgbiriyani} alt="logo" />
                        </div>
                    </div>
                </div>
                <div className='proboxBack px-[2vw] py-[3vh] bg-FFF4D7 absolute w-full h-full top-0 left-0 opacity-0 z-0 transition transition-all duration-[1s]  ease-in-out group-hover:opacity-100 group-hover:z-50'>
                    <div className='arrowIcon absolute right-[2vw] top-[5vh] w-[45px] aspect-square bg-white rounded-full p-[12px]'><Image className="w-full h-auto" priority src= {logtrialicon} alt="logo" /></div>
                    <div className='fontanimi pointer-events-none'>
                        <div className='animitext animiOne'><span>Veg Biriyani</span><span>Veg Biriyani</span></div>
                        <div className='animitext animiTwo'><span>Biriyani Veg</span><span>Biriyani Veg</span></div>
                    </div>
                    <div className='profbboxs relative h-full flex flex-col'>
                        <div className='proImage px-[2vw] h-full flex items-center'>
                            <Image className="w-full h-auto" priority src= {Proimgtwobiriyani} alt="logo" />
                        </div>
                        <div className='nutritionboxs mt-[auto] flex flex-wrap'>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Calories</h5>
                                <ul className="flex items-center w-[50%] onebox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Carbs</h5>
                                <ul className="flex items-center w-[50%] twobox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Proteins</h5>
                                <ul className="flex items-center w-[50%] threebox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Fats</h5>
                                <ul className="flex items-center w-[50%] fourbox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Vitamins</h5>
                                <ul className="flex items-center w-[50%] fivebox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Minerals</h5>
                                <ul className="flex items-center w-[50%] threebox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='group progroupitem basis-sm flex-none relative rounded-[15px] overflow-hidden' onClick={handleOpenDialog} >            
                <div className='proboxfront px-[2vw] py-[5vh] bg-FFF4D7 relative z-50 group-hover:z-0'>
                    <div className='fontanimi pointer-events-none'>
                        <div className='animitext animiOne'><span>Veg Biriyani</span><span>Veg Biriyani</span></div>
                        <div className='animitext animiTwo'><span>Biriyani Veg</span><span>Biriyani Veg</span></div>
                    </div>
                    <div className='profbboxs'>
                        <div className='textcenter proboxtitle mb-[3vh]'>
                            <h5>Veg</h5>
                            <h3>Biriyani</h3>
                            <p>Taste our delicious veg biryani. <br/>A small bite of pure delight awaits.</p>
                        </div>
                        <div className='proImage'>
                            <Image className="w-full h-auto" priority src= {Proimgbiriyani} alt="logo" />
                        </div>
                    </div>
                </div>
                <div className='proboxBack px-[2vw] py-[3vh] bg-FFF4D7 absolute w-full h-full top-0 left-0 opacity-0 z-0 transition transition-all duration-[1s] ease-in-out group-hover:opacity-100 group-hover:z-50'>
                    <div className='arrowIcon absolute right-[2vw] top-[5vh] w-[45px] aspect-square bg-white rounded-full p-[12px]'><Image className="w-full h-auto" priority src= {logtrialicon} alt="logo" /></div>
                    <div className='fontanimi pointer-events-none'>
                        <div className='animitext animiOne'><span>Veg Biriyani</span><span>Veg Biriyani</span></div>
                        <div className='animitext animiTwo'><span>Biriyani Veg</span><span>Biriyani Veg</span></div>
                    </div>
                    <div className='profbboxs relative h-full flex flex-col'>
                        <div className='proImage px-[2vw] h-full flex items-center'>
                            <Image className="w-full h-auto" priority src= {Proimgtwobiriyani} alt="logo" />
                        </div>
                        <div className='nutritionboxs mt-[auto] flex flex-wrap'>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Calories</h5>
                                <ul className="flex items-center w-[50%] onebox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Carbs</h5>
                                <ul className="flex items-center w-[50%] twobox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Proteins</h5>
                                <ul className="flex items-center w-[50%] threebox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Fats</h5>
                                <ul className="flex items-center w-[50%] fourbox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Vitamins</h5>
                                <ul className="flex items-center w-[50%] fivebox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Minerals</h5>
                                <ul className="flex items-center w-[50%] threebox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='group progroupitem basis-sm flex-none relative rounded-[15px] overflow-hidden' onClick={handleOpenDialog} >            
                <div className='proboxfront px-[2vw] py-[5vh] bg-FFF4D7 relative z-50 group-hover:z-0'>
                    <div className='fontanimi pointer-events-none'>
                        <div className='animitext animiOne'><span>Veg Biriyani</span><span>Veg Biriyani</span></div>
                        <div className='animitext animiTwo'><span>Biriyani Veg</span><span>Biriyani Veg</span></div>
                    </div>
                    <div className='profbboxs'>
                        <div className='textcenter proboxtitle mb-[3vh]'>
                            <h5>Veg</h5>
                            <h3>Biriyani</h3>
                            <p>Taste our delicious veg biryani. <br/>A small bite of pure delight awaits.</p>
                        </div>
                        <div className='proImage'>
                            <Image className="w-full h-auto" priority src= {Proimgbiriyani} alt="logo" />
                        </div>
                    </div>
                </div>
                <div className='proboxBack px-[2vw] py-[3vh] bg-FFF4D7 absolute w-full h-full top-0 left-0 opacity-0 z-0 transition transition-all duration-[1s] ease-in-out group-hover:opacity-100 group-hover:z-50'>
                    <div className='arrowIcon absolute right-[2vw] top-[5vh] w-[45px] aspect-square bg-white rounded-full p-[12px]'><Image className="w-full h-auto" priority src= {logtrialicon} alt="logo" /></div>
                    <div className='fontanimi pointer-events-none'>
                        <div className='animitext animiOne'><span>Veg Biriyani</span><span>Veg Biriyani</span></div>
                        <div className='animitext animiTwo'><span>Biriyani Veg</span><span>Biriyani Veg</span></div>
                    </div>
                    <div className='profbboxs relative h-full flex flex-col'>
                        <div className='proImage px-[2vw] h-full flex items-center'>
                            <Image className="w-full h-auto" priority src= {Proimgtwobiriyani} alt="logo" />
                        </div>
                        <div className='nutritionboxs mt-[auto] flex flex-wrap'>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Calories</h5>
                                <ul className="flex items-center w-[50%] onebox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Carbs</h5>
                                <ul className="flex items-center w-[50%] twobox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Proteins</h5>
                                <ul className="flex items-center w-[50%] threebox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Fats</h5>
                                <ul className="flex items-center w-[50%] fourbox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Vitamins</h5>
                                <ul className="flex items-center w-[50%] fivebox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Minerals</h5>
                                <ul className="flex items-center w-[50%] threebox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='group progroupitem basis-sm flex-none relative rounded-[15px] overflow-hidden' onClick={handleOpenDialog} >            
                <div className='proboxfront px-[2vw] py-[5vh] bg-FFF4D7 relative z-50 group-hover:z-0'>
                    <div className='fontanimi pointer-events-none'>
                        <div className='animitext animiOne'><span>Veg Biriyani</span><span>Veg Biriyani</span></div>
                        <div className='animitext animiTwo'><span>Biriyani Veg</span><span>Biriyani Veg</span></div>
                    </div>
                    <div className='profbboxs'>
                        <div className='textcenter proboxtitle mb-[3vh]'>
                            <h5>Veg</h5>
                            <h3>Biriyani</h3>
                            <p>Taste our delicious veg biryani. <br/>A small bite of pure delight awaits.</p>
                        </div>
                        <div className='proImage'>
                            <Image className="w-full h-auto" priority src= {Proimgbiriyani} alt="logo" />
                        </div>
                    </div>
                </div>
                <div className='proboxBack px-[2vw] py-[3vh] bg-FFF4D7 absolute w-full h-full top-0 left-0 opacity-0 z-0 transition transition-all duration-[1s] ease-in-out group-hover:opacity-100 group-hover:z-50'>
                    <div className='arrowIcon absolute right-[2vw] top-[5vh] w-[45px] aspect-square bg-white rounded-full p-[12px]'><Image className="w-full h-auto" priority src= {logtrialicon} alt="logo" /></div>
                    <div className='fontanimi pointer-events-none'>
                        <div className='animitext animiOne'><span>Veg Biriyani</span><span>Veg Biriyani</span></div>
                        <div className='animitext animiTwo'><span>Biriyani Veg</span><span>Biriyani Veg</span></div>
                    </div>
                    <div className='profbboxs relative h-full flex flex-col'>
                        <div className='proImage px-[2vw] h-full flex items-center'>
                            <Image className="w-full h-auto" priority src= {Proimgtwobiriyani} alt="logo" />
                        </div>
                        <div className='nutritionboxs mt-[auto] flex flex-wrap'>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Calories</h5>
                                <ul className="flex items-center w-[50%] onebox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Carbs</h5>
                                <ul className="flex items-center w-[50%] twobox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Proteins</h5>
                                <ul className="flex items-center w-[50%] threebox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Fats</h5>
                                <ul className="flex items-center w-[50%] fourbox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Vitamins</h5>
                                <ul className="flex items-center w-[50%] fivebox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Minerals</h5>
                                <ul className="flex items-center w-[50%] threebox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='group progroupitem basis-sm flex-none relative rounded-[15px] overflow-hidden' onClick={handleOpenDialog} >            
                <div className='proboxfront px-[2vw] py-[5vh] bg-FFF4D7 relative z-50 group-hover:z-0'>
                    <div className='fontanimi pointer-events-none'>
                        <div className='animitext animiOne'><span>Veg Biriyani</span><span>Veg Biriyani</span></div>
                        <div className='animitext animiTwo'><span>Biriyani Veg</span><span>Biriyani Veg</span></div>
                    </div>
                    <div className='profbboxs'>
                        <div className='textcenter proboxtitle mb-[3vh]'>
                            <h5>Veg</h5>
                            <h3>Biriyani</h3>
                            <p>Taste our delicious veg biryani. <br/>A small bite of pure delight awaits.</p>
                        </div>
                        <div className='proImage'>
                            <Image className="w-full h-auto" priority src= {Proimgbiriyani} alt="logo" />
                        </div>
                    </div>
                </div>
                <div className='proboxBack px-[2vw] py-[3vh] bg-FFF4D7 absolute w-full h-full top-0 left-0 opacity-0 z-0 transition transition-all duration-[1s] ease-in-out group-hover:opacity-100 group-hover:z-50'>
                    <div className='arrowIcon absolute right-[2vw] top-[5vh] w-[45px] aspect-square bg-white rounded-full p-[12px]'><Image className="w-full h-auto" priority src= {logtrialicon} alt="logo" /></div>
                    <div className='fontanimi pointer-events-none'>
                        <div className='animitext animiOne'><span>Veg Biriyani</span><span>Veg Biriyani</span></div>
                        <div className='animitext animiTwo'><span>Biriyani Veg</span><span>Biriyani Veg</span></div>
                    </div>
                    <div className='profbboxs relative h-full flex flex-col'>
                        <div className='proImage px-[2vw] h-full flex items-center'>
                            <Image className="w-full h-auto" priority src= {Proimgtwobiriyani} alt="logo" />
                        </div>
                        <div className='nutritionboxs mt-[auto] flex flex-wrap'>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Calories</h5>
                                <ul className="flex items-center w-[50%] onebox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Carbs</h5>
                                <ul className="flex items-center w-[50%] twobox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Proteins</h5>
                                <ul className="flex items-center w-[50%] threebox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Fats</h5>
                                <ul className="flex items-center w-[50%] fourbox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Vitamins</h5>
                                <ul className="flex items-center w-[50%] fivebox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                <h5 className='w-[50%]'>Minerals</h5>
                                <ul className="flex items-center w-[50%] threebox">
                                    <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <ProdetilProps  open={open} onClose={handleCloseDialog}  />
    </>
  )
}

export default HomeProductCard