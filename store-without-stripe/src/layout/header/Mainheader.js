import React from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import myLogo from "../../../public/logo/lunchbowl-logo.svg";
import closeicon from "../../../public/menuclose-icon.svg";
import LoginPopup from "../../components/logInSignUp/LoginPopup";
import HamburgerMenuImg from "../../../public/HamburgerMenuImg.jpg";
import FreeTrialPopup from "../../components/home/FreeTrialPopup";
import SignUpPopup from "../../components/logInSignUp/SignUpPopup";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import LogoutConfirmationPopup from "../../components/logInSignUp/LogoutConfirmationPopup";
import { signOut } from "next-auth/react";
import useRegistration from "@hooks/useRegistration";
import FreeTrialSchoolPopup from "../../components/logInSignUp/FreeTrialSchoolPopup";
import useAsync from "../../hooks/useAsync";
import CategoryServices from "../../services/CategoryServices";



const Mainheader = ({ title, description, children, freeTrialTaken }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [openLogin, setOpenLogin] = useState(false);
  const [freeTrialPopup, setFreeTrialPopup] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isFreeTrial, setIsFreeTrial] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMyAccount, setShowMyAccount] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [shadow, setShow] = React.useState();
  const { submitHandler, loading, error } = useRegistration();
  const [stepCheck, setStepCheck] = useState(null);
  const [apiFreeTrial, setApiFreeTrial] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const [active, setActive] = useState(false);

  const userId = session?.user?.id;
  const freeTrial = session?.user?.freeTrial;

  const { data: schools, loading: loadingSchools, error: errorSchools } = useAsync(CategoryServices.getAllSchools);

  const [showFreeTrialPopup, setShowFreeTrialPopup] = useState(false);

  useEffect(() => {
    const fetchDataAndRoute = async () => {
      try {
        if (!session?.user?.id) {
          throw new Error("User ID not available");
        }

        const result = await submitHandler({
          path: 'Step-Check', // Adjust the path as needed
          _id: session?.user?.id, // Using the user ID from session
        });

        setStepCheck(result?.data?.step);
        setApiFreeTrial(result?.data?.freeTrial);

        console.log("====================================");
        console.log("Step Check Result-->header:", result.data.step);
        console.log("====================================");
      } catch (error) {
        console.error("Error:", error);
        // router.push('/error');
      }
    };

    if (status === "authenticated") {
      fetchDataAndRoute();
    }
  }, [session?.user?.id, status]);


