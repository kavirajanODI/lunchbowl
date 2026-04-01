import httpAxiosClient from '../../config/httpclient';

class PaymentApi {
  private paymentEndpoint: string;
  private accountDetailsEndpoint: string;

  constructor() {
    this.paymentEndpoint = '/customer/get-payments';
    this.accountDetailsEndpoint = '/customer/account-details';
  }

  async getPayments(userId: string) {
    return await httpAxiosClient.post(this.paymentEndpoint, {userId});
  }

  async getWallet(userId: string, page: number = 1, limit: number = 10) {
    return await httpAxiosClient.post(this.accountDetailsEndpoint, {
      userId,
      wallet: true,
      page,
      limit,
    });
  }
}

export default new PaymentApi();
