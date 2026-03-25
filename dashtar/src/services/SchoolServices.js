import requests from "./httpService";

const SchoolServices = {
  getAllSchools: async () => {
    return requests.get("/schools/get-all-schools");
  },

  getSchoolById: async (id) => {
    return requests.get(`schools/get-school/${id}`);
  },

  addSchool: async (body) => {
    return requests.post("/schools/add-school", body);
  },

  updateSchool: async (id, body) => {
    return requests.put(`/schools/update-school/${id}`, body);
  },

  deleteSchool: async (id) => {
    return requests.delete(`/schools/delete-school/${id}`);
  },
};

export default SchoolServices;