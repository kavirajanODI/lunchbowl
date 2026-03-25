import foodApi from 'api/MyPlanApi/foodApi';
import {ApiResponseModel} from 'src/model/apiResponseModel';

class FoodService {
  static async createFood(foodData: any): Promise<ApiResponseModel> {
    try {
      const response = await foodApi.createFood(foodData);
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

  static async getFood(foodId: string): Promise<ApiResponseModel> {
    try {
      const response = await foodApi.getFood(foodId);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error fetching food item',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  static async updateFood(
    foodId: string,
    foodData: any,
  ): Promise<ApiResponseModel> {
    try {
      const response = await foodApi.updateFood(foodId, foodData);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error updating food item',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  static async deleteFood(foodId: string): Promise<ApiResponseModel> {
    try {
      const response = await foodApi.deleteFood(foodId);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error deleting food item',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  static async getAllFoods(
    path: string,
    userId: string,
  ): Promise<ApiResponseModel> {
    try {
      const response = await foodApi.getAllFoods(path, userId);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error fetching all food items',
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

export default FoodService;
