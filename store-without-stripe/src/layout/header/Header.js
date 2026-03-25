import React from 'react';
import Link from "next/link";
import Image from "next/image";
import myLogo from "../../../public/logo/lunchbowl-logo.svg"

const Header = () => {
  return (
    <>
    <header>
        <div className=''>
            <Link href="/" className="mr-3 lg:mr-12 xl:mr-12 hidden md:hidden lg:block" >
              <div className="relative w-32 h-10">
                <Image
                  className="w-full h-auto"
                  priority
                  src= {myLogo}
                  alt="logo"
                />
              </div>
            </Link>
        </div>
    </header>
    </>
  )
}

export default Header