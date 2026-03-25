import requests from "./httpServices";

const ProductServices = {
  getShowingProducts: async () => {
    return requests.get("/products/show");
  },
  getShowingStoreProducts: async ({ category = "", title = "", slug = "" }) => {
    return requests.get(
      `/products/store?category=${category}&title=${title}&slug=${slug}`
    );
  },
  getDiscountedProducts: async () => {
    return requests.get("/products/discount");
  },

  getProductBySlug: async (slug) => {
    return requests.get(`/products/${slug}`);
  },

  // getAllDishes: async ({
  //   page = 1,
  //   limit = 10,
  //   cuisine = "",
  //   title = "",
  //   status = "",
  // }) => {
  //   // Clean title to avoid sending "null" as a string
  //   const cleanTitle = title && title !== "null" ? title : "";

  //   return requests.get(
  //     `/products/get-all-menu?page=${page}&limit=${limit}&title=${cleanTitle}`
  //   );
  // },

  getAllMenuDishes: async () => {
    return requests.get("/products/get-all-menu-dishes");
  },
};

export default ProductServices;
