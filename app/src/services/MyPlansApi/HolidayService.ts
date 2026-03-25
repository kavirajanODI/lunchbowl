import { ApiResponseModel } from 'src/model/apiResponseModel';
import holidaysApi from '../../api/MyPlanApi/holidayApi';

class HolidayService {
  static async createHoliday(holidayData: any): Promise<ApiResponseModel> {
    try {
      const response = await holidaysApi.createHoliday(holidayData);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error creating holiday',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  static async getHoliday(holidayId: string): Promise<ApiResponseModel> {
    try {
      const response = await holidaysApi.getHoliday(holidayId);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error fetching holiday',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  static async updateHoliday(holidayId: string, holidayData: any): Promise<ApiResponseModel> {
    try {
      const response = await holidaysApi.updateHoliday(holidayId, holidayData);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error updating holiday',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  static async deleteHoliday(holidayId: string): Promise<ApiResponseModel> {
    try {
      const response = await holidaysApi.deleteHoliday(holidayId);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error deleting holiday',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  static async getAllHolidays(): Promise<ApiResponseModel> {
    try {
      const response = await holidaysApi.getAllHolidays();
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error fetching all holidays',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  private static handleApiError(error: any): string {
    if (error.response) {
      return `Error: ${error.response.data?.message || 'An unexpected error occurred'}`;
    } else if (error.request) {
      return 'No response from server';
    } else {
      return `Error: ${error.message}`;
    }
  }
}

export default HolidayService;
