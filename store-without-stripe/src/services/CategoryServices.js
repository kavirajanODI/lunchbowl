import requests from "./httpServices";

const CategoryServices = {
  getShowingCategory: async () => {
    return requests.get("/category/show");
  },

  getAllSchools: async () => {
    return requests.get("/schools/get-all-schools");
  },

  // getChildren: async (userId) => {
  //   return requests.post("/customer/get-all-children", { userId });
  // },

  getChildren: async (userId, path) => {
    const body = path ? { userId, path } : { userId };
    return requests.post("/customer/get-all-children", body);
  },

  // Add this new method to get payment details for a user
  getPayments: async (userId) => {
    return requests.post("/customer/get-payments", { userId });
  },
};

export default CategoryServices;
