import React, { useEffect } from "react";
import Image from "next/image";
import Slider from "react-slick";
import { Dialog, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Proimgtwobiriyani from "../../../public/home/biriyani-img-two.png";
import config from "./config";

const ProdetilProps = ({ open, onClose, product }) => {

  useEffect(() => {
    console.log("product changed:", product);
  }, [product]);
  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    fade: true,
  };
  console.log("product------->", product)
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      className="propetilpopus"
    >
      <IconButton
        className="popClose"
        onClick={onClose}
        sx={{ position: "absolute", top: 16, right: 16 }}
      >
        <CloseIcon />
      </IconButton>

      <div className="propetPopBox flex">
        {/* Left Side: Slider and Title */}
        <div className="popbimg w-[45%] bg-FFF4D7 overflow-hidden relative p-[2vw]">
          <div className="fontanimi pointer-events-none">
            <div className="animitext animiOne">
              <div className="animiintext">
              <span>{product?.primaryDishTitle || "Dish Title"}</span>
                <span>{product?.primaryDishTitle || "Dish Title"}</span></div>
            </div>
            <div className="animitext animiTwo">
              <div className="animiintext">
                <span>{product?.primaryDishTitle || "Dish Title"}</span>
                <span>{product?.primaryDishTitle || "Dish Title"}</span></div>
            </div>
          </div>
          <div className="slider-container flex items-center">
            <Slider {...settings} className="Prodeilsliders">
              <div>
                <div className="flex-1 teamboximg overflow-hidden">
                  <Image
                    className="w-full h-auto m-auto"
                    priority
                    unoptimized
                    crossorigin="anonymous"
                    src={
                      product.dishImage2
                        ? product.dishImage2.startsWith("http")
                          ? product.dishImage2
                          : `${config.BASE_URL}${
                          product.dishImage2.startsWith("/")
                            ? product.dishImage2
                            : `/${product.dishImage2}`
                            }`
                        : Proimgtwobiriyani
                    }
                    alt={product?.primaryDishTitle || "Dish Image"}
                    width={500}
                    height={500}
                  />
                </div>
              </div>
              <div>
                <div className="flex-1 teamboximg  overflow-hidden">
                  <Image
                    className="w-full h-auto m-auto"
                    priority
                    unoptimized
                    crossorigin="anonymous"
                    src={
                      product.image
                        ? product.image.startsWith("http")
                          ? product.image
                          : `${config.BASE_URL}${
                              product.image.startsWith("/")
                                ? product.image
                                : `/${product.image}`
                            }`
                        : Proimgtwobiriyani
                    }
                    alt={product?.primaryDishTitle || "Dish Image"}
                    width={500}
                    height={500}
                  />
                </div>
              </div>
            </Slider>
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div className="popbcont w-[55%] p-[3.5vw]">
          {/* Cuisine Type */}
          {/*<div className="mb-[2vh]">
            <span className="text-sm font-medium text-gray-500">Cuisine:</span>
            <span className="ml-2 text-sm font-semibold">
              {product?.cuisine || "Not specified"}
            </span>
          </div>*/}

          {/* Main Title and Subtitle */}
          <div className="popbcontbox mb-[2vh]">
            <h3 className="text-3xl font-bold">
              {product?.primaryDishTitle || "Dish Title"}
            </h3>
            {/*<h2 className="text-2xl text-gray-600">
              with {product?.subDishTitle || "Sub Dish"}
            </h2>*/}
          </div>

          {/* Short Description */}
          <div className="popbcontbox mb-[4vh]">
            <p className="text-lg text-gray-700">
              {product?.description || "Short description not available"}
            </p>
          </div>

          {/* Full Description */}
          <div className="popbcontbox mb-[4vh]">
            <h3 className="text-xl font-semibold mb-2">Ingredients</h3>
            <p className="text-gray-700">
              {product?.Idescription || "Detailed description not available"}
            </p>
          </div>

          {/* Ingredients (You can make this dynamic if your data includes it) */}
          <div className="popbcontbox">
            <h3 className="text-xl font-semibold mb-2">Nutrition Value</h3>
            {/*<ul className="list-disc pl-5 text-gray-700">
              <li>{product?.nutritionValues[0] || "main ingredient"}</li>
              <li>{product?.nutritionValues[1] || "side ingredient"}</li>
              <li></li>
              <li></li>
            </ul>*/}
            <ul className="list-disc text-gray-700">
              {Array.isArray(product?.nutritionValues) && product.nutritionValues.length > 0 ? (
                product.nutritionValues.map((value, idx) => (
                  <li key={idx}>{value}</li>
                ))
              ) : (
                <>
                  <li>main ingredient</li>
                  <li>side ingredient</li>
                </>
              )}
            </ul>

          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ProdetilProps;
