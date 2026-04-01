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

  async getPerDayCost() {
    return await httpAxiosClient.get(`${this.getPlanPrice}`);
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

  async localPaymentSuccess(payload: {
    userId: string;
    orderId: string;
    transactionId: string;
  }) {
    return await httpAxiosClient.post('/customer/local-success', payload);
  }

  async renewalLocalPaymentSuccess(payload: {
    userId: string;
    orderId: string;
    transactionId: string;
    walletUsed?: number;
    remainingWallet?: number;
  }) {
    return await httpAxiosClient.post('/ccavenue/local-success', payload);
  }

  async addChildLocalPayment(payload: {
    userId: string;
    childrenData: any[];
    paymentInfo: {
      orderId: string;
      transactionId: string;
      subscriptionId: string;
      paymentAmount: number;
    };
  }) {
    return await httpAxiosClient.post(
      '/ccavenue/local-success/local-add-childPayment',
      payload,
    );
  }

  async freeTrialEnquiry(payload: {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    altMobileNumber?: string;
    doorNo: string;
    areaCity: string;
    pincode: string;
    schoolName: string;
    className: string;
    childName: string;
    datePreference?: string;
    food?: string;
    message?: string;
    userId: string;
  }) {
    return await httpAxiosClient.post('/admin/free-trial-enquiry', payload);
  }
}

export default new RegistrationApi();
