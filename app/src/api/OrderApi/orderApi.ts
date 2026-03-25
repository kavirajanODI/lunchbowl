import httpAxiosClient from '../../config/httpclient';

class OrderApi {
  private orderEndpoint: string;

  constructor() {
    this.orderEndpoint = '/order';
  }

  async getCustomerOrders(page: number = 1, limit: number = 20) {
    return await httpAxiosClient.get(this.orderEndpoint, {
      params: {page, limit},
    });
  }

  async getOrderById(orderId: string) {
    return await httpAxiosClient.get(`${this.orderEndpoint}/${orderId}`);
  }
}

export default new OrderApi();
