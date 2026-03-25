import requests from "./httpServices";

const AttributeServices = {
  getAllAttributes: async () => {
    return requests.get("/attributes");
  },

  getShowingAttributes: async () => {
    return requests.get(`/attributes/show`);
  },

  getAttributeById: async (id) => {
    return requests.get(`/attributes/${id}`);
  },

  getAllHolidays: async () => {
    const response = await requests.get("/holidays/get-all-holidays");
    // Ensure we always return an array
    return response.data || [];
  },
};

export default AttributeServices;
