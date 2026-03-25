import httpAxiosClient from '../../config/httpclient';

class PaymentApi {
  private paymentEndpoint: string;

  constructor() {
    this.paymentEndpoint = '/customer/get-payments';
  }

  async getPayments(userId: string) {
    return await httpAxiosClient.post(this.paymentEndpoint, {userId});
  }
}

export default new PaymentApi();
