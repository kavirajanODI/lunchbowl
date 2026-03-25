import requests from "./httpService";

const ProductServices = {
  getAllProducts: async ({ page, limit, category, title, price }) => {
    const searchCategory = category !== null ? category : "";
    const searchTitle = title !== null ? title : "";
    const searchPrice = price !== null ? price : "";

    return requests.get(
      `/products?page=${page}&limit=${limit}&category=${searchCategory}&title=${searchTitle}&price=${searchPrice}`
    );
  },

  getAllDishes: async ({
    page = 1,
    limit = 10,
    cuisine = "",
    title = "",
    status = "",
  }) => {
    // Clean title to avoid sending "null" as a string
    const cleanTitle = title && title !== "null" ? title : "";

    return requests.get(
      `/products/get-all-menu?page=${page}&limit=${limit}&title=${cleanTitle}`
    );
  },

  addDish: async (formData) => {
    return requests.post("/products/add-dish", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateDish: async (id, formData) => {
    return requests.put(`/products/update-dish/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getProductById: async (id) => {
    return requests.post(`/products/${id}`);
  },
  addProduct: async (body) => {
    return requests.post("/products/add", body);
  },
  addAllProducts: async (body) => {
    return requests.post("/products/all", body);
  },
  updateProduct: async (id, body) => {
    return requests.patch(`/products/${id}`, body);
  },
  updateManyProducts: async (body) => {
    return requests.patch("products/update/many", body);
  },
  updateStatus: async (id, body) => {
    return requests.put(`/products/status/${id}`, body);
  },

  deleteProduct: async (id) => {
    return requests.delete(`/products/${id}`);
  },
  deleteManyProducts: async (body) => {
    return requests.patch("/products/delete/many", body);
  },
};

export default ProductServices;
