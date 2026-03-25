import PlansApi from 'api/SubscriptionApi/Plans';
import {ApiResponseModel} from 'src/model/apiResponseModel';

class SubscriptionService {
  // static async payAmount(payload:string): Promise<ApiResponseModel> {
  //   try {
  //     const response = await PlansApi.payAmount(payload);
  //     return response.data as ApiResponseModel;
  //   } catch (error: any) {
  //     return {
  //       success: false,
  //       message: 'Error creating registration',
  //       data: null,
  //       error: this.handleApiError(error),
  //     };
  //   }
  // }

  static async getPlans(): Promise<ApiResponseModel> {
    try {
      const response = await PlansApi.getAllPlans();
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error creating registration',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  private static handleApiError(error: any): string {
    if (error.response) {
      return `Error: ${
        error.response.data?.message || 'An unexpected error occurred'
      }`;
    } else if (error.request) {
      return 'No response from server';
    } else {
      return `Error: ${error.message}`;
    }
  }
}

export default SubscriptionService;
