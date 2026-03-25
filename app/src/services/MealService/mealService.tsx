import mealsApi from 'api/MealsApi/mealsApi';
import {ApiResponseModel} from 'src/model/apiResponseModel';

class MealService {
  static async getAllMealsList(
  ): Promise<ApiResponseModel> {
    try {
      const response = await mealsApi.getAllMealsList();
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

export default MealService;
