import React, { useState } from 'react';
import Image from "next/image";
import Proimgbiriyani from "../../../public/home/biriyani-img.png";
import Proimgtwobiriyani from "../../../public/home/biriyani-img-two.png";
import logtrialicon from "../../../public/logtrial-icon.svg";
import ProdetilProps from "@components/product/ProdetilProps";
import ProductServices from "../../services/ProductServices";
import useAsync from "../../hooks/useAsync";
import config from "./config"; // Assuming config.js is in the same directory
import productsData from "../../jsonHelper/products.json";
import biriyaniImg from "../../../public/menu/biriyani-img.png";
import Slider from 'react-slick';

const HomeProductCard = ({ limit }) => {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const {
    data: products = [], // Initialize as empty array if undefined
    loading,
    error,
    reload,
  } = useAsync(ProductServices.getAllMenuDishes);

  const handleOpenDialog = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  // State for the selected cuisine filter
  const [selectedCuisine, setSelectedCuisine] = useState("");

  // Get unique cuisines from product data (only active products)
  const cuisines = [
    ...new Set(
      products
        .filter((product) => product?.status === "active")
        .map((item) => item?.cuisine)
        .filter(Boolean) // Remove any undefined/null values
    ),
  ];

  // Filter products based on selected cuisine and active status
  const filteredProducts = products
    .filter((product) => product?.status === "active")
    .filter((product) =>
      selectedCuisine ? product?.cuisine === selectedCuisine : true
    );

  const displayedProducts = limit
    ? filteredProducts.slice(0, limit)
    : filteredProducts;

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error loading products: {error.message}</div>;
  }

  if (!products.length) {
    return <div>No products available</div>;
  }

  const sliderSettings = {
    dots: false,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768, // Mobile
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024, // Tablet & Above — Disable Slider
        settings: "unslick",
      },
    ],
  };

  return (
    <div>
      {/* Filter Component */}
      <div className="ProdfilterBox mb-6">
        <ul className="flex justify-center gap-4">
          <li className={`${selectedCuisine === "" ? "active" : ""}`}>
            <button
              className="filter-btn"
              onClick={() => setSelectedCuisine("")}
            >
              All
            </button>
          </li>
          {/* Dynamically generate filter buttons */}
          {cuisines.map((cuisine, index) => (
            <li
              key={index}
              className={`${selectedCuisine === cuisine ? "active" : ""}`}
            >
              <button
                className="filter-btn"
                onClick={() => setSelectedCuisine(cuisine)}
              >
                {cuisine}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-row flex-wrap produtDeskView">
        {displayedProducts.map((item, index) => (
          <div
            key={item._id || index}
            className="group progroupitem bg-FFF4D7 basis-sm flex-none relative rounded-[15px] overflow-hidden"
            onClick={() => handleOpenDialog(item)}
          >
            <div className="proboxfront px-[2vw] py-[5vh] bg-FFF4D7 relative z-50 group-hover:z-0">
              <div className="fontanimi pointer-events-none">
                <div className="animitext animiOne">
                  <div className="animiintext">
                    <span>
                      {item.primaryDishTitle} {item.subDishTitle}
                    </span>
                    <span>
                      {item.primaryDishTitle} {item.subDishTitle}
                    </span>
                  </div>
                  <div className="animiintext">
                    <span>
                      {item.subDishTitle} {item.primaryDishTitle}
                    </span>
                    <span>
                      {item.subDishTitle} {item.primaryDishTitle}
                    </span>
                  </div>
                </div>
                <div className="animitext animiTwo">
                  <div className="animiintext">
                    <span>
                      {item.primaryDishTitle} {item.subDishTitle}
                    </span>
                    <span>
                      {item.primaryDishTitle} {item.subDishTitle}
                    </span>
                  </div>
                  <div className="animiintext">
                    <span>
                      {item.subDishTitle} {item.primaryDishTitle}
                    </span>
                    <span>
                      {item.subDishTitle} {item.primaryDishTitle}
                    </span>
                  </div>
                </div>
              </div>
              <div className="profbboxs">
                <div className="textcenter proboxtitle mb-[3vh]">
                  <h5>{item.primaryDishTitle}</h5>
                  {/*<h3>{item.subDishTitle}</h3>*/}
                  <p>{item.shortDescription}</p>
                </div>
                <div className="proImage">
                  <Image
                    className="w-full h-auto"
                    priority
                    unoptimized
                    crossorigin="anonymous"
                    src={
                      item.dishImage2
                        ? item.dishImage2.startsWith("http")
                          ? item.dishImage2
                          : `${config.BASE_URL}${
                          item.dishImage2.startsWith("/")
                            ? item.dishImage2
                            : `/${item.dishImage2}`
                            }`
                        : Proimgtwobiriyani
                    }
                    alt={`${item.primaryDishTitle} ${item.subDishTitle}`}
                    width={500}
                    height={500}
                  />
                </div>
              </div>
            </div>

            <div className="proboxBack px-[2vw] py-[3vh] bg-FFF4D7 absolute w-full h-full top-0 left-0 opacity-0 z-0 transition transition-all duration-[1s] ease-in-out group-hover:opacity-100 group-hover:z-50">
              <div className="arrowIcon absolute right-[2vw] top-[5vh] w-[45px] aspect-square bg-white rounded-full p-[12px]">
                <Image
                  className="w-full h-auto"
                  priority
                  src={logtrialicon}
                  alt="Logo Icon"
                />
              </div>
              <div className="fontanimi pointer-events-none">
                <div className="animitext animiOne">
                  <div className="animiintext">
                    <span>
                      {item.primaryDishTitle} {item.subDishTitle}
                    </span>
                    <span>
                      {item.primaryDishTitle} {item.subDishTitle}
                    </span>
                  </div>
                  <div className="animiintext">
                    <span>
                      {item.subDishTitle} {item.primaryDishTitle}
                    </span>
                    <span>
                      {item.subDishTitle} {item.primaryDishTitle}
                    </span>
                  </div>
                </div>
                <div className="animitext animiTwo">
                  <div className="animiintext">
                    <span>
                      {item.primaryDishTitle} {item.subDishTitle}
                    </span>
                    <span>
                      {item.primaryDishTitle} {item.subDishTitle}
                    </span>
                  </div>
                  <div className="animiintext">
                    <span>
                      {item.subDishTitle} {item.primaryDishTitle}
                    </span>
                    <span>
                      {item.subDishTitle} {item.primaryDishTitle}
                    </span>
                  </div>
                </div>
              </div>
              <div className="profbboxs relative h-full flex flex-col">
                <div className="proImage px-[2vw] h-full flex items-center">
                  <Image
                    className="w-full h-auto"
                    crossorigin="anonymous"
                    priority
                    unoptimized
                    src={
                      item.image
                        ? item.image.startsWith("http")
                          ? item.image
                          : `${config.BASE_URL}${
                              item.image.startsWith("/")
                                ? item.image
                                : `/${item.image}`
                            }`
                        : Proimgtwobiriyani
                    }
                    alt={`${item.primaryDishTitle || ""} ${
                      item.subDishTitle || ""
                    }`.trim()}
                    width={500}
                    height={500}
                  />
                </div>
                
              </div>
            </div>
          </div>
        ))}
      </div>

      <Slider {...sliderSettings} className="produtMobView">
        {displayedProducts.map((item, index) => (
          <div
            key={item._id || index}
            className="group progroupitem bg-FFF4D7 basis-sm flex-none relative rounded-[15px] overflow-hidden"
            onClick={() => handleOpenDialog(item)}
          >
            <div className="proboxfront px-[2vw] py-[5vh] bg-FFF4D7 relative z-50 group-hover:z-0">
              {/* Animation text sections remain the same */}
              <div className="profbboxs">
                <div className="textcenter proboxtitle mb-[3vh]">
                  <h5>{item.primaryDishTitle}</h5>
                  <h3>{item.subDishTitle}</h3>
                  <p>{item.shortDescription}</p>
                </div>
                <div className="proImage">
                   <Image
                    className="w-full h-auto"
                    priority
                    unoptimized
                    crossorigin="anonymous"
                    src={
                      item.dishImage2
                        ? item.dishImage2.startsWith("http")
                          ? item.dishImage2
                          : `${config.BASE_URL}${
                          item.dishImage2.startsWith("/")
                            ? item.dishImage2
                            : `/${item.dishImage2}`
                            }`
                        : Proimgtwobiriyani
                    }
                    alt={`${item.primaryDishTitle} ${item.subDishTitle}`}
                    width={500}
                    height={500}
                  />
                </div>
              </div>
            </div>

            <div className="proboxBack px-[2vw] py-[3vh] bg-FFF4D7 absolute w-full h-full top-0 left-0 opacity-0 z-0 transition transition-all duration-[1s] ease-in-out group-hover:opacity-100 group-hover:z-50">
              <div className="arrowIcon absolute right-[2vw] top-[5vh] w-[45px] aspect-square bg-white rounded-full p-[12px]">
                <Image
                  className="w-full h-auto"
                  priority
                  src={logtrialicon}
                  alt="Logo Icon"
                />
              </div>
              {/* Animation text sections remain the same */}
              <div className="profbboxs relative h-full flex flex-col">
                <div className="proImage px-[2vw] h-full flex items-center">
                    <Image
                    className="w-full h-auto"
                    crossorigin="anonymous"
                    priority
                    unoptimized
                    src={
                      item.image
                        ? item.image.startsWith("http")
                          ? item.image
                          : `${config.BASE_URL}${
                              item.image.startsWith("/")
                                ? item.image
                                : `/${item.image}`
                            }`
                        : Proimgtwobiriyani
                    }
                    alt={`${item.primaryDishTitle || ""} ${
                      item.subDishTitle || ""
                    }`.trim()}
                    width={500}
                    height={500}
                  />
                </div>
                <div className="nutritionboxs mt-[auto] flex flex-wrap">
                  {/* Nutrition items remain the same */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {selectedProduct && (
        <ProdetilProps
          open={open}
          onClose={handleCloseDialog}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default HomeProductCard;