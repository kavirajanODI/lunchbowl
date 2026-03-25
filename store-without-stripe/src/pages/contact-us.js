import React from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@layout/Breadcrumbs";
import Mainheader from '@layout/header/Mainheader';
import Mainfooter from '@layout/footer/Mainfooter';
import Accordion from '@components/faq/Accordion';
import { useForm, Controller } from "react-hook-form";
import useTranslation from "next-translate/useTranslation";
import { notifySuccess } from "@utils/toast";
import contforming from '../../public/contus/contforming.png'
import phoneicon from '../../public/contus/phone-icon.png'
import mailicon from '../../public/contus/mail-icon.png'
import locaticon from '../../public/contus/locat-icon.png'
import ateamicon1 from "../../public/menulist/icons/ban/yellowround-flower.svg";
import ateamicon2 from "../../public/menulist/icons/ban/redstar.svg";
import useEmail from "@hooks/useEmail";
import { TextField, Checkbox, FormControlLabel } from '@mui/material';

const ContactUs = () => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstname: "",
      Lastname: "",
      email: "",
      phone: "",
      message: "",
      consent: false,
    },
  });

  const { sendContactUsEmail, loading } = useEmail();

  const submitHandler = async (data) => {
    const errs = {};
    if (!data.firstname.trim()) errs.firstname = "First name is required!";
    if (!data.Lastname.trim()) errs.Lastname = "Last name is required!";
    if (!data.email.trim()) {
      errs.email = "Email is required!";
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(data.email)) {
      errs.email = "Enter a valid email.";
    }
    if (!data.phone.trim()) {
      errs.phone = "Mobile Number is required!";
    } else if (!/^[6-9]\d{9}$/.test(data.phone)) {
      errs.phone = "Enter a valid 10-digit Indian mobile number starting with 6,7,8, or 9";
    }
    if (!data.message.trim()) {
      errs.message = "Message is required!";
    } else if (data.message.trim().length < 5) {
      errs.message = "Message must be at least 5 characters.";
    }
    if (!data.consent) {
      errs.consent = "Please agree to be contacted by Lunch Bowl.";
    }
    if (Object.keys(errs).length > 0) {
      alert(Object.values(errs).join("\n"));
      return;
    }
    try {
      await sendContactUsEmail(data);
      alert("your message sent successfully. We will contact you shortly.");
      reset();
    } catch (error) {
      alert("Something went wrong! Please try again.");
    }
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

  return (
    <div className="contuspage">
      <Mainheader title="Lunch Subscription Service for School Kids in Chennai" description="Get fresh, vegetarian lunch box delivery for school kids in Chennai from Lunchbowl, nutritionist-approved, tasty food delivered to school. Contact us today!" />
      <div className="pagebody">
        <section className="pagebansec contusbanersec relative">
          <div className="container mx-auto relative h-full">
            <div className="pageinconter relative h-full w-full flex items-center">
              <div className="hworkTitle combtntb comtilte">
                <h1 className="flex flex-col textFF6514">
                  {" "}
                  <span className="block firstspan">Let’s Cook Up</span>{" "}
                  <span className="block">a Conversation</span>{" "}
                </h1>
                <p className="">
                  We not only boil, fry and roast the ingredients, but also{" "}
                  <br />
                  we love to cook up a conversation with the people we love!
                </p>
                <Breadcrumbs />
              </div>
            </div>
            <div className="menulIconss">
              <div className="menulicn iconone absolute">
                <Image
                  src={ateamicon1}
                  priority
                  alt="Icon"
                  className="iconrotates"
                />
              </div>
              <div className="menulicn icontwo absolute">
                <Image
                  src={ateamicon2}
                  priority
                  alt="Icon"
                  className="iconrotates"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="formsec pt-[10vh] pb-[14vh]">
          <div className="container mx-auto">
            <div className="items-center flex flex-col flex-wrap md:flex-row w-full justify-between contustop">
              <div className="flex contaddsboxs w-full">
                <div className="flex-1">
                  <div className="addsboxss adboxone">
                    <div className="addsIcon">
                      <Image src={phoneicon} alt="" />
                    </div>
                    <h3>Feel free to get in touch</h3>
                    <p>Give us a call today</p>
                    <p className="parabtn">
                      <Link href="tel:+919176917602">+91 9176 9176 02</Link>
                    </p>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="addsboxss adboxtwo">
                    <div className="addsIcon">
                      <Image src={mailicon} alt="" />
                    </div>
                    <h3>Write to us</h3>
                    <p>Send us an email</p>
                    <p className="parabtn">
                      <Link href="mailto:contactus@lunchbowl.co.in">
                        contactus@lunchbowl.co.in
                      </Link>
                    </p>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="addsboxss adboxthree">
                    <div className="addsIcon">
                      <Image src={locaticon} alt="" />
                    </div>
                    <h3>Where to Find Us</h3>
                    <p>Lunchbowl by Earth Tech Concepts Private Limited</p>
                    <p className="parabtn">
                      <Link href="https://maps.app.goo.gl/wHSi6cLKhQBkKd1q8" target="_blank" rel="noopener noreferrer">
                        1B, KG Natraj Palace, 53/22, <br />Saravana Street, T Nagar, <br />Chennai - 600017
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
              <div className="hidden md:w-full lg:w-5/12 lg:flex flex-col h-full contusmid">
                <Image src={contforming} alt="logo" className="block w-full" />
              </div>
              <div className="px-0 pb-2  flex flex-col md:flex-row formbox contuslast">
                <form
                  onSubmit={handleSubmit(submitHandler)}
                  className="w-full mx-auto flex flex-col justify-center"
                >
                  <div className="flex flex-col space-y-5">
                    <div className="flex flex-col md:flex-row space-y-5 md:space-y-0">
                      <div className="w-full md:w-1/2 inputbox">
                        <label>
                          FIRST NAME<sub>*</sub>
                        </label>
                        <Controller
                          name="firstname"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              // placeholder="Enter First Name"
                              fullWidth
                              InputProps={{
                                disableUnderline: true,
                                sx: {
                                  height: 48,
                                  border: '1.5px solid #ccc',
                                  borderRadius: 2,
                                  fontSize: '1rem',
                                  paddingLeft: '10px',
                                  backgroundColor: '#fff'
                                }
                              }}
                              sx={{ mt: 0.4 }}
                              error={!!errors.firstname}
                            />
                          )}
                        />
                        {errors.firstname && (
                          <p className="text-red-600 text-sm">{errors.firstname.message || "First name is required!"}</p>
                        )}
                      </div>
                      <div className="w-full md:w-1/2 md:ml-2.5 lg:ml-5 mt-2 md:mt-0 inputbox">
                        <label>
                          LAST NAME<sub>*</sub>
                        </label>
                        <Controller
                          name="Lastname"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              // placeholder="Enter Last Name"
                              fullWidth
                              InputProps={{
                                disableUnderline: true,
                                sx: {
                                  height: 48,
                                  border: '1.5px solid #ccc',
                                  borderRadius: 2,
                                  fontSize: '1rem',
                                  paddingLeft: '10px',
                                  backgroundColor: '#fff'
                                }
                              }}
                              sx={{ mt: 0.4 }}
                              error={!!errors.Lastname}
                            />
                          )}
                        />
                        {errors.Lastname && (
                          <p className="text-red-600 text-sm">{errors.Lastname.message || "Last name is required!"}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row space-y-5 md:space-y-0">
                      <div className="w-full md:w-1/2 inputbox">
                        <label>
                          MOBILE NUMBER<sub>*</sub>
                        </label>
                        <Controller
                          name="phone"
                          control={control}
                          rules={{
                            required: true,
                            pattern: /^[6-9]\d{9}$/,
                          }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              // placeholder="Enter Mobile Number"
                              fullWidth
                              type="tel"
                              InputProps={{
                                disableUnderline: true,
                                sx: {
                                  height: 48,
                                  border: '1.5px solid #ccc',
                                  borderRadius: 2,
                                  fontSize: '1rem',
                                  paddingLeft: '10px',
                                  backgroundColor: '#fff'
                                }
                              }}
                              sx={{ mt: 0.4 }}
                              error={!!errors.phone}
                            />
                          )}
                        />
                        {errors.phone && (
                          <p className="text-red-600 text-sm">{errors.phone.message || "Enter a valid 10-digit Indian mobile number."}</p>
                        )}
                      </div>
                      <div className="w-full md:w-1/2 md:ml-2.5 lg:ml-5 mt-2 md:mt-0 inputbox">
                        <label>
                          EMAIL<sub>*</sub>
                        </label>
                        <Controller
                          name="email"
                          control={control}
                          rules={{
                            required: true,
                            pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                          }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              // placeholder="Enter Email"
                              fullWidth
                              type="email"
                              InputProps={{
                                disableUnderline: true,
                                sx: {
                                  height: 48,
                                  border: '1.5px solid #ccc',
                                  borderRadius: 2,
                                  fontSize: '1rem',
                                  paddingLeft: '10px',
                                  backgroundColor: '#fff'
                                }
                              }}
                              sx={{ mt: 0.4 }}
                              error={!!errors.email}
                            />
                          )}
                        />
                        {errors.email && (
                          <p className="text-red-600 text-sm">{errors.email.message || "Enter a valid email address."}</p>
                        )}
                      </div>
                    </div>
                    <div className="relative mb-4 inputbox">
                      <label>
                        MESSAGE<sub>*</sub>
                      </label>
                      <Controller
                        name="message"
                        control={control}
                        rules={{
                          required: true,
                          minLength: 5,
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            // placeholder="Feel free to type here if you'd like to share something with us."
                            fullWidth
                            multiline
                            rows={2}
                            InputProps={{
                              disableUnderline: true,
                              sx: {
                                border: '1.5px solid #ccc',
                                borderRadius: 2,
                                fontSize: '1rem',
                                paddingLeft: '10px',
                                backgroundColor: '#fff'
                              }
                            }}
                            sx={{ mt: 0.4 }}
                            error={!!errors.message}
                          />
                        )}
                      />
                      {errors.message && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.message.message || "Message must be at least 5 characters."}
                        </p>
                      )}
                    </div>
                    <div className="relative mb-4 agreebox">
                      <div className="agreebox">
                        <Controller
                          name="consent"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  {...field}
                                  checked={field.value}
                                  onChange={(e) => field.onChange(e.target.checked)}
                                  sx={{ padding: 0 }}
                                />
                              }
                              label={
                                <label htmlFor="consent" className="text-sm cursor-pointer">
                                  I agree to be contacted by <strong>Lunch Bowl</strong> via call, SMS, email, or WhatsApp...
                                </label>
                              }
                            />
                          )}
                        />
                        {errors.consent && (
                          <p className="text-red-600 text-sm mt-1">{errors.consent.message || "Please agree to be contacted by Lunch Bowl."}</p>
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      <button disabled={loading} data-variant="flat" className="" type="submit">
                        <span>Submit</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
        <section className="HfaqSec relative bg-4AB138 flex">
          <div className="Hfaqinrow w-full relative py-[12vh]">
            <div className="container mx-auto">
              <div className="faqcontain py-[6vw] px-[8vw] bg-white relative">
                <div className="hfaqTitle combtntb comtilte mb-[4vh]">
                  <h4 className="text-[#000000]">Frequently Asked</h4>
                  <h3 className="flex flex-col text4AB138">
                    {" "}
                    <span className="block">Questions</span>{" "}
                  </h3>
                </div>
                <div className="hfaqAccordion ">
                  <Accordion items={faqItems} />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="contmapssec relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4610.708751752066!2d80.2405698!3d13.0379553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267002fc8e3ed%3A0xc8eb66b7d153fa91!2sKG%20NATARAJ%20PALACE!5e1!3m2!1sen!2sin!4v1750498617264!5m2!1sen!2sin"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </section>
      </div>
      <Mainfooter />
    </div>
  );
};

export default ContactUs;
