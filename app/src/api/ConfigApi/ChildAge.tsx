import httpAxiosClient from '../../config/httpclient';

class ConfigApi {
  private foodEndpoint: string;

  constructor() {
    this.foodEndpoint = '/customer';
  }

  async getAgeLimits() {
    return await httpAxiosClient.get(`${this.foodEndpoint}/age-limits`);
  }
}

export default new ConfigApi();
