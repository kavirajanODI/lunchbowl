import OrderApi from 'api/OrderApi/orderApi';
import {ApiResponseModel} from 'src/model/apiResponseModel';
import {handleApiError} from 'utils/handleError';

class OrderService {
  static async getCustomerOrders(
    page: number = 1,
    limit: number = 20,
  ): Promise<ApiResponseModel> {
    try {
      const response = await OrderApi.getCustomerOrders(page, limit);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error fetching orders',
        data: null,
        error: handleApiError(error),
      };
    }
  }

  static async getOrderById(orderId: string): Promise<ApiResponseModel> {
    try {
      const response = await OrderApi.getOrderById(orderId);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error fetching order details',
        data: null,
        error: handleApiError(error),
      };
    }
  }
}

export default OrderService;
