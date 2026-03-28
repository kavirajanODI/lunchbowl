import httpAxiosClient from '../../config/httpclient';

class PaymentApi {
  private paymentEndpoint: string;
  private localSuccessEndpoint: string;

  constructor() {
    this.paymentEndpoint = '/customer/get-payments';
    this.localSuccessEndpoint = '/ccavenue/local-success';
  }

  async getPayments(userId: string) {
    return await httpAxiosClient.post(this.paymentEndpoint, {userId});
  }

  async localPaymentSuccess(payload: {
    userId: string;
    orderId: string;
    transactionId: string;
  }) {
    return await httpAxiosClient.post(this.localSuccessEndpoint, payload);
  }
}

export default new PaymentApi();
