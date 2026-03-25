import PaymentApi from 'api/PaymentApi/paymentApi';
import {ApiResponseModel} from 'src/model/apiResponseModel';
import {handleApiError} from 'utils/handleError';

class PaymentService {
  static async getPayments(userId: string): Promise<ApiResponseModel> {
    try {
      const response = await PaymentApi.getPayments(userId);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error fetching payments',
        data: null,
        error: handleApiError(error),
      };
    }
  }
}

export default PaymentService;
