import httpAxiosClient from '../../config/httpclient';

class PlansApi {
  private registrationEndpoint: string;

  constructor() {
    this.registrationEndpoint = '/customer/get-plans';
    // api/ccavenue/initiate
  }

  // async payAmount(payload:string) {
  //   return await httpAxiosClient.post(
  //     `${this.registrationEndpoint}`,payload
  //   );
  // }
  async getAllPlans() {
    return await httpAxiosClient.post(
      `${this.registrationEndpoint}`,
    );
  }
}
export default new PlansApi();
