import httpAxiosClient from '../../config/httpclient';

class RegistrationApi {
  private registrationEndpoint: string;
  private AllSchoolEndpoint: string;
  private startSubs: string;
  private registrationCheckerEndPoint: string;
  private getPlanPrice:string;

  constructor() {
    this.registrationEndpoint = '/customer/stepForm-Register';
    this.AllSchoolEndpoint = '/schools/get-all-schools';
    this.startSubs = '/customer/form';
    this.registrationCheckerEndPoint = '/customer/Step-Check';
    this.getPlanPrice = '/customer/get-plan-price';

  }

  async createParentRegistration(registrationData: any) {
    return await httpAxiosClient.post(
      `${this.registrationEndpoint}`,
      registrationData,
    );
  }

  async getPerDayCost(registrationId: string) {
    return await httpAxiosClient.get(
      `${this.getPlanPrice}/${registrationId}`,
    );
  }


  async createChildRegistration(registrationData: any) {
    return await httpAxiosClient.post(
      `${this.registrationEndpoint}`,
      registrationData,
    );
  }

  async savePlansDetails(registrationData: any) {
    return await httpAxiosClient.post(
      `${this.registrationEndpoint}`,
      registrationData,
    );
  }

  async getRegisterdUserData(userId: string) {
    return await httpAxiosClient.get(`${this.startSubs}/${userId}`);
  }
  

  async startSubscription(payloadData: any) {
    return await httpAxiosClient.post(`${this.startSubs}`, payloadData);
  }

  async getAllSchools() {
    return await httpAxiosClient.get(`${this.AllSchoolEndpoint}/`);
  }

  async getRegistration(registrationId: string) {
    return await httpAxiosClient.get(
      `${this.registrationEndpoint}/${registrationId}`,
    );
  }
  
    async registrationCheck(payloadData: { _id: string; path: string }) {
    return await httpAxiosClient.post(`${this.registrationCheckerEndPoint}`, payloadData);
  }

  async updateRegistration(registrationId: string, registrationData: any) {
    return await httpAxiosClient.put(
      `${this.registrationEndpoint}/${registrationId}`,
      registrationData,
    );
  }

  async deleteRegistration(registrationId: string) {
    return await httpAxiosClient.delete(
      `${this.registrationEndpoint}/${registrationId}`,
    );
  }

  async getAllRegistrations(path: string, userId: string) {
    return await httpAxiosClient.post(`${this.registrationEndpoint}/get-all`, {
      _id: userId,
      path,
    });
  }

  async getParentAndChildren(userId: string) {
    return await httpAxiosClient.get(`${this.startSubs}/${userId}`);
  }

  async updateParentDetails(payload: {
    formData: any;
    _id: string;
    path: string;
  }) {
    return await httpAxiosClient.post(this.registrationEndpoint, payload);
  }

  async updateChildrenDetails(payload: {
    formData: any[];
    _id: string;
    path: string;
  }) {
    return await httpAxiosClient.post(this.registrationEndpoint, payload);
  }

  async deleteChild(userId: string, childId: string) {
    return await httpAxiosClient.post('/customer/delete-child', {
      userId,
      childId,
    });
  }
}

export default new RegistrationApi();