useEffect(() => {
  if (typeof window !== "undefined") {
    const pageWidth = window.innerWidth;
    const body = document.body;

    if (pageWidth > 650) {
      const scrollUp = "scroll-up";
      const scrollDown = "scroll-down";
      const scrollanimi = "sscroll-animi";
      let lastScroll = 0;

      const handleScroll = () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll <= 0) {
          body.classList.remove(scrollUp, scrollDown, scrollanimi);
          return;
        }

        if (currentScroll > lastScroll && !body.classList.contains(scrollDown)) {
          body.classList.remove(scrollUp);
          body.classList.add(scrollDown, scrollanimi);
        } else if (currentScroll < lastScroll && body.classList.contains(scrollDown)) {
          body.classList.remove(scrollDown);
          body.classList.add(scrollUp, scrollanimi);
        }
        lastScroll = currentScroll;
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
        // 🔹 Remove all classes on unmount (page change)
        body.classList.remove(scrollUp, scrollDown, scrollanimi);
      };
    }
  }
}, []);

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await signOut({ callbackUrl: "/" });
    localStorage.clear();
    sessionStorage.clear();
  };

  const handleFreeTrialSubmit = (selectedSchool) => {
    setShowFreeTrialPopup(false);

    // Run your existing flow here after school selection
    if (session) {
      router.push("/free-trial");
    } else {
      setIsFreeTrial(true);
      setShowSignUp(true);
    }
  };

  // detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleClick = () => {
    if (isMobile) {
      setActive((prev) => !prev); // toggle state
    }
  };


  return (
    <>
      <Head>
        <title>{title ? `${title}` : "Lunchbowl "}</title>
        {description && <meta name="description" content={description} />}
        <link ref="icon" href="/favicon.png" />
      </Head>
      <header>
        <div className="headbox flex items-center">
          <div className="myLogo relative h-auto transition transition-all duration-[1s] ease-in-out">
            <Link href="/" className="g:block relative leading-[0]">
              <Image
                className="w-full h-auto"
                priority
                src={myLogo}
                alt="logo"
              />
            </Link>
          </div>
          <div className="navbox">
            <ul className="flex items-center logsinul">
              {/* {stepCheck !== 4 && (
                <li className="nodesign mobhidpplink">
                  <Link href="/plan-pricing">Plan & Pricing</Link>
                </li>
              )} */}
              <li className="nodesign mobhidpplink">
                <Link href="/school-kids-lunch-subscription-service-in-chennai-pricing">Plan & Pricing</Link>
              </li>
              {/* Only show login button if user is not logged in */}
              {!session && (
                <li className="logbtn">
                  <button onClick={() => setOpenLogin(true)}>
                    <span>Sign In</span>
                  </button>
                </li>
              )}
              {/* <li className="trialbtn">
                  <button
                    onClick={() =>
                     setFreeTrialPopup(true) 
                    }
                  >
                    <span>Start Free Trial</span>
                  </button>
                </li> */}
              {!(apiFreeTrial == true || stepCheck == 4 || freeTrialTaken == true) && (
                <li className="trialbtn">
                  <button onClick={() => setShowFreeTrialPopup(true)}>
                    <span>Start Free Trial</span>
                  </button>
                </li>
              )}

              {/* Only show user menu if user is logged in */}
              {session && (
                stepCheck === 4 ? (
                  // StepCheck === 4 → Full My Account menu
                  <li className="userMenuBtn" style={{ position: "relative" }}>
                    <button onClick={handleClick}>
                      <span>My Account</span>
                    </button>
                    <ul className={`submenuul ${active ? "submenuulactive" : ""}`}>
                      <li>
                        <Link href="/user/userDashBoard">Dashboard</Link>
                      </li>
                      <li>
                        <Link href="/user/menuCalendarPage">Menu Calendar</Link>
                      </li>
                      <li>
                        <Link href="/user/my-account">My Profile</Link>
                      </li>
                      <li>
                        <Link href="/user/wallet">My Wallet</Link>
                      </li>
                      <li>
                        <Link href="/user/transaction-page">Transactions</Link>
                      </li>
                      <li>
                        <button onClick={() => setShowLogoutConfirm(true)}>Log Out</button>
                      </li>
                    </ul>
                  </li>

                ) : (
                  // StepCheck !== 4 → Show only username + logout
                  <li className="userMenuBtn" style={{ position: "relative" }}>
                    <button onClick={() => setShowUserMenu((prev) => !prev)}>
                      <span>{session.user?.name || "User"}</span>
                    </button>
                    {showUserMenu && (
                      <ul className="submenuul">
                        <li>
                          <button onClick={() => setShowLogoutConfirm(true)}>
                            Log Out
                          </button>
                        </li>
                      </ul>
                    )}
                  </li>
                )
              )}

            </ul>
            <div className="hmenubox" onClick={() => setShow(true)}>
              <h6>Menu</h6>
              <div className="hmenuline">
                <div className="line lineone"> &nbsp; </div>
                <div className="line linetwo"> &nbsp; </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className={shadow ? "shadow" : ""} id="HamburgerMegamenu">
        <div className="mm-main-container">
          <div className="megamenu-container">
            <div className="mmMenuColL">
              <Image
                className="w-full h-auto"
                priority
                src={HamburgerMenuImg}
                alt="logo"
              />
            </div>
            <div className="mmMenuColR">
              <button
                className="Hamburgermm-close"
                id="Hamburgermm-close"
                onClick={() => setShow(false)}
              >
                <Image src={closeicon} alt="" />
              </button>
              <div className="mmMenuCon">
                <ul className="HamBSMenu">
                  <li className="nav__item hamnavlink">
                    <Link href="/">Home</Link>
                  </li>
                  {session && stepCheck === 4 && (
                    <li className="nav__item hamnavlink">
                      <Link href="/user/my-account">My Account</Link>
                    </li>
                  )}

                  <li className="nav__item hamnavlink">
                    <Link href="/about-us">About Us</Link>
                  </li>
                  <li className="nav__item hamnavlink">
                    <Link href="/school-kids-lunch-subscription-service-in-chennai-pricing">Plan & Pricing</Link>
                  </li>
                  <li className="nav__item hamnavlink">
                    <Link href="/kids-nutritious-lunch-subscription-menu">Food Menu</Link>
                  </li>
                  <li className="nav__item hamnavlink">
                    <Link href="/contact-us">Contact Us</Link>
                  </li>
                </ul>
                <ul className="HamSMediaul">
                  <li className="nav__item hamnavlink">
                    <Link href="https://www.instagram.com/lunch_bowl_?igsh=d3kxM3k3cHJwc2F0" target="_blank">Instagram</Link>
                  </li>
                  <li className="nav__item hamnavlink">
                    <Link href="https://www.facebook.com/share/1CChGD5qf6/" target="_blank">Facebook</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* MyAccount component popup/modal */}
      {showMyAccount && (
        <MyAccount userId={userId} onClose={() => setShowMyAccount(false)} />
      )}
      <LoginPopup open={openLogin} onClose={() => setOpenLogin(false)} />
      <FreeTrialPopup
        open={freeTrialPopup}
        onClose={() => setFreeTrialPopup(false)}
      />
      <SignUpPopup open={showSignUp} onClose={() => setShowSignUp(false)} freeTrial={isFreeTrial} />
      <LogoutConfirmationPopup
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
      <FreeTrialSchoolPopup
        open={showFreeTrialPopup}
        onClose={() => setShowFreeTrialPopup(false)}
        onSubmit={handleFreeTrialSubmit}
        schools={schools}
        loadingSchools={loadingSchools} // updated variable name here
        errorLoadingSchools={errorSchools} // updated variable name here
      />


    </>
  );
};

export default Mainheader;