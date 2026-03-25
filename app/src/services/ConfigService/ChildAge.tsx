import {ApiResponseModel} from 'src/model/apiResponseModel';
import ConfigApi from 'api/ConfigApi/ChildAge';

class ConfigService {
  static async GetChildAges(): Promise<ApiResponseModel> {
    try {
      const response = await ConfigApi.getAgeLimits();
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error creating food item',
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
export default ConfigService;
